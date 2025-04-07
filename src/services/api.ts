
import { toast } from 'sonner';
import secureStore from '@/utils/encryption';

// Base API URL - this would be configured based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// API endpoints
export const ENDPOINTS = {
  // Pest detection
  DETECT: '/api/v1/detect',
  
  // Environmental sensors
  TEMPERATURE: '/api/v1/sensors/temperature',
  HUMIDITY: '/api/v1/sensors/humidity',
  CO2: '/api/v1/sensors/co2',
  SOIL: '/api/v1/sensors/soil',
  
  // Decision engine
  RECOMMENDATIONS: '/api/v1/recommendations',
  
  // Voice commands
  VOICE_PROCESS: '/api/v1/voice/process',
  
  // Auth
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  REFRESH_TOKEN: '/api/v1/auth/refresh',
};

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

// API error interface
export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

// Function to get the authentication token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// API request options
interface RequestOptions {
  authorized?: boolean;
  headers?: Record<string, string>;
  mockResponse?: any;
  mockDelay?: number;
  fallbackToMock?: boolean;
  encryptRequest?: boolean;
  compressRequest?: boolean;
  cacheDuration?: number;
  retries?: number;
  priority?: 'high' | 'normal' | 'low';
}

// Queue for storing offline requests
const offlineRequestsQueue: Array<{
  endpoint: string;
  method: string;
  body?: any;
  options: RequestOptions;
  timestamp: number;
}> = [];

// Initialize the offline queue from localStorage
try {
  const storedQueue = localStorage.getItem('offline_requests_queue');
  if (storedQueue) {
    const parsedQueue = JSON.parse(storedQueue);
    if (Array.isArray(parsedQueue)) {
      offlineRequestsQueue.push(...parsedQueue);
    }
  }
} catch (error) {
  console.error('Failed to load offline requests queue:', error);
}

// Save the offline queue to localStorage
const saveOfflineQueue = () => {
  try {
    localStorage.setItem('offline_requests_queue', JSON.stringify(offlineRequestsQueue));
  } catch (error) {
    console.error('Failed to save offline requests queue:', error);
  }
};

// Function to compress request data
const compressData = async (data: any): Promise<string> => {
  if (!data) return '';
  
  // In a real implementation, this would use compression algorithms
  // For now, we'll just convert to JSON and return
  return JSON.stringify(data);
};

// Function to decompress response data
const decompressData = async (data: string): Promise<any> => {
  if (!data) return null;
  
  // In a real implementation, this would use decompression algorithms
  // For now, we'll just parse JSON and return
  return JSON.parse(data);
};

// Cache handler for response caching
const apiCache = {
  async get<T>(cacheKey: string): Promise<{ data: T; timestamp: number } | null> {
    try {
      const cachedData = await secureStore.getItem<{ data: T; timestamp: number }>(cacheKey);
      return cachedData;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  },
  
  async set<T>(cacheKey: string, data: T, duration: number): Promise<void> {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + duration
      };
      
      await secureStore.setItem(cacheKey, cacheData);
    } catch (error) {
      console.error('Cache storage error:', error);
    }
  },
  
  async isCacheValid(cacheKey: string, maxAge: number): Promise<boolean> {
    try {
      const cachedData = await secureStore.getItem<{ timestamp: number }>(cacheKey);
      if (!cachedData) return false;
      
      const age = Date.now() - cachedData.timestamp;
      return age < maxAge;
    } catch (error) {
      console.error('Cache validation error:', error);
      return false;
    }
  }
};

// Generate a cache key for a request
const generateCacheKey = (endpoint: string, method: string, body?: any): string => {
  let key = `${method}_${endpoint}`;
  
  if (body && method !== 'GET') {
    // For non-GET requests with a body, include a hash of the body
    try {
      key += `_${JSON.stringify(body)}`;
    } catch (error) {
      console.error('Error generating cache key:', error);
    }
  }
  
  return key;
};

