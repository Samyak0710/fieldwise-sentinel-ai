
import { apiService, ENDPOINTS } from './api';

// Types for pest detection
export interface PestDetection {
  id: string;
  timestamp: string;
  pestType: 'aphid' | 'whitefly' | 'bollworm' | 'unknown';
  confidence: number;
  location: string;
  imageUrl?: string;
  count: number;
  boundingBoxes?: BoundingBox[];
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  pestType: string;
  confidence: number;
}

export interface DetectionResponse {
  detections: PestDetection[];
  processingTime: number;
  isSimulated: boolean;
}

// Mock data for offline mode
const mockDetections: PestDetection[] = [
  {
    id: 'det-001',
    timestamp: new Date().toISOString(),
    pestType: 'aphid',
    confidence: 0.92,
    location: 'greenhouse-1',
    count: 12,
    boundingBoxes: [
      { x: 100, y: 150, width: 50, height: 30, pestType: 'aphid', confidence: 0.92 },
      { x: 200, y: 180, width: 45, height: 25, pestType: 'aphid', confidence: 0.88 }
    ]
  },
  {
    id: 'det-002',
    timestamp: new Date().toISOString(),
    pestType: 'whitefly',
    confidence: 0.85,
    location: 'field-north',
    count: 8,
    boundingBoxes: [
      { x: 120, y: 160, width: 40, height: 20, pestType: 'whitefly', confidence: 0.85 }
    ]
  }
];

const mockResponse: DetectionResponse = {
  detections: mockDetections,
  processingTime: 1.2,
  isSimulated: true
};

// Service functions
export const pestDetectionService = {
  // Detect pests from an image file
  detectPests: async (imageFile: File, location: string): Promise<DetectionResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('location', location);
    
    // For form data, we need to override the content-type header
    const response = await apiService.post<DetectionResponse>(ENDPOINTS.DETECT, formData, {
      headers: {},  // Let the browser set the correct content-type for FormData
      mockResponse,
      fallbackToMock: true
    });
    
    return response.data as DetectionResponse;
  },
  
  // Get recent pest detections
  getRecentDetections: async (limit: number = 10): Promise<PestDetection[]> => {
    const response = await apiService.get<{ detections: PestDetection[] }>(
      `${ENDPOINTS.DETECT}/recent?limit=${limit}`,
      { mockResponse: { detections: mockDetections }, fallbackToMock: true }
    );
    
    return response.data?.detections || [];
  },
  
  // Get pest detections by location
  getDetectionsByLocation: async (location: string): Promise<PestDetection[]> => {
    const response = await apiService.get<{ detections: PestDetection[] }>(
      `${ENDPOINTS.DETECT}/location/${location}`,
      { mockResponse: { detections: mockDetections.filter(d => d.location === location) }, fallbackToMock: true }
    );
    
    return response.data?.detections || [];
  },
  
  // Save detection results to local storage for offline access
  saveDetectionsToLocalStorage: (detections: PestDetection[]) => {
    try {
      const existing = JSON.parse(localStorage.getItem('pestDetections') || '[]');
      const combined = [...existing, ...detections];
      localStorage.setItem('pestDetections', JSON.stringify(combined));
      return true;
    } catch (error) {
      console.error('Failed to save detections to localStorage:', error);
      return false;
    }
  }
};
