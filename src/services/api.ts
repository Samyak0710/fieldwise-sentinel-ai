
import { toast } from 'sonner';

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
}

// Generic fetch function with authentication, error handling, and offline support
export async function fetchApi<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  options: RequestOptions = { authorized: true, fallbackToMock: true }
): Promise<ApiResponse<T>> {
  const { authorized = true, headers = {}, mockResponse, mockDelay, fallbackToMock = true } = options;
  
  // Check for offline status
  if (!navigator.onLine) {
    toast.warning('You are offline. Using cached data.');
    
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
  
  try {
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include', // Include cookies for sessions
    };
    
    // Add body for non-GET requests
    if (method !== 'GET' && body) {
      requestOptions.body = JSON.stringify(body);
    }
    
    // Make the API request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    
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
    const data = await response.json();
    
    return {
      success: true,
      data,
      message: 'Request successful',
      statusCode: response.status,
    };
  } catch (error) {
    console.error('API request failed:', error);
    
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
}

// Helper methods for common API operations
export const apiService = {
  get: <T>(endpoint: string, options?: RequestOptions) => fetchApi<T>(endpoint, 'GET', undefined, options),
  post: <T>(endpoint: string, body: any, options?: RequestOptions) => fetchApi<T>(endpoint, 'POST', body, options),
  put: <T>(endpoint: string, body: any, options?: RequestOptions) => fetchApi<T>(endpoint, 'PUT', body, options),
  delete: <T>(endpoint: string, options?: RequestOptions) => fetchApi<T>(endpoint, 'DELETE', undefined, options),
};
