
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Sprout } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WebSocketEvent } from '@/services/webSocketService';
import { environmentalService, EnvironmentalData, EnvironmentalReading } from '@/services/environmentalService';

interface SensorReading {
  value: number;
  unit: string;
  timestamp: string;
  location: string;
  sensorId: string;
}

interface SensorData {
  temperature?: SensorReading;
  humidity?: SensorReading;
  co2?: SensorReading;
  soil?: SensorReading;
}

const RealtimeEnvironmentalData: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { subscribe, isConnected, isSimulated } = useWebSocket();
  
  // Load initial data and set up WebSocket subscription
  useEffect(() => {
    // Load initial data from API
    const loadInitialData = async () => {
      try {
        const data = await environmentalService.getLatestReadings('greenhouse-1');
        
        if (data) {
          setSensorData({
            temperature: data.temperature ? {
              value: data.temperature.value,
              unit: data.temperature.unit,
              timestamp: data.temperature.timestamp,
              location: data.temperature.location,
              sensorId: data.temperature.id
            } : undefined,
            humidity: data.humidity ? {
              value: data.humidity.value,
              unit: data.humidity.unit,
              timestamp: data.humidity.timestamp,
              location: data.humidity.location,
              sensorId: data.humidity.id
            } : undefined,
            co2: data.co2 ? {
              value: data.co2.value,
              unit: data.co2.unit,
              timestamp: data.co2.timestamp,
              location: data.co2.location,
              sensorId: data.co2.id
            } : undefined,
            soil: data.soil ? {
              value: data.soil.value,
              unit: data.soil.unit,
              timestamp: data.soil.timestamp,
              location: data.soil.location,
              sensorId: data.soil.id
            } : undefined
          });
          setLastUpdated(new Date());
          
          // Save to localStorage for offline access - using the original data structure
          environmentalService.saveReadingsToLocalStorage(data);
        }
      } catch (error) {
        console.error('Failed to load environmental data:', error);
        
        // Try to load from localStorage
        const savedData = localStorage.getItem('environmentalReadings');
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            // Use the most recent data for the selected location
            const locationData = data['greenhouse-1'] || {};
            const latestDate = Object.keys(locationData).sort().pop();
            if (latestDate && locationData[latestDate]) {
              setSensorData(locationData[latestDate]);
              setLastUpdated(new Date(latestDate));
            }
          } catch (e) {
            console.error('Failed to parse saved environmental data:', e);
          }
        }
      }
    };
    
    loadInitialData();
    
    // Subscribe to real-time sensor data from WebSocket
    const unsubscribe = subscribe(WebSocketEvent.SENSOR_DATA, (data: SensorData) => {
      setSensorData(data);
      setLastUpdated(new Date());
      
      // Convert SensorData to EnvironmentalData for saving to localStorage
      const environmentalData: EnvironmentalData = {
        timestamp: new Date().toISOString(),
        location: 'greenhouse-1',
        isSimulated: isSimulated
      };
      
      // Convert temperature to EnvironmentalReading if it exists
      if (data.temperature) {
        environmentalData.temperature = {
          id: data.temperature.sensorId,
          timestamp: data.temperature.timestamp,
          sensorType: 'temperature',
          value: data.temperature.value,
          unit: data.temperature.unit,
          location: data.temperature.location,
          isSimulated: isSimulated
        };
      }
      
      // Convert humidity to EnvironmentalReading if it exists
      if (data.humidity) {
        environmentalData.humidity = {
          id: data.humidity.sensorId,
          timestamp: data.humidity.timestamp,
          sensorType: 'humidity',
          value: data.humidity.value,
          unit: data.humidity.unit,
          location: data.humidity.location,
          isSimulated: isSimulated
        };
      }
      
      // Convert co2 to EnvironmentalReading if it exists
      if (data.co2) {
        environmentalData.co2 = {
          id: data.co2.sensorId,
          timestamp: data.co2.timestamp,
          sensorType: 'co2',
          value: data.co2.value,
          unit: data.co2.unit,
          location: data.co2.location,
          isSimulated: isSimulated
        };
      }
      
      // Convert soil to EnvironmentalReading if it exists
      if (data.soil) {
        environmentalData.soil = {
          id: data.soil.sensorId,
          timestamp: data.soil.timestamp,
          sensorType: 'soil',
          value: data.soil.value,
          unit: data.soil.unit,
          location: data.soil.location,
          isSimulated: isSimulated
        };
      }
      
      // Save the converted data to localStorage
      environmentalService.saveReadingsToLocalStorage(environmentalData);
    });
    
    return () => {
      unsubscribe();
    };
  }, [subscribe, isSimulated]);
  
  // Format timestamp as relative time
  const formatTimeAgo = (timestamp: Date | string | null): string => {
    if (!timestamp) return 'Never';
    
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  return (
    <div id="environmental-data">
      <Card>
        <CardHeader className="bg-primary/5">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Environmental Sensors</CardTitle>
              <CardDescription>
                Real-time environmental conditions
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              {isSimulated && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">Simulated</span>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <SensorCard 
              title="Temperature"
              icon={<Thermometer className="h-5 w-5 text-red-500" />}
              value={sensorData.temperature?.value}
              unit={sensorData.temperature?.unit || '°C'}
              timestamp={sensorData.temperature?.timestamp}
            />
            
            <SensorCard 
              title="Humidity"
              icon={<Droplets className="h-5 w-5 text-blue-500" />}
              value={sensorData.humidity?.value}
              unit={sensorData.humidity?.unit || '%'}
              timestamp={sensorData.humidity?.timestamp}
            />
            
            <SensorCard 
              title="CO₂ Level"
              icon={<Wind className="h-5 w-5 text-gray-500" />}
              value={sensorData.co2?.value}
              unit={sensorData.co2?.unit || 'ppm'}
              timestamp={sensorData.co2?.timestamp}
            />
            
            <SensorCard 
              title="Soil Moisture"
              icon={<Sprout className="h-5 w-5 text-green-500" />}
              value={sensorData.soil?.value}
              unit={sensorData.soil?.unit || '%'}
              timestamp={sensorData.soil?.timestamp}
            />
          </div>
          
          <div className="text-xs text-muted-foreground mt-4 text-center">
            Last updated: {formatTimeAgo(lastUpdated)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface SensorCardProps {
  title: string;
  icon: React.ReactNode;
  value?: number;
  unit: string;
  timestamp?: string;
}

const SensorCard: React.FC<SensorCardProps> = ({ title, icon, value, unit, timestamp }) => {
  return (
    <Card className="bg-primary/5">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              {icon}
              <span className="text-sm font-medium">{title}</span>
            </div>
            <div className="text-2xl font-bold">
              {value !== undefined ? 
                `${value.toFixed(1)}${unit}` : 
                'N/A'
              }
            </div>
          </div>
          
          {/* Add a visual indicator or gauge here if needed */}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeEnvironmentalData;
