import { Farmer } from './types';

// Mock farmers data
export const farmers: Farmer[] = [
  {
    id: 'farmer1',
    // Personal Information
    name: 'Rajesh Kumar',
    age: 45,
    education: 'Bachelor of Agriculture',
    
    // Land Details
    acre: 5.5,
    soilType: 'Loamy',
    phValue: 6.8,
    
    // Location Details
    taluk: 'Doddaballapur',
    district: 'Bangalore Rural',
    hobli: 'Doddaballapur',
    village: 'Nandi Cross',
    pincode: '561203',
    
    // Coordinates
    latitude: 13.2257,
    longitude: 77.5348
  },
  {
    id: 'farmer2',
    // Personal Information
    name: 'Sunita Devi',
    age: 38,
    education: 'Diploma in Horticulture',
    
    // Land Details
    acre: 3.2,
    soilType: 'Clay',
    phValue: 7.1,
    
    // Location Details
    taluk: 'Hoskote',
    district: 'Bangalore Rural',
    hobli: 'Hoskote',
    village: 'Jadigenahalli',
    pincode: '562114',
    
    // Coordinates
    latitude: 13.0633,
    longitude: 77.7972
  },
  {
    id: 'farmer3',
    // Personal Information
    name: 'Murugan Shankar',
    age: 52,
    education: '10th Standard',
    
    // Land Details
    acre: 8.0,
    soilType: 'Sandy Loam',
    phValue: 6.5,
    
    // Location Details
    taluk: 'Devanahalli',
    district: 'Bangalore Rural',
    hobli: 'Devanahalli',
    village: 'Budigere Cross',
    pincode: '562110',
    
    // Coordinates
    latitude: 13.2429,
    longitude: 77.7085
  }
];

// Farmer utility function
export const getFarmerById = (id: string): Farmer | undefined => {
  return farmers.find(farmer => farmer.id === id);
};