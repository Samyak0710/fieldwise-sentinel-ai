
import { Detection } from './types';

// Mock detections data
export const detections: Detection[] = [
  {
    id: 'd1',
    pestId: 'p1',
    timestamp: '2025-04-03T09:23:12',
    location: {
      fieldId: 'f1',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    confidence: 0.87,
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'd2',
    pestId: 'p2',
    timestamp: '2025-04-03T14:35:48',
    location: {
      fieldId: 'f2',
      coordinates: { lat: 37.7649, lng: -122.4294 }
    },
    confidence: 0.92,
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'd3',
    pestId: 'p3',
    timestamp: '2025-04-04T08:12:21',
    location: {
      fieldId: 'f3',
      coordinates: { lat: 37.7739, lng: -122.4094 }
    },
    confidence: 0.76,
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'd4',
    pestId: 'p1',
    timestamp: '2025-04-04T16:45:33',
    location: {
      fieldId: 'f1',
      coordinates: { lat: 37.7745, lng: -122.4190 }
    },
    confidence: 0.81,
    imageUrl: '/placeholder.svg'
  }
];

// Detection utility functions
export const getDetectionsByFieldId = (fieldId: string): Detection[] => {
  return detections.filter(detection => detection.location.fieldId === fieldId);
};

export const getDetectionsByPestId = (pestId: string): Detection[] => {
  return detections.filter(detection => detection.pestId === pestId);
};
