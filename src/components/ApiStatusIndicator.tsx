
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, WifiOff, Database, Info, AlertTriangle } from 'lucide-react';
import { useApiStatus } from '@/hooks/useApiStatus';

const ApiStatusIndicator = () => {
  const { isOnline, lastSynced, apiConnected, syncInProgress, syncData } = useApiStatus();
  
  return (
    <Card className="bg-background border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full w-2 h-2 animate-pulse" 
              style={{ backgroundColor: isOnline && apiConnected ? '#10b981' : '#ef4444' }} 
            />
            
            <div className="text-sm">
              {isOnline ? (
                apiConnected ? (
                  <span className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    API Connected
                  </span>
                ) : (
                  <span className="flex items-center text-amber-600">
                    <Info className="h-4 w-4 mr-1" />
                    Limited Connectivity
                  </span>
                )
              ) : (
                <span className="flex items-center text-red-600">
                  <WifiOff className="h-4 w-4 mr-1" />
                  Offline Mode
                </span>
              )}
              
              {lastSynced && (
                <span className="text-muted-foreground text-xs block">
                  Last synced: {lastSynced.toLocaleString()}
                </span>
              )}
              
              {!isOnline && (
                <span className="text-xs text-muted-foreground">
                  Using cached data
                </span>
              )}
              
              {isOnline && !apiConnected && (
                <span className="text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  Using simulated data
                </span>
              )}
            </div>
          </div>
          
          <Button 
            onClick={syncData}
            disabled={!isOnline || syncInProgress}
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            <Database className="h-4 w-4 mr-2" />
            {syncInProgress ? "Syncing..." : "Sync to Cloud"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiStatusIndicator;
