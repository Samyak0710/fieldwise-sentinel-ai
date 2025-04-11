
import { Field } from './types';

// Mock fields data
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

// Field utility function
export const getFieldById = (id: string): Field | undefined => {
  return fields.find(field => field.id === id);
};