// Generic fetch function with authentication, error handling, offline support, and performance optimizations
export async function fetchApi<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  options: RequestOptions = { authorized: true, fallbackToMock: true }
): Promise<ApiResponse<T>> {
  const { 
    authorized = true, 
    headers = {}, 
    mockResponse, 
    mockDelay, 
    fallbackToMock = true,
    encryptRequest = false,
    compressRequest = false,
    cacheDuration = 0,
    retries = 3,
    priority = 'normal'
  } = options;
  
  // Generate cache key for potential caching
  const cacheKey = generateCacheKey(endpoint, method, body);
  
  // Check cache for GET requests when cache duration is specified
  if (method === 'GET' && cacheDuration > 0) {
    const isValid = await apiCache.isCacheValid(cacheKey, cacheDuration);
    if (isValid) {
      const cachedResponse = await apiCache.get<T>(cacheKey);
      if (cachedResponse) {
        return {
          success: true,
          data: cachedResponse.data,
          message: 'Retrieved from cache',
          statusCode: 304, // Not Modified
        };
      }
    }
  }
  
  // Check for offline status
  if (!navigator.onLine) {
    toast.warning('You are offline. Using cached data.');
    
    // For GET requests, try to retrieve from cache regardless of age
    if (method === 'GET') {
      const cachedResponse = await apiCache.get<T>(cacheKey);
      if (cachedResponse) {
        return {
          success: true,
          data: cachedResponse.data,
          message: 'Using cached data (offline mode)',
          statusCode: 200,
        };
      }
    }
    
    // For non-GET requests, add to offline queue for later sync
    if (method !== 'GET') {
      offlineRequestsQueue.push({
        endpoint,
        method,
        body,
        options,
        timestamp: Date.now()
      });
      
      saveOfflineQueue();
      
      toast.info('Request queued for later sync', {
        description: 'Will be sent when connection is restored'
      });
    }
    
    // If mockResponse is provided, return it after a delay
    if (mockResponse && fallbackToMock) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockResponse,
            message: 'Using simulated data (offline mode)',
          });
        }, mockDelay || 500);
      });
    }
    
    return {
      success: false,
      error: 'Network is offline',
      message: 'Cannot connect to server. Please check your connection.',
      statusCode: 0,
    };
  }
  
  // Prepare request headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  
  // Add auth token if needed
  if (authorized) {
    const token = getAuthToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      // Redirect to login if no token is found
      toast.error('Authentication required. Please log in.');
      window.location.href = '/login';
      return {
        success: false,
        error: 'Authentication required',
        message: 'Please log in to continue',
        statusCode: 401,
      };
    }
  }
  
  // Add performance metrics headers
  if (typeof performance !== 'undefined') {
    // Add navigation timing data if available
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    if (navigationTiming) {
      requestHeaders['X-Client-Load-Time'] = navigationTiming.duration.toString();
    }
  }
  
  // Add priority hints
  if (priority === 'high') {
    requestHeaders['Priority'] = 'high';
  } else if (priority === 'low') {
    requestHeaders['Priority'] = 'low';
  }
  
  let retryCount = 0;
  const maxRetries = retries;
  
  const performRequest = async (): Promise<ApiResponse<T>> => {
    try {
      // Prepare request body
      let processedBody = body;
      
      if (body) {
        // Encrypt the request body if required
        if (encryptRequest) {
          const encryptionKey = await secureStore.getOrCreateKey();
          processedBody = await secureStore.encryptData(body, encryptionKey);
          requestHeaders['X-Encrypted'] = 'true';
        }
        
        // Compress the request body if required
        if (compressRequest) {
          processedBody = await compressData(processedBody);
          requestHeaders['Content-Encoding'] = 'gzip';
        }
      }
      
      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include', // Include cookies for sessions
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && processedBody) {
        requestOptions.body = typeof processedBody === 'string' 
          ? processedBody 
          : JSON.stringify(processedBody);
      }
      
      // Record the start time for performance measurement
      const startTime = performance.now();
      
      // Make the API request
      const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
      
      // Calculate request duration
      const duration = performance.now() - startTime;
      
      // Log performance for slow requests
      if (duration > 1000) {
        console.warn(`Slow API request to ${endpoint}: ${duration.toFixed(0)}ms`);
      }
      
      // Check for HTTP errors
      if (!response.ok) {
        // Try to parse error response
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = {
            message: 'An unknown error occurred',
            statusCode: response.status,
          };
        }
        
        // Check if we should retry
        if (retryCount < maxRetries && (response.status >= 500 || response.status === 429)) {
          retryCount++;
          
          // Exponential backoff for retries
          const delay = Math.min(1000 * 2 ** retryCount, 10000);
          
          toast.info(`Retrying request (${retryCount}/${maxRetries})`, {
            description: `Will retry in ${delay / 1000} seconds`
          });
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return performRequest();
        }
        
        // Show error toast
        toast.error(errorData.message || `Error: ${response.status}`);
        
        // Return error response
        return {
          success: false,
          error: errorData.message,
          statusCode: response.status,
          message: errorData.message,
        };
      }
      
      // Parse success response
      let responseData: any;
      
      // Handle different content types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else if (contentType && contentType.includes('text/')) {
        responseData = await response.text();
      } else {
        // Handle binary data if needed
        responseData = await response.blob();
      }
      
      // Check if response is encrypted
      if (response.headers.get('X-Encrypted') === 'true') {
        const encryptionKey = await secureStore.getOrCreateKey();
        responseData = await secureStore.decryptData(responseData, encryptionKey);
      }
      
      // Check if response is compressed
      if (response.headers.get('Content-Encoding') === 'gzip') {
        responseData = await decompressData(responseData);
      }
      
      // Cache the response if it's a GET request and cache duration is specified
      if (method === 'GET' && cacheDuration > 0) {
        await apiCache.set(cacheKey, responseData, cacheDuration);
      }
      
      return {
        success: true,
        data: responseData,
        message: 'Request successful',
        statusCode: response.status,
      };
    } catch (error) {
      console.error('API request failed:', error);
      
      // Check if we should retry
      if (retryCount < maxRetries) {
        retryCount++;
        
        // Exponential backoff for retries
        const delay = Math.min(1000 * 2 ** retryCount, 10000);
        
        toast.info(`Retrying request (${retryCount}/${maxRetries})`, {
          description: `Will retry in ${delay / 1000} seconds`
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return performRequest();
      }
      
      // If we have a mock response and are configured to fall back, use it
      if (mockResponse && fallbackToMock) {
        toast.warning('Using simulated data due to connection issues');
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              data: mockResponse,
              message: 'Using simulated data (API error fallback)',
            });
          }, mockDelay || 500);
        });
      }
      
      // Show error toast
      toast.error('Failed to connect to server');
      
      // Return error response
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to connect to the server',
        statusCode: 0,
      };
    }
  };
  
  return performRequest();
}

