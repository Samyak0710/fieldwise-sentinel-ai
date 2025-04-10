import { apiService, ENDPOINTS } from './api';
import { PestDetection } from './pestDetectionService';
import { EnvironmentalData } from './environmentalService';
import { supabase } from "@/integrations/supabase/client";

// Types for decision engine
export interface SprayRecommendation {
  id: string;
  timestamp: string;
  location: string;
  decision: 'spray' | 'dont-spray';
  pestType?: string;
  reasons: string[];
  confidence: number;
  environmentalFactors: {
    temperature?: number;
    humidity?: number;
    rainfall?: number;
    windSpeed?: number;
  };
  recommendedProducts?: RecommendedProduct[];
  nextRecommendedCheck: string;
  isSimulated: boolean;
  threatLevel: 'low' | 'medium' | 'high';
}

export interface RecommendedProduct {
  id: string;
  name: string;
  activeIngredient: string;
  dosage: string;
  waitingPeriod: number;
  efficacyRating: number;
}

export interface SprayHistory {
  id: string;
  date: Date;
  location: string;
  product: string;
  rate: string;
  applicator: string;
  target: string;
  notes?: string;
}

// Service functions
export const decisionService = {
  // Get recommendation for a specific location
  getRecommendation: async (
    location: string,
    includeEnvironmental: boolean = true,
    includePestData: boolean = true
  ): Promise<SprayRecommendation> => {
    // Mock recommended products
    const mockProducts = [
      {
        id: 'prod-001',
        name: 'Neem Oil Spray',
        activeIngredient: 'Azadirachtin',
        dosage: '15ml/L',
        waitingPeriod: 1,
        efficacyRating: 0.85
      },
      {
        id: 'prod-002',
        name: 'Insecticidal Soap',
        activeIngredient: 'Potassium salts of fatty acids',
        dosage: '20ml/L',
        waitingPeriod: 0,
        efficacyRating: 0.75
      }
    ];
    
    // Build query params
    const params = new URLSearchParams({
      location,
      includeEnvironmental: includeEnvironmental.toString(),
      includePestData: includePestData.toString()
    });
    
    // Generate threat level
    const threatLevel = Math.random() > 0.7 ? 'high' : (Math.random() > 0.5 ? 'medium' : 'low');
    
    // Mock response
    const mockRecommendation: SprayRecommendation = {
      id: `rec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      location,
      // IMPORTANT: Spray even with low count if high threat level
      decision: threatLevel === 'high' ? 'spray' : (Math.random() > 0.5 ? 'spray' : 'dont-spray'),
      reasons: threatLevel === 'high' 
        ? ['High-risk pest detected - immediate action recommended regardless of count'] 
        : [
            'Current pest population is above economic threshold',
            'Environmental conditions are favorable for treatment',
            'No rain expected in the next 24 hours'
          ],
      confidence: 0.85,
      environmentalFactors: {
        temperature: 22 + Math.random() * 8,
        humidity: 50 + Math.random() * 30,
        rainfall: 0,
        windSpeed: 2 + Math.random() * 5
      },
      recommendedProducts: mockProducts,
      nextRecommendedCheck: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      isSimulated: true,
      threatLevel
    };
    
    const response = await apiService.get<SprayRecommendation>(
      `${ENDPOINTS.RECOMMENDATIONS}?${params.toString()}`,
      {
        fallbackToMock: true,
        mockResponse: mockRecommendation
      }
    );
    
    return response.data as SprayRecommendation;
  },
  
  // Get recommendation based on provided environmental and pest data
  getRecommendationWithData: async (
    location: string,
    environmentalData: EnvironmentalData,
    pestDetections: PestDetection[]
  ): Promise<SprayRecommendation> => {
    // Enhanced decision logic to consider risk level
    const pestTypes = pestDetections.map(p => p.pestType);
    
    // High-risk pests that require immediate action regardless of count
    const highRiskPests = ['bollworm', 'whitefly', 'caterpillar'];
    
    // Check for high threat level pests (regardless of count)
    const highThreatPestPresent = pestTypes.some(type => highRiskPests.includes(type));
    
    // Determine threat level based on detected pests
    let threatLevel: 'low' | 'medium' | 'high' = 'low';
    if (highThreatPestPresent) {
      threatLevel = 'high';
    } else if (pestDetections.length > 10) {
      threatLevel = 'medium';
    }
    
    const response = await apiService.post<SprayRecommendation>(
      ENDPOINTS.RECOMMENDATIONS,
      {
        location,
        environmentalData,
        pestDetections
      },
      {
        fallbackToMock: true,
        mockResponse: {
          id: `rec-${Date.now()}`,
          timestamp: new Date().toISOString(),
          location,
          // Enhanced logic: spray if high risk pests detected regardless of count
          decision: highThreatPestPresent || pestDetections.length > 15 ? 'spray' : 'dont-spray',
          pestType: pestDetections.length > 0 ? pestDetections[0].pestType : undefined,
          reasons: [
            highThreatPestPresent 
              ? 'High threat pest detected - immediate action recommended regardless of count' 
              : (pestDetections.length > 15 
                ? 'Pest population exceeds treatment threshold' 
                : 'Pest population below treatment threshold'),
            environmentalData.humidity && environmentalData.humidity.value > 70 
              ? 'High humidity increases risk of fungal disease' 
              : 'Environmental conditions are favorable'
          ],
          confidence: 0.85,
          environmentalFactors: {
            temperature: environmentalData.temperature?.value,
            humidity: environmentalData.humidity?.value,
          },
          recommendedProducts: [
            {
              id: 'prod-001',
              name: 'Neem Oil Spray',
              activeIngredient: 'Azadirachtin',
              dosage: '15ml/L',
              waitingPeriod: 1,
              efficacyRating: 0.85
            }
          ],
          nextRecommendedCheck: new Date(Date.now() + 86400000).toISOString(),
          isSimulated: true,
          threatLevel
        }
      }
    );
    
    return response.data as SprayRecommendation;
  },
  
  // Record a spray application in Supabase and localStorage
  recordSprayApplication: async (sprayData: Omit<SprayHistory, 'id'>) => {
    // Try to save to Supabase first
    try {
      const { data: supabaseData, error } = await supabase
        .from('spray_history')
        .insert({
          field_id: sprayData.location,
          pest_id: sprayData.target,
          spray_date: sprayData.date.toISOString(),
          method: sprayData.product,
          notes: sprayData.notes,
          efficacy_rating: 0 // Will be updated later
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (supabaseData) {
        // Convert Supabase data to SprayHistory format
        const newSpray: SprayHistory = {
          id: supabaseData.id,
          date: new Date(supabaseData.spray_date),
          location: supabaseData.field_id,
          product: supabaseData.method,
          rate: sprayData.rate,
          applicator: sprayData.applicator,
          target: supabaseData.pest_id,
          notes: supabaseData.notes
        };
        
        return newSpray;
      }
    } catch (error) {
      console.error('Failed to save spray history to Supabase:', error);
    }
    
    // Fallback to localStorage if Supabase fails
    const response = await apiService.post<{ history: SprayHistory }>(
      `${ENDPOINTS.RECOMMENDATIONS}/history`,
      sprayData,
      {
        fallbackToMock: true,
        mockResponse: {
          history: {
            id: `spray-${Date.now()}`,
            ...sprayData
          }
        }
      }
    );
    
    // Also save to localStorage for offline access
    try {
      const existingHistory = JSON.parse(localStorage.getItem('sprayHistory') || '[]');
      const newSpray = response.data?.history || {
        id: `spray-${Date.now()}`,
        ...sprayData
      };
      
      localStorage.setItem('sprayHistory', JSON.stringify([...existingHistory, newSpray]));
    } catch (error) {
      console.error('Failed to save spray history to localStorage:', error);
    }
    
    return response.data?.history as SprayHistory;
  },
  
  // Get spray history from Supabase and localStorage
  getSprayHistory: async (location?: string) => {
    let history: SprayHistory[] = [];
    
    // Try to get from Supabase first
    try {
      let query = supabase
        .from('spray_history')
        .select('*')
        .order('spray_date', { ascending: false });
      
      // Filter by location if provided
      if (location) {
        query = query.eq('field_id', location);
      }
      
      const { data, error } = await query;
      
      if (!error && data) {
        // Convert Supabase data to SprayHistory format
        history = data.map(item => ({
          id: item.id,
          date: new Date(item.spray_date),
          location: item.field_id,
          product: item.method,
          rate: '15ml/L', // Default value
          applicator: 'System', // Default value
          target: item.pest_id,
          notes: item.notes
        }));
      }
    } catch (error) {
      console.error('Failed to get spray history from Supabase:', error);
    }
    
    // If no data from Supabase or there was an error, try localStorage
    if (history.length === 0) {
      const params = location ? `?location=${location}` : '';
      
      const response = await apiService.get<{ history: SprayHistory[] }>(
        `${ENDPOINTS.RECOMMENDATIONS}/history${params}`,
        {
          fallbackToMock: true,
          mockResponse: {
            history: [
              {
                id: 'spray-001',
                date: new Date(Date.now() - 86400000 * 7), // 7 days ago
                location: 'greenhouse-1',
                product: 'Neem Oil Spray',
                rate: '15ml/L',
                applicator: 'John Smith',
                target: 'Aphids',
                notes: 'Applied during evening to reduce bee exposure'
              },
              {
                id: 'spray-002',
                date: new Date(Date.now() - 86400000 * 14), // 14 days ago
                location: 'field-north',
                product: 'Insecticidal Soap',
                rate: '20ml/L',
                applicator: 'Sarah Johnson',
                target: 'Whiteflies',
                notes: 'Good coverage on undersides of leaves'
              }
            ].filter(item => !location || item.location === location)
          }
        }
      );
      
      // Convert date strings to Date objects
      history = response.data?.history.map(item => ({
        ...item,
        date: new Date(item.date)
      })) || [];
    }
    
    return history;
  }
};
