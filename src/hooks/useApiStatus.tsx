
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ApiStatus {
  isOnline: boolean;
  lastSynced: Date | null;
  apiConnected: boolean;
  syncInProgress: boolean;
  syncData: () => Promise<boolean>;
}

export const useApiStatus = (): ApiStatus => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [syncInProgress, setSyncInProgress] = useState<boolean>(false);
  
  // Initialize and set up event listeners
  useEffect(() => {
    // Check if there's a stored last sync time
    const storedLastSync = localStorage.getItem('lastSyncTime');
    if (storedLastSync) {
      setLastSynced(new Date(storedLastSync));
    }
    
    // Set up network status listeners
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online', {
        description: 'Your connection has been restored'
      });
      
      // Try to check API connection
      checkApiConnection();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setApiConnected(false);
      toast.warning('You are offline', {
        description: 'Working in offline mode'
      });
    };
    
    // Check API connection on initial load
    checkApiConnection();
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Function to check API connection
  const checkApiConnection = async () => {
    if (!navigator.onLine) {
      setApiConnected(false);
      return false;
    }
    
    try {
      // In a real app, we would ping the API server
      // For demo purposes, simulate a successful connection
      const connected = Math.random() > 0.2; // 80% chance of success
      
      setApiConnected(connected);
      return connected;
    } catch (error) {
      console.error('Failed to check API connection:', error);
      setApiConnected(false);
      return false;
    }
  };
  
  // Function to synchronize data
  const syncData = async (): Promise<boolean> => {
    if (!navigator.onLine) {
      toast.error('Cannot sync while offline', {
        description: 'Please check your connection and try again'
      });
      return false;
    }
    
    if (syncInProgress) {
      toast.info('Sync already in progress');
      return false;
    }
    
    setSyncInProgress(true);
    toast.loading('Syncing data to cloud...', { duration: 2000 });
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('lastSyncTime', now.toISOString());
      
      toast.success('Data successfully synced');
      setSyncInProgress(false);
      return true;
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed', {
        description: 'There was an error syncing your data'
      });
      setSyncInProgress(false);
      return false;
    }
  };
  
  return {
    isOnline,
    lastSynced,
    apiConnected,
    syncInProgress,
    syncData
  };
};
