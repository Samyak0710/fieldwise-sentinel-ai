
import { apiService, ENDPOINTS } from './api';

// Types for environmental data
export interface EnvironmentalReading {
  id: string;
  timestamp: string;
  sensorType: 'temperature' | 'humidity' | 'co2' | 'soil';
  value: number;
  unit: string;
  location: string;
  isSimulated: boolean;
}

export interface EnvironmentalData {
  temperature?: EnvironmentalReading;
  humidity?: EnvironmentalReading;
  co2?: EnvironmentalReading;
  soil?: EnvironmentalReading;
  timestamp: string;
  location: string;
  isSimulated: boolean;
}

// Mock data for offline mode
const generateMockReading = (
  sensorType: 'temperature' | 'humidity' | 'co2' | 'soil',
  location: string
): EnvironmentalReading => {
  let value: number;
  let unit: string;
  
  switch (sensorType) {
    case 'temperature':
      value = 22 + Math.random() * 8; // 22-30°C
      unit = '°C';
      break;
    case 'humidity':
      value = 50 + Math.random() * 30; // 50-80%
      unit = '%';
      break;
    case 'co2':
      value = 400 + Math.random() * 300; // 400-700ppm
      unit = 'ppm';
      break;
    case 'soil':
      value = 30 + Math.random() * 40; // 30-70%
      unit = '%';
      break;
  }
  
  return {
    id: `${sensorType}-${Date.now()}`,
    timestamp: new Date().toISOString(),
    sensorType,
    value,
    unit,
    location,
    isSimulated: true
  };
};

// Service functions
export const environmentalService = {
  // Get the latest readings for all sensors in a location
  getLatestReadings: async (location: string): Promise<EnvironmentalData> => {
    try {
      // Try to fetch from the API
      const response = await apiService.get<EnvironmentalData>(
        `/api/v1/sensors/readings/latest?location=${location}`,
        {
          fallbackToMock: true,
          mockResponse: {
            temperature: generateMockReading('temperature', location),
            humidity: generateMockReading('humidity', location),
            co2: generateMockReading('co2', location),
            soil: generateMockReading('soil', location),
            timestamp: new Date().toISOString(),
            location,
            isSimulated: true
          }
        }
      );
      
      return response.data as EnvironmentalData;
    } catch (error) {
      console.error('Failed to get environmental readings:', error);
      
      // Return mock data as fallback
      return {
        temperature: generateMockReading('temperature', location),
        humidity: generateMockReading('humidity', location),
        co2: generateMockReading('co2', location),
        soil: generateMockReading('soil', location),
        timestamp: new Date().toISOString(),
        location,
        isSimulated: true
      };
    }
  },
  
  // Get a specific sensor reading
  getSensorReading: async (
    sensorType: 'temperature' | 'humidity' | 'co2' | 'soil',
    location: string
  ): Promise<EnvironmentalReading> => {
    const endpoint = ENDPOINTS[sensorType.toUpperCase()];
    
    if (!endpoint) {
      throw new Error(`Invalid sensor type: ${sensorType}`);
    }
    
    const response = await apiService.get<{ reading: EnvironmentalReading }>(
      `${endpoint}?location=${location}`,
      {
        fallbackToMock: true,
        mockResponse: { reading: generateMockReading(sensorType, location) }
      }
    );
    
    return response.data?.reading as EnvironmentalReading;
  },
  
  // Get historical readings for a sensor
  getHistoricalReadings: async (
    sensorType: 'temperature' | 'humidity' | 'co2' | 'soil',
    location: string,
    startDate: Date,
    endDate: Date
  ): Promise<EnvironmentalReading[]> => {
    const endpoint = ENDPOINTS[sensorType.toUpperCase()];
    
    if (!endpoint) {
      throw new Error(`Invalid sensor type: ${sensorType}`);
    }
    
    const response = await apiService.get<{ readings: EnvironmentalReading[] }>(
      `${endpoint}/history?location=${location}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
      {
        fallbackToMock: true,
        mockResponse: {
          readings: Array(24).fill(0).map((_, i) => {
            const date = new Date(startDate);
            date.setHours(date.getHours() + i);
            
            return {
              ...generateMockReading(sensorType, location),
              timestamp: date.toISOString()
            };
          })
        }
      }
    );
    
    return response.data?.readings || [];
  },
  
  // Save environmental data to local storage for offline access
  saveReadingsToLocalStorage: (readings: EnvironmentalData) => {
    try {
      const key = 'environmentalReadings';
      const existingData = JSON.parse(localStorage.getItem(key) || '{}');
      
      // Create a structure to store by location and then by date
      const updatedData = {
        ...existingData,
        [readings.location]: {
          ...(existingData[readings.location] || {}),
          [new Date().toDateString()]: readings
        }
      };
      
      localStorage.setItem(key, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Failed to save environmental readings to localStorage:', error);
      return false;
    }
  }
};
