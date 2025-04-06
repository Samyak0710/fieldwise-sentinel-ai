
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, BarChart, Droplets, Bug, Plant, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SprayHistory {
  date: Date;
  location: string;
  pestType: string;
  chemical: string;
}

const DecisionEngine: React.FC = () => {
  const [recommendation, setRecommendation] = useState<'spray' | 'dont-spray' | null>(null);
  const [justification, setJustification] = useState<string[]>([]);
  const [sprayHistory, setSprayHistory] = useState<SprayHistory[]>([]);
  const [selectedZone, setSelectedZone] = useState('greenhouse-1');
  const { toast } = useToast();
  
  // Load spray history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('sprayHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Convert string dates back to Date objects
        const history = parsed.map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
        setSprayHistory(history);
      } catch (error) {
        console.error('Error parsing spray history:', error);
      }
    }
  }, []);
  
  // Save spray history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sprayHistory', JSON.stringify(sprayHistory));
  }, [sprayHistory]);
  
  const generateRecommendation = () => {
    // Get mock environmental data
    const envReadings = localStorage.getItem('environmentalReadings');
    let environmentalData = null;
    if (envReadings) {
      try {
        environmentalData = JSON.parse(envReadings);
      } catch (error) {
        console.error('Error parsing environmental readings:', error);
      }
    }
    
    // Get mock pest detection data
    const pestData = localStorage.getItem('pestDetections');
    let pestDetections = [];
    if (pestData) {
      try {
        pestDetections = JSON.parse(pestData);
      } catch (error) {
        console.error('Error parsing pest detections:', error);
      }
    }
    
    // Check last spray date for this zone
    const lastSpray = sprayHistory
      .filter(spray => spray.location === selectedZone)
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
    
    const daysSinceLastSpray = lastSpray 
      ? Math.floor((new Date().getTime() - new Date(lastSpray.date).getTime()) / (1000 * 60 * 60 * 24)) 
      : 100; // If no spray history, set a large number
    
    // Decision logic
    const reasons: string[] = [];
    let decision: 'spray' | 'dont-spray' = 'dont-spray';
    
    // Check pest pressure (simulated)
    const pestPressure = Math.random() > 0.5 ? 'high' : 'low';
    if (pestPressure === 'high') {
      reasons.push('High pest pressure detected in this zone.');
      decision = 'spray';
    } else {
      reasons.push('Low pest pressure in this zone - monitoring recommended.');
    }
    
    // Check environmental conditions
    if (environmentalData) {
      const { readings, cropStage } = environmentalData;
      
      if (readings.humidity > 80) {
        reasons.push('High humidity (>80%) increases risk of disease with chemical application.');
        decision = 'dont-spray';
      }
      
      if (readings.temperature > 30) {
        reasons.push('High temperature (>30°C) may cause phytotoxicity with chemical application.');
        decision = 'dont-spray';
      }
      
      if (cropStage === 'flowering') {
        reasons.push('Crop is in sensitive flowering stage - potential yield impact from spraying.');
      }
    }
    
    // Check spray interval
    if (daysSinceLastSpray < 7) {
      reasons.push(`Only ${daysSinceLastSpray} days since last treatment. Minimum 7-day interval required.`);
      decision = 'dont-spray';
    } else {
      reasons.push(`${daysSinceLastSpray} days since last treatment, adequate interval for re-application if needed.`);
    }
    
    // Random weather factor (simulated)
    const rainPredicted = Math.random() > 0.7;
    if (rainPredicted) {
      reasons.push('Rain predicted in the next 24 hours, reducing spray effectiveness.');
      decision = 'dont-spray';
    }
    
    // Set the recommendation and justification
    setRecommendation(decision);
    setJustification(reasons);
    
    // Notify with toast
    toast({
      title: decision === 'spray' ? 'Spray Recommended' : 'Spray Not Recommended',
      description: reasons[0],
      variant: decision === 'spray' ? 'default' : 'destructive',
    });
  };
  
  const recordSprayApplication = () => {
    if (recommendation !== 'spray') return;
    
    const newSpray: SprayHistory = {
      date: new Date(),
      location: selectedZone,
      pestType: 'Mixed pests',
      chemical: 'Botanical insecticide'
    };
    
    setSprayHistory(prev => [...prev, newSpray]);
    
    toast({
      title: 'Spray Application Recorded',
      description: `Treatment applied in ${selectedZone} on ${new Date().toLocaleDateString()}`,
    });
    
    // Reset recommendation after recording
    setRecommendation(null);
    setJustification([]);
  };
  
  const zones = [
    { id: 'greenhouse-1', name: 'Greenhouse 1' },
    { id: 'greenhouse-2', name: 'Greenhouse 2' },
    { id: 'north-field', name: 'North Field' },
    { id: 'south-field', name: 'South Field' },
  ];
  
  return (
    <div id="decision-engine" className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Spray Decision Engine
          </CardTitle>
          <CardDescription>
            Smart recommendation system for optimal pest management decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input"
                >
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
              
              <Button 
                className="w-full"
                onClick={generateRecommendation}
              >
                Generate Recommendation
              </Button>
              
              {recommendation && (
                <Card className={
                  recommendation === 'spray' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      {recommendation === 'spray' ? (
                        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-12 w-12 text-green-500" />
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-12 w-12 text-red-500" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className={
                      `text-center text-xl font-bold mb-4 ${
                        recommendation === 'spray' ? 'text-green-700' : 'text-red-700'
                      }`
                    }>
                      {recommendation === 'spray' 
                        ? 'Spray Recommended' 
                        : 'Spray Not Recommended'
                      }
                    </h3>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Justification:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {justification.map((reason, index) => (
                          <li key={index} className="text-sm">{reason}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {recommendation === 'spray' && (
                      <Button 
                        className="w-full mt-4 bg-green-600 hover:bg-green-700"
                        onClick={recordSprayApplication}
                      >
                        Record Spray Application
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/5">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Bug className="h-8 w-8 text-red-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Pest Pressure</span>
                    <span className="text-xl font-medium">Moderate</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Plant className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Crop Stage</span>
                    <span className="text-xl font-medium">Vegetative</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Calendar className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Last Treatment</span>
                    <span className="text-xl font-medium">9 days ago</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5">
                  <CardContent className="p-4 flex flex-col items-center">
                    <BarChart className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Efficacy</span>
                    <span className="text-xl font-medium">86%</span>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Spray History</CardTitle>
                </CardHeader>
                <CardContent>
                  {sprayHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-4">
                      No spray history recorded yet
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {sprayHistory
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .map((spray, index) => (
                          <div 
                            key={index} 
                            className="p-3 border rounded-md text-sm flex justify-between"
                          >
                            <div>
                              <p className="font-medium">{spray.location}</p>
                              <p className="text-xs text-muted-foreground">
                                {spray.pestType} - {spray.chemical}
                              </p>
                            </div>
                            <div className="text-right">
                              <p>{spray.date.toLocaleDateString()}</p>
                              <p className="text-xs text-muted-foreground">
                                {spray.date.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 w-full"
                    onClick={() => {
                      const csv = [
                        ['Date', 'Location', 'Pest Type', 'Chemical Used'],
                        ...sprayHistory.map(spray => [
                          spray.date.toISOString(),
                          spray.location,
                          spray.pestType,
                          spray.chemical
                        ])
                      ].map(row => row.join(',')).join('\n');
                      
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'spray_history.csv';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      
                      toast({
                        title: 'Export Complete',
                        description: 'Spray history has been exported as CSV',
                      });
                    }}
                  >
                    Export History to CSV
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionEngine;
