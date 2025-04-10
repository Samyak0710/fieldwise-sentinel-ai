
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { toast } from 'sonner';
import { Leaf, Droplets, CalendarDays, RefreshCw, AlertTriangle, Check, PieChart, Bug, BarChart2, Skull } from 'lucide-react';
import { decisionService, SprayHistory } from '../services/decisionService';
import { supabase } from "@/integrations/supabase/client";

interface SprayHistoryItem {
  date: Date;
  location: string;
  pestType: string;
  chemical: string;
}

const DecisionEngine: React.FC = () => {
  const [recommendation, setRecommendation] = useState<'spray' | 'dont-spray' | null>(null);
  const [justification, setJustification] = useState<string[]>([]);
  const [sprayHistory, setSprayHistory] = useState<SprayHistoryItem[]>([]);
  const [selectedZone, setSelectedZone] = useState('greenhouse-1');
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high'>('low');
  const { toast: uiToast } = useToast();
  
  useEffect(() => {
    // Fetch spray history from Supabase when component mounts
    const fetchSprayHistory = async () => {
      try {
        const history = await decisionService.getSprayHistory();
        const formattedHistory = history.map(item => ({
          date: new Date(item.date),
          location: item.location,
          pestType: item.target,
          chemical: item.product
        }));
        setSprayHistory(formattedHistory);
      } catch (error) {
        console.error('Error fetching spray history:', error);
      }
    };
    
    fetchSprayHistory();
    
    // Fallback to localStorage if Supabase fetch fails
    const savedHistory = localStorage.getItem('sprayHistory');
    if (savedHistory && sprayHistory.length === 0) {
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
    try {
      // Use the decisionService to get a recommendation
      const result = await decisionService.getRecommendation(selectedZone);
      
      setRecommendation(result.decision);
      setJustification(result.reasons);
      setThreatLevel(result.threatLevel);
      
      // Show notification based on threat level
      if (result.threatLevel === 'high') {
        toast.error('High Threat Level Detected', {
          description: 'Immediate spraying recommended regardless of pest count',
          duration: 7000,
        });
        
        uiToast({
          title: result.decision === 'spray' ? 'Spray Recommended' : 'Spray Not Recommended',
          description: result.reasons[0],
          variant: 'destructive',
        });
      } else {
        toast.info(result.decision === 'spray' ? 'Spray Recommended' : 'Spray Not Recommended', {
          description: result.reasons[0],
          duration: 5000,
        });
        
        uiToast({
          title: result.decision === 'spray' ? 'Spray Recommended' : 'Spray Not Recommended',
          description: result.reasons[0],
          variant: result.decision === 'spray' ? 'default' : 'destructive',
        });
      }
    } catch (error) {
      console.error("Error generating recommendation:", error);
      toast.error('Failed to generate recommendation', {
        description: 'Please try again later',
      });
    }
  };
  
  const recordSprayApplication = async () => {
    if (recommendation !== 'spray') return;
    
    const newSpray: SprayHistoryItem = {
      date: new Date(),
      location: selectedZone,
      pestType: 'Mixed pests',
      chemical: 'Botanical insecticide'
    };
    
    try {
      // Record spray application using decisionService
      await decisionService.recordSprayApplication({
        date: new Date(),
        location: selectedZone,
        target: 'Mixed pests',
        product: 'Botanical insecticide',
        rate: '15ml/L',
        applicator: 'System user',
      });
      
      setSprayHistory(prev => [...prev, newSpray]);
      
      toast.success('Spray Application Recorded', {
        description: `Treatment applied in ${selectedZone} on ${new Date().toLocaleDateString()}`,
        duration: 5000,
      });
      
      uiToast({
        title: 'Spray Application Recorded',
        description: `Treatment applied in ${selectedZone} on ${new Date().toLocaleDateString()}`,
      });
      
      setRecommendation(null);
      setJustification([]);
    } catch (error) {
      console.error("Error recording spray application:", error);
      toast.error('Failed to record spray application', {
        description: 'Please try again later',
      });
    }
  };
  
  const zones = [
    { id: 'greenhouse-1', name: 'Greenhouse 1' },
    { id: 'greenhouse-2', name: 'Greenhouse 2' },
    { id: 'north-field', name: 'North Field' },
    { id: 'south-field', name: 'South Field' },
  ];
  
  const getThreatIcon = () => {
    switch (threatLevel) {
      case 'high':
        return <Skull className="h-12 w-12 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-12 w-12 text-amber-500" />;
      case 'low':
        return recommendation === 'spray' 
          ? <Check className="h-12 w-12 text-green-500" />
          : <AlertTriangle className="h-12 w-12 text-red-500" />;
      default:
        return recommendation === 'spray' 
          ? <Check className="h-12 w-12 text-green-500" />
          : <AlertTriangle className="h-12 w-12 text-red-500" />;
    }
  };
  
  return (
    <div id="decision-engine" className="space-y-6">
      <Card className="overflow-hidden animate-fade-in-slide duration-700">
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
                  threatLevel === 'high'
                    ? 'border-red-500 bg-red-50 animate-pulse-once' 
                    : recommendation === 'spray' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                }>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className={`h-24 w-24 rounded-full ${
                        threatLevel === 'high' 
                          ? 'bg-red-100' 
                          : recommendation === 'spray' 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                      } flex items-center justify-center animate-fade-in-scale`}>
                        {getThreatIcon()}
                      </div>
                    </div>
                    
                    <h3 className={
                      `text-center text-xl font-bold mb-2 ${
                        threatLevel === 'high' 
                          ? 'text-red-700' 
                          : recommendation === 'spray' 
                            ? 'text-green-700' 
                            : 'text-red-700'
                      }`
                    }>
                      {threatLevel === 'high' 
                        ? 'High Risk - Spray Recommended'
                        : recommendation === 'spray' 
                          ? 'Spray Recommended' 
                          : 'Spray Not Recommended'
                      }
                    </h3>
                    
                    <p className="text-center mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        threatLevel === 'high' ? 'bg-red-100 text-red-800' :
                        threatLevel === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        Threat Level: {threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)}
                      </span>
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Justification:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {justification.map((reason, index) => (
                          <li key={index} className="text-sm">{reason}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {(recommendation === 'spray' || threatLevel === 'high') && (
                      <Button 
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 animate-pulse-once"
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
                <Card className="bg-primary/5 transform transition-transform hover:scale-105">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Bug className="h-8 w-8 text-red-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Pest Pressure</span>
                    <span className="text-xl font-medium">Moderate</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 transform transition-transform hover:scale-105">
                  <CardContent className="p-4 flex flex-col items-center">
                    <Leaf className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Crop Stage</span>
                    <span className="text-xl font-medium">Vegetative</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 transform transition-transform hover:scale-105">
                  <CardContent className="p-4 flex flex-col items-center">
                    <CalendarDays className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Last Treatment</span>
                    <span className="text-xl font-medium">9 days ago</span>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/5 transform transition-transform hover:scale-105">
                  <CardContent className="p-4 flex flex-col items-center">
                    <BarChart2 className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-xs text-muted-foreground">Efficacy</span>
                    <span className="text-xl font-medium">86%</span>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="transform transition-all hover:-translate-y-1">
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
                            className="p-3 border rounded-md text-sm flex justify-between hover:bg-muted/50 transition-colors"
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
                      
                      toast.success('Export Complete', {
                        description: 'Spray history has been exported as CSV',
                        duration: 3000,
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
