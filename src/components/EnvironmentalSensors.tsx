
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Thermometer, Droplets, Wind, CloudRain, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const EnvironmentalSensors: React.FC = () => {
  // Sensor data state
  const [temperature, setTemperature] = useState(24);
  const [humidity, setHumidity] = useState(65);
  const [moisture, setMoisture] = useState(42);
  const [weatherCondition, setWeatherCondition] = useState('Partly Cloudy');
  const [showAlert, setShowAlert] = useState(false);
  const { toast } = useToast();
  
  // Simulate sensor reading updates
  useEffect(() => {
    const updateSensorReadings = () => {
      // Simulate temperature fluctuation (22-28°C)
      const newTemp = Math.floor(22 + Math.random() * 6);
      setTemperature(newTemp);
      
      // Simulate humidity fluctuation (55-75%)
      const newHumidity = Math.floor(55 + Math.random() * 20);
      setHumidity(newHumidity);
      
      // Simulate soil moisture fluctuation (35-55%)
      const newMoisture = Math.floor(35 + Math.random() * 20);
      setMoisture(newMoisture);
      
      // Simulate weather conditions
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
      const newWeather = conditions[Math.floor(Math.random() * conditions.length)];
      setWeatherCondition(newWeather);
      
      // Generate spray recommendations/alerts based on conditions
      const shouldSpray = analyzeConditionsForSpraying(newTemp, newHumidity, newMoisture, newWeather);
      setShowAlert(shouldSpray);
      
      if (shouldSpray) {
        toast({
          title: "Optimal Spraying Conditions",
          description: "Current environmental conditions are favorable for treatment application.",
          variant: "default",
        });
      }
    };
    
    // Initial update
    updateSensorReadings();
    
    // Update every 30 seconds
    const interval = setInterval(updateSensorReadings, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Analyze conditions to determine if spraying is recommended
  const analyzeConditionsForSpraying = (temp: number, humid: number, moist: number, weather: string) => {
    // Ideal conditions: 
    // - Temperature between 24-26°C
    // - Humidity between 60-70%
    // - Not raining or too windy
    // - Adequate soil moisture
    
    if (temp < 18 || temp > 29) return false; // Too cold or too hot
    if (humid < 40 || humid > 85) return false; // Too dry or too humid
    if (weather.includes('Rain')) return false; // Raining
    if (moist > 80) return false; // Soil too wet
    
    // Specific optimal conditions
    const optimal = (temp >= 23 && temp <= 27) && 
                   (humid >= 55 && humid <= 75) && 
                   (moist >= 40 && moist <= 60) &&
                   (weather === 'Sunny' || weather === 'Partly Cloudy' || weather === 'Clear');
    
    return optimal;
  };
  
  // Generate human-readable recommendation
  const getRecommendation = () => {
    if (showAlert) {
      return "Conditions are optimal for treatment application. Consider spraying now.";
    } else {
      if (temperature < 18) return "Too cold for effective spraying.";
      if (temperature > 29) return "Too hot for spraying, may cause plant stress.";
      if (humidity < 40) return "Humidity too low, spray may evaporate quickly.";
      if (humidity > 85) return "Humidity too high, risk of fungal issues.";
      if (weatherCondition.includes('Rain')) return "Rainfall expected, delay spraying.";
      if (moisture > 80) return "Soil moisture high, delay spraying to avoid runoff.";
      return "Conditions are not optimal for spraying at this time.";
    }
  };
  
  return (
    <div id="environmental-sensors" className="space-y-4">
      <Card className="fieldwise-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            Environmental Sensors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Temperature */}
            <div className="bg-fieldwise-green/10 rounded-lg p-3 flex flex-col items-center">
              <Thermometer className="h-8 w-8 text-fieldwise-green mb-2" />
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-xl font-bold">{temperature}°C</p>
            </div>
            
            {/* Humidity */}
            <div className="bg-fieldwise-sky/10 rounded-lg p-3 flex flex-col items-center">
              <Droplets className="h-8 w-8 text-fieldwise-sky mb-2" />
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="text-xl font-bold">{humidity}%</p>
            </div>
            
            {/* Soil Moisture */}
            <div className="bg-fieldwise-earth/10 rounded-lg p-3 flex flex-col items-center">
              <Droplets className="h-8 w-8 text-fieldwise-earth mb-2" />
              <p className="text-sm text-muted-foreground">Soil Moisture</p>
              <p className="text-xl font-bold">{moisture}%</p>
            </div>
            
            {/* Weather */}
            <div className="bg-primary/10 rounded-lg p-3 flex flex-col items-center">
              <CloudRain className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Weather</p>
              <p className="text-xl font-bold">{weatherCondition}</p>
            </div>
          </div>
          
          {/* Spraying Recommendation */}
          <div className="mt-4">
            {showAlert ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertTriangle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Optimal Conditions</AlertTitle>
                <AlertDescription className="text-green-700">
                  {getRecommendation()}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive" className="bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Not Recommended</AlertTitle>
                <AlertDescription className="text-amber-700">
                  {getRecommendation()}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalSensors;
