
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
  isBeneficial: boolean;
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

export interface Farmer {
  id: string;
  // Personal Information
  name: string;
  age: number;
  education: string;
  
  // Land Details
  acre: number;
  soilType: string;
  phValue: number;
  
  // Location Details
  taluk: string;
  district: string;
  hobli: string;
  village: string;
  pincode: string;
  
  // Coordinates
  latitude: number;
  longitude: number;
}