// Process offline queue when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    // Check if we have offline requests to process
    if (offlineRequestsQueue.length > 0) {
      toast.info(`Processing ${offlineRequestsQueue.length} pending requests`, {
        description: 'Syncing data to server'
      });
      
      const requestsToProcess = [...offlineRequestsQueue];
      offlineRequestsQueue.length = 0;
      saveOfflineQueue();
      
      // Process each request
      for (const request of requestsToProcess) {
        try {
          await fetchApi(
            request.endpoint,
            request.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
            request.body,
            request.options
          );
        } catch (error) {
          console.error('Failed to process offline request:', error);
          
          // Re-add failed request to queue
          offlineRequestsQueue.push(request);
          saveOfflineQueue();
        }
      }
      
      // Update queue in storage
      saveOfflineQueue();
      
      // Notify service worker to sync data
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(registration => {
          if ('sync' in registration) {
            (registration as any).sync.register('sync-data').catch((err: Error) => {
              console.error('Sync registration failed:', err);
            });
          }
        });
      }
    }
  });
}

// Helper methods for common API operations
export const apiService = {
  get: <T>(endpoint: string, options?: RequestOptions) => fetchApi<T>(endpoint, 'GET', undefined, options),
  post: <T>(endpoint: string, body: any, options?: RequestOptions) => fetchApi<T>(endpoint, 'POST', body, options),
  put: <T>(endpoint: string, body: any, options?: RequestOptions) => fetchApi<T>(endpoint, 'PUT', body, options),
  delete: <T>(endpoint: string, options?: RequestOptions) => fetchApi<T>(endpoint, 'DELETE', undefined, options),
  
  // Method to process all pending offline requests
  processPendingRequests: async (): Promise<void> => {
    if (!navigator.onLine) {
      toast.error('Cannot process pending requests while offline');
      return;
    }
    
    if (offlineRequestsQueue.length === 0) {
      toast.info('No pending requests to process');
      return;
    }
    
    toast.info(`Processing ${offlineRequestsQueue.length} pending requests`);
    
    const requestsToProcess = [...offlineRequestsQueue];
    offlineRequestsQueue.length = 0;
    saveOfflineQueue();
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const request of requestsToProcess) {
      try {
        await fetchApi(
          request.endpoint,
          request.method as 'GET' | 'POST' | 'PUT' | 'DELETE',
          request.body,
          request.options
        );
        successCount++;
      } catch (error) {
        console.error('Failed to process offline request:', error);
        failureCount++;
        
        // Re-add failed request to queue
        offlineRequestsQueue.push(request);
      }
    }
    
    saveOfflineQueue();
    
    toast.success(`Processed ${successCount} requests successfully`, {
      description: failureCount > 0 ? `${failureCount} requests failed and will be retried later` : undefined
    });
  },
  
  // Method to clear all pending offline requests
  clearPendingRequests: (): void => {
    const count = offlineRequestsQueue.length;
    offlineRequestsQueue.length = 0;
    saveOfflineQueue();
    
    toast.success(`Cleared ${count} pending requests`);
  }
};
