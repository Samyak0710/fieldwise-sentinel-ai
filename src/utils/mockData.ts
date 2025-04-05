
// Types for our data model
export interface Pest {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  threat: 'low' | 'medium' | 'high';
  affectedCrops: string[];
  recommendedTreatments: string[];
  imageUrl: string;
}

export interface Detection {
  id: string;
  pestId: string;
  timestamp: string;
  location: {
    fieldId: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  confidence: number;
  imageUrl: string;
}

export interface Field {
  id: string;
  name: string;
  cropType: string;
  size: number; // in acres
  coordinates: {
    center: {
      lat: number;
      lng: number;
    };
    bounds: {
      north: number;
      east: number;
      south: number;
      west: number;
    };
  };
}

export interface Treatment {
  id: string;
  fieldId: string;
  pestId: string;
  method: string;
  dateApplied: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  effectivenessRating?: number;
}

// Mock data
export const pests: Pest[] = [
  {
    id: 'p1',
    name: 'Aphid',
    scientificName: 'Aphidoidea',
    description: 'Small sap-sucking insects that cause stunted growth and leaf curl in many plants.',
    threat: 'medium',
    affectedCrops: ['tomatoes', 'peppers', 'cucumbers', 'lettuce'],
    recommendedTreatments: ['Neem oil', 'Insecticidal soap', 'Ladybugs (biological control)'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'p2',
    name: 'Whitefly',
    scientificName: 'Aleyrodidae',
    description: 'Small winged insects that feed on plant sap and excrete honeydew, leading to sooty mold.',
    threat: 'high',
    affectedCrops: ['tomatoes', 'cucumbers', 'eggplants', 'peppers'],
    recommendedTreatments: ['Yellow sticky traps', 'Neem oil', 'Insecticidal soap', 'Encarsia formosa (parasitic wasp)'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'p3',
    name: 'Spider Mite',
    scientificName: 'Tetranychus urticae',
    description: 'Tiny pests that cause stippling on leaves and create fine webbing on plants.',
    threat: 'high',
    affectedCrops: ['beans', 'strawberries', 'cucumbers', 'tomatoes'],
    recommendedTreatments: ['Increasing humidity', 'Neem oil', 'Insecticidal soap', 'Predatory mites'],
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'p4',
    name: 'Thrips',
    scientificName: 'Thysanoptera',
    description: 'Slender insects that feed on plant tissues, causing silvery speckling and distorted growth.',
    threat: 'medium',
    affectedCrops: ['onions', 'beans', 'carrots', 'flowers'],
    recommendedTreatments: ['Blue sticky traps', 'Spinosad', 'Neem oil', 'Predatory mites'],
    imageUrl: '/placeholder.svg'
  }
];

export const fields: Field[] = [
  {
    id: 'f1',
    name: 'North Greenhouse',
    cropType: 'Tomatoes',
    size: 0.5,
    coordinates: {
      center: { lat: 37.7749, lng: -122.4194 },
      bounds: {
        north: 37.7799,
        east: -122.4144,
        south: 37.7699,
        west: -122.4244
      }
    }
  },
  {
    id: 'f2',
    name: 'South Field',
    cropType: 'Mixed Vegetables',
    size: 2.3,
    coordinates: {
      center: { lat: 37.7649, lng: -122.4294 },
      bounds: {
        north: 37.7699,
        east: -122.4244,
        south: 37.7599,
        west: -122.4344
      }
    }
  },
  {
    id: 'f3',
    name: 'East Greenhouse',
    cropType: 'Cucumbers',
    size: 0.75,
    coordinates: {
      center: { lat: 37.7739, lng: -122.4094 },
      bounds: {
        north: 37.7789,
        east: -122.4044,
        south: 37.7689,
        west: -122.4144
      }
    }
  }
];

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

export const treatments: Treatment[] = [
  {
    id: 't1',
    fieldId: 'f1',
    pestId: 'p1',
    method: 'Neem oil spray',
    dateApplied: '2025-04-04',
    status: 'completed',
    notes: 'Applied in the evening as recommended',
    effectivenessRating: 4
  },
  {
    id: 't2',
    fieldId: 'f2',
    pestId: 'p2',
    method: 'Yellow sticky traps',
    dateApplied: '2025-04-04',
    status: 'completed',
    notes: 'Placed 10 traps throughout the field',
    effectivenessRating: 3
  },
  {
    id: 't3',
    fieldId: 'f3',
    pestId: 'p3',
    method: 'Release of predatory mites',
    dateApplied: '2025-04-06',
    status: 'scheduled'
  }
];

// Utility functions
export const getPestById = (id: string): Pest | undefined => {
  return pests.find(pest => pest.id === id);
};

export const getFieldById = (id: string): Field | undefined => {
  return fields.find(field => field.id === id);
};

export const getDetectionsByFieldId = (fieldId: string): Detection[] => {
  return detections.filter(detection => detection.location.fieldId === fieldId);
};

export const getTreatmentsByFieldId = (fieldId: string): Treatment[] => {
  return treatments.filter(treatment => treatment.fieldId === fieldId);
};

export const getDetectionsByPestId = (pestId: string): Detection[] => {
  return detections.filter(detection => detection.pestId === pestId);
};

export const getTreatmentsByPestId = (pestId: string): Treatment[] => {
  return treatments.filter(treatment => treatment.pestId === pestId);
};

// Online status simulation
export const simulateNetworkStatus = (): boolean => {
  // Random offline status with 20% chance
  return Math.random() > 0.2;
};
