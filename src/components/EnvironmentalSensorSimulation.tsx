import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertTriangle, Thermometer, Droplets, Wind } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface SensorReadings {
  temperature: number;
  humidity: number;
  co2: number;
  soilMoisture: number;
  lightIntensity: number;
}

const cropStages = [
  { value: 'seedling', label: 'Seedling' },
  { value: 'vegetative', label: 'Vegetative Growth' },
  { value: 'flowering', label: 'Flowering' },
  { value: 'fruiting', label: 'Fruiting' }
];

const EnvironmentalSensorSimulation: React.FC = () => {
  const [cropStage, setCropStage] = useState('vegetative');
  const [manualMode, setManualMode] = useState(false);
  const [sensorReadings, setSensorReadings] = useState<SensorReadings>({
    temperature: 25,
    humidity: 65,
    co2: 450,
    soilMoisture: 60,
    lightIntensity: 75
  });
  const [userReadings, setUserReadings] = useState<SensorReadings>({
    temperature: 25,
    humidity: 65,
    co2: 450,
    soilMoisture: 60,
    lightIntensity: 75
  });
  const [warnings, setWarnings] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Generate realistic fluctuations in readings
  useEffect(() => {
    if (manualMode) return;
    
    const interval = setInterval(() => {
      setSensorReadings(prev => {
        // Small random fluctuations
        const temperature = prev.temperature + (Math.random() * 2 - 1);
        const humidity = prev.humidity + (Math.random() * 4 - 2);
        const co2 = prev.co2 + (Math.random() * 20 - 10);
        const soilMoisture = prev.soilMoisture + (Math.random() * 2 - 1);
        const lightIntensity = prev.lightIntensity + (Math.random() * 3 - 1.5);
        
        // Keep values within realistic ranges
        return {
          temperature: Math.max(15, Math.min(40, temperature)),
          humidity: Math.max(30, Math.min(90, humidity)),
          co2: Math.max(300, Math.min(1000, co2)),
          soilMoisture: Math.max(20, Math.min(90, soilMoisture)),
          lightIntensity: Math.max(0, Math.min(100, lightIntensity))
        };
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [manualMode]);
  
  // Check for warning conditions
  useEffect(() => {
    const activeReadings = manualMode ? userReadings : sensorReadings;
    const newWarnings: string[] = [];
    
    // Temperature warnings
    if (activeReadings.temperature > 35) {
      newWarnings.push('High temperature may stress plants and increase pest activity.');
    } else if (activeReadings.temperature < 18) {
      newWarnings.push('Low temperature may slow plant growth and pest development.');
    }
    
    // Humidity warnings
    if (activeReadings.humidity > 80) {
      newWarnings.push('High humidity increases risk of fungal diseases.');
    } else if (activeReadings.humidity < 40) {
      newWarnings.push('Low humidity may stress plants and favor certain pests.');
    }
    
    // CO2 warnings
    if (activeReadings.co2 > 800) {
      newWarnings.push('CO₂ levels are above optimal range for most crops.');
    }
    
    // Soil moisture warnings
    if (activeReadings.soilMoisture > 80) {
      newWarnings.push('Soil is overly saturated, which may lead to root diseases.');
    } else if (activeReadings.soilMoisture < 30) {
      newWarnings.push('Soil is too dry, plants may be under water stress.');
    }
    
    setWarnings(newWarnings);
    
    // Save to localStorage
    localStorage.setItem('environmentalReadings', JSON.stringify({
      readings: activeReadings,
      cropStage,
      timestamp: new Date().toISOString()
    }));
    
  }, [sensorReadings, userReadings, cropStage, manualMode]);
  
  const handleSliderChange = (name: keyof SensorReadings, value: number[]) => {
    setUserReadings(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };
  
  const getOptimalRanges = () => {
    switch (cropStage) {
      case 'seedling':
        return {
          temperature: [20, 25],
          humidity: [60, 80],
          co2: [400, 600],
          soilMoisture: [60, 75],
          lightIntensity: [60, 80]
        };
      case 'vegetative':
        return {
          temperature: [22, 28],
          humidity: [50, 70],
          co2: [450, 750],
          soilMoisture: [50, 70],
          lightIntensity: [70, 90]
        };
      case 'flowering':
        return {
          temperature: [20, 26],
          humidity: [40, 60],
          co2: [500, 800],
          soilMoisture: [40, 60],
          lightIntensity: [80, 100]
        };
      case 'fruiting':
        return {
          temperature: [18, 24],
          humidity: [50, 65],
          co2: [400, 650],
          soilMoisture: [45, 65],
          lightIntensity: [75, 95]
        };
      default:
        return {
          temperature: [20, 25],
          humidity: [60, 70],
          co2: [400, 600],
          soilMoisture: [50, 70],
          lightIntensity: [70, 90]
        };
    }
  };
  
  const isWithinOptimalRange = (value: number, range: number[]) => {
    return value >= range[0] && value <= range[1];
  };
  
  const getStatusColor = (value: number, range: number[]) => {
    return isWithinOptimalRange(value, range) ? 'text-green-500' : 'text-yellow-500';
  };
  
  const optimalRanges = getOptimalRanges();
  const activeReadings = manualMode ? userReadings : sensorReadings;
  
  return (
    <div id="environmental-sensors" className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Environmental Sensor Simulation
          </CardTitle>
          <CardDescription>
            Monitor and simulate environmental conditions for optimal pest management
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Crop Growth Stage</label>
                <Select 
                  value={cropStage} 
                  onValueChange={setCropStage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropStages.map(stage => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Different growth stages have different optimal conditions
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Temperature ({activeReadings.temperature.toFixed(1)}°C)</span>
                  <span className={getStatusColor(activeReadings.temperature, optimalRanges.temperature)}>
                    Optimal: {optimalRanges.temperature[0]}-{optimalRanges.temperature[1]}°C
                  </span>
                </label>
                <Slider
                  disabled={!manualMode}
                  value={[activeReadings.temperature]}
                  min={15}
                  max={40}
                  step={0.1}
                  onValueChange={(value) => handleSliderChange('temperature', value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>15°C</span>
                  <span>40°C</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Humidity ({activeReadings.humidity.toFixed(1)}%)</span>
                  <span className={getStatusColor(activeReadings.humidity, optimalRanges.humidity)}>
                    Optimal: {optimalRanges.humidity[0]}-{optimalRanges.humidity[1]}%
                  </span>
                </label>
                <Slider
                  disabled={!manualMode}
                  value={[activeReadings.humidity]}
                  min={30}
                  max={90}
                  step={0.1}
                  onValueChange={(value) => handleSliderChange('humidity', value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>30%</span>
                  <span>90%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>CO₂ ({activeReadings.co2.toFixed(0)} ppm)</span>
                  <span className={getStatusColor(activeReadings.co2, optimalRanges.co2)}>
                    Optimal: {optimalRanges.co2[0]}-{optimalRanges.co2[1]} ppm
                  </span>
                </label>
                <Slider
                  disabled={!manualMode}
                  value={[activeReadings.co2]}
                  min={300}
                  max={1000}
                  step={1}
                  onValueChange={(value) => handleSliderChange('co2', value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>300 ppm</span>
                  <span>1000 ppm</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Soil Moisture ({activeReadings.soilMoisture.toFixed(1)}%)</span>
                  <span className={getStatusColor(activeReadings.soilMoisture, optimalRanges.soilMoisture)}>
                    Optimal: {optimalRanges.soilMoisture[0]}-{optimalRanges.soilMoisture[1]}%
                  </span>
                </label>
                <Slider
                  disabled={!manualMode}
                  value={[activeReadings.soilMoisture]}
                  min={20}
                  max={90}
                  step={0.1}
                  onValueChange={(value) => handleSliderChange('soilMoisture', value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>20%</span>
                  <span>90%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center justify-between">
                  <span>Light Intensity ({activeReadings.lightIntensity.toFixed(1)}%)</span>
                  <span className={getStatusColor(activeReadings.lightIntensity, optimalRanges.lightIntensity)}>
                    Optimal: {optimalRanges.lightIntensity[0]}-{optimalRanges.lightIntensity[1]}%
                  </span>
                </label>
                <Slider
                  disabled={!manualMode}
                  value={[activeReadings.lightIntensity]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={(value) => handleSliderChange('lightIntensity', value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="manual-mode"
                  checked={manualMode}
                  onChange={(e) => setManualMode(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="manual-mode" className="text-sm font-medium">
                  Manual Simulation Mode
                </label>
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/5">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Thermometer className="h-8 w-8 text-red-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Temperature</span>
                    <span className="text-2xl font-bold">{activeReadings.temperature.toFixed(1)}°C</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Droplets className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Humidity</span>
                    <span className="text-2xl font-bold">{activeReadings.humidity.toFixed(1)}%</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Wind className="h-8 w-8 text-gray-500 mb-2" />
                    <span className="text-xs text-muted-foreground">CO₂</span>
                    <span className="text-2xl font-bold">{activeReadings.co2.toFixed(0)} ppm</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Droplets className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Soil Moisture</span>
                    <span className="text-2xl font-bold">{activeReadings.soilMoisture.toFixed(1)}%</span>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                <div className="text-center space-y-2">
                  <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Environmental data chart
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (Simulated for prototype)
                  </p>
                </div>
              </div>
              
              {warnings.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Environmental Warnings</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {warnings.map((warning, index) => (
                        <li key={index} className="text-sm">{warning}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
              
              {warnings.length === 0 && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertTitle>Optimal Conditions</AlertTitle>
                  <AlertDescription>
                    All environmental parameters are within optimal ranges for the current crop stage.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalSensorSimulation;
