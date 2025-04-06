
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NewHeader } from '@/components/NewHeader';
import { Bug, Clock, Zap, Crop, Database, WifiOff, Check, Settings } from 'lucide-react';
import DecisionEngine from '@/components/DecisionEngine';
import RealtimeEnvironmentalData from '@/components/RealtimeEnvironmentalData';
import RealtimePestDetection from '@/components/RealtimePestDetection';
import VoiceCommandInterface from '@/components/VoiceCommandInterface';
import ZoneManagement from '@/components/ZoneManagement';
import SystemSettings from '@/components/SystemSettings';
import ApiStatusIndicator from '@/components/ApiStatusIndicator';
import AuthStatus from '@/components/AuthStatus';
import FarmerChatbot from '@/components/FarmerChatbot';
import { useWebSocket } from '@/hooks/useWebSocket';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const { isConnected, isSimulated } = useWebSocket();
  
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
      voiceMessages: JSON.parse(localStorage.getItem('voiceCommands') || '[]')
    };
    
    // Convert to CSV format
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
      
      {/* Offline notification */}
      {!isOnline && (
        <div className="bg-amber-500 text-white p-2 text-center text-sm flex items-center justify-center">
          <WifiOff className="h-4 w-4 mr-2" />
          You are currently offline. Limited functionality is available.
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-4 h-7 text-xs bg-amber-600 text-white border-white hover:bg-amber-700"
            onClick={handleSyncData}
          >
            Sync when online
          </Button>
        </div>
      )}
      
      {/* API Status indicator */}
      <div className="bg-primary/5 border-b p-2 text-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>API Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
            {isSimulated && <span className="ml-2 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">Using Simulated Data</span>}
          </div>
          
          <div className="flex items-center">
            <span className="text-muted-foreground">Last synced: {lastSynced ? lastSynced.toLocaleTimeString() : 'Never'}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={handleSyncData}
            disabled={!isOnline}
          >
            <Database className="h-3.5 w-3.5 mr-1" />
            Sync Data
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs"
            onClick={handleExportData}
          >
            Export Data
          </Button>
          
          <Button
            variant={showSettings ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-3.5 w-3.5 mr-1" />
            {showSettings ? "Close Settings" : "Settings"}
          </Button>
        </div>
      </div>
      
      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Smart Pest Management Dashboard</h1>
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
              <RealtimePestDetection />
              <RealtimeEnvironmentalData />
            </div>
            
            <div className="grid grid-cols-1 gap-8 mb-8">
              <DecisionEngine />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VoiceCommandInterface />
              <FarmerChatbot />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
