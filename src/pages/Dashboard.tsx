
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewHeader } from '@/components/NewHeader';
import { Bug, Clock, Zap, Crop, Database, WifiOff, Check, Settings } from 'lucide-react';
import PestDetectionEngine from '@/components/PestDetectionEngine';
import EnvironmentalSensorSimulation from '@/components/EnvironmentalSensorSimulation';
import DecisionEngine from '@/components/DecisionEngine';
import VoiceCommandInterface from '@/components/VoiceCommandInterface';
import ZoneManagement from '@/components/ZoneManagement';
import SystemSettings from '@/components/SystemSettings';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Check if settings should be shown based on URL parameter
    const queryParams = new URLSearchParams(location.search);
    setShowSettings(queryParams.get('settings') === 'true');
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Get last sync time from localStorage
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setLastSynced(new Date(lastSync));
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [location]);
  
  const handleSyncData = () => {
    // Simulate syncing process
    toast.loading('Syncing data to cloud...', { duration: 2000 });
    
    setTimeout(() => {
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('lastSyncTime', now.toISOString());
      
      toast.success('Data successfully synced to cloud');
    }, 2000);
  };
  
  const handleExportData = () => {
    // Get all data from localStorage
    const data = {
      environmentalReadings: JSON.parse(localStorage.getItem('environmentalReadings') || '{}'),
      pestDetections: JSON.parse(localStorage.getItem('pestDetections') || '[]'),
      sprayHistory: JSON.parse(localStorage.getItem('sprayHistory') || '[]'),
      farmZones: JSON.parse(localStorage.getItem('farmZones') || '[]'),
      voiceMessages: JSON.parse(localStorage.getItem('voiceMessages') || '[]')
    };
    
    // Convert to CSV format (simplified version)
    const csv = Object.entries(data)
      .map(([key, value]) => `# ${key}\n${JSON.stringify(value)}`)
      .join('\n\n');
    
    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agri-pest-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NewHeader />
      
      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Smart Pest Management Dashboard</h1>
          
          <div className="flex items-center gap-3">
            <div className="text-sm">
              {isOnline ? (
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  Online
                </span>
              ) : (
                <span className="flex items-center text-amber-600">
                  <WifiOff className="h-4 w-4 mr-1" />
                  Offline
                </span>
              )}
              {lastSynced && (
                <span className="text-muted-foreground text-xs block">
                  Last synced: {lastSynced.toLocaleString()}
                </span>
              )}
            </div>
            
            <Button 
              onClick={handleSyncData}
              disabled={!isOnline}
              variant="outline"
              size="sm"
            >
              <Database className="h-4 w-4 mr-2" />
              Sync to Cloud
            </Button>
            
            <Button 
              onClick={handleExportData}
              variant="outline"
              size="sm"
            >
              Export Data
            </Button>
            
            <Button
              variant={showSettings ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showSettings ? "Close Settings" : "Settings"}
            </Button>
          </div>
        </div>
        
        {showSettings ? (
          <SystemSettings />
        ) : (
          <>
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pest Detections</p>
                    <p className="text-2xl font-bold">143</p>
                    <p className="text-xs text-green-600">↑ 12% from last week</p>
                  </div>
                  <Bug className="h-8 w-8 text-primary opacity-80" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Spray Efficiency</p>
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-xs text-green-600">↑ 5% from last application</p>
                  </div>
                  <Zap className="h-8 w-8 text-primary opacity-80" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Next Scheduled Action</p>
                    <p className="text-2xl font-bold">Today</p>
                    <p className="text-xs">North Field Inspection</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary opacity-80" />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Crop Health Index</p>
                    <p className="text-2xl font-bold">92/100</p>
                    <p className="text-xs text-green-600">↑ 3 points this month</p>
                  </div>
                  <Crop className="h-8 w-8 text-primary opacity-80" />
                </CardContent>
              </Card>
            </div>
            
            {/* Main Components */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <PestDetectionEngine />
              <EnvironmentalSensorSimulation />
            </div>
            
            <div className="grid grid-cols-1 gap-8 mb-8">
              <DecisionEngine />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VoiceCommandInterface />
              <ZoneManagement />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
