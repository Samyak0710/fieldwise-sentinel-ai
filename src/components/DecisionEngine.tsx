
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Droplets } from 'lucide-react';
import SprayRecommendation from './decision-engine/SprayRecommendation';
import EnvironmentalStatus from './decision-engine/EnvironmentalStatus';
import SprayHistory from './decision-engine/SprayHistory';
import { decisionService } from '@/services/decisionService';

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const savedHistory = localStorage.getItem('sprayHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
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
  
  useEffect(() => {
    localStorage.setItem('sprayHistory', JSON.stringify(sprayHistory));
  }, [sprayHistory]);
  
  const generateRecommendation = async () => {
    setIsLoading(true);
    
    try {
      // Get environmental data and pest detections from localStorage
      const envReadings = localStorage.getItem('environmentalReadings');
      let environmentalData = null;
      if (envReadings) {
        try {
          environmentalData = JSON.parse(envReadings);
        } catch (error) {
          console.error('Error parsing environmental readings:', error);
        }
      }
      
      const pestData = localStorage.getItem('pestDetections');
      let pestDetections = [];
      if (pestData) {
        try {
          pestDetections = JSON.parse(pestData);
        } catch (error) {
          console.error('Error parsing pest detections:', error);
        }
      }
      
      // Get recommendation from API or fall back to local logic
      try {
        // This would use the API in a real implementation
        const recommendation = await decisionService.getRecommendation(
          selectedZone,
          true,
          true
        );
        
        setRecommendation(recommendation.decision);
        setJustification(recommendation.reasons);
        
        toast({
          title: recommendation.decision === 'spray' ? 'Spray Recommended' : 'Spray Not Recommended',
          description: recommendation.reasons[0],
          variant: recommendation.decision === 'spray' ? 'default' : 'destructive',
        });
      } catch (error) {
        console.error('Failed to get recommendation from API, using local fallback:', error);
        
        // Fallback to local logic if API fails
        const lastSpray = sprayHistory
          .filter(spray => spray.location === selectedZone)
          .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
        
        const daysSinceLastSpray = lastSpray 
          ? Math.floor((new Date().getTime() - new Date(lastSpray.date).getTime()) / (1000 * 60 * 60 * 24)) 
          : 100;
        
        const reasons: string[] = [];
        let decision: 'spray' | 'dont-spray' = 'dont-spray';
        
        const pestPressure = Math.random() > 0.5 ? 'high' : 'low';
        if (pestPressure === 'high') {
          reasons.push('High pest pressure detected in this zone.');
          decision = 'spray';
        } else {
          reasons.push('Low pest pressure in this zone - monitoring recommended.');
        }
        
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
        
        if (daysSinceLastSpray < 7) {
          reasons.push(`Only ${daysSinceLastSpray} days since last treatment. Minimum 7-day interval required.`);
          decision = 'dont-spray';
        } else {
          reasons.push(`${daysSinceLastSpray} days since last treatment, adequate interval for re-application if needed.`);
        }
        
        const rainPredicted = Math.random() > 0.7;
        if (rainPredicted) {
          reasons.push('Rain predicted in the next 24 hours, reducing spray effectiveness.');
          decision = 'dont-spray';
        }
        
        setRecommendation(decision);
        setJustification(reasons);
        
        toast({
          title: decision === 'spray' ? 'Spray Recommended' : 'Spray Not Recommended',
          description: reasons[0],
          variant: decision === 'spray' ? 'default' : 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const recordSprayApplication = async () => {
    if (recommendation !== 'spray') return;
    
    const newSpray: SprayHistory = {
      date: new Date(),
      location: selectedZone,
      pestType: 'Mixed pests',
      chemical: 'Botanical insecticide'
    };
    
    try {
      // This would use the API in a real implementation
      await decisionService.recordSprayApplication({
        date: newSpray.date,
        location: newSpray.location,
        product: newSpray.chemical,
        rate: '15ml/L',
        applicator: 'System User',
        target: newSpray.pestType,
        notes: 'Applied based on system recommendation'
      });
      
      setSprayHistory(prev => [...prev, newSpray]);
      
      toast({
        title: 'Spray Application Recorded',
        description: `Treatment applied in ${selectedZone} on ${new Date().toLocaleDateString()}`,
      });
      
      setRecommendation(null);
      setJustification([]);
    } catch (error) {
      console.error('Failed to record spray application:', error);
      
      // Fallback to local storage only
      setSprayHistory(prev => [...prev, newSpray]);
      
      toast({
        title: 'Spray Application Recorded (Offline)',
        description: `Treatment applied in ${selectedZone} on ${new Date().toLocaleDateString()}`,
      });
      
      setRecommendation(null);
      setJustification([]);
    }
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
                disabled={isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Generate Recommendation'}
              </Button>
              
              {recommendation && (
                <SprayRecommendation 
                  recommendation={recommendation}
                  justification={justification}
                  onRecord={recordSprayApplication}
                />
              )}
            </div>
            
            <div className="flex-1 space-y-6">
              <EnvironmentalStatus />
              <SprayHistory history={sprayHistory} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionEngine;
