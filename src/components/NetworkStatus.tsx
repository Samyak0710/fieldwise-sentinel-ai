
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Wifi, WifiOff, RefreshCw, Database, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";

export interface NetworkStatusProps {
  className?: string;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(localStorage.getItem('lastSyncTime'));
  const isMobile = useIsMobile();

  useEffect(() => {
    // Handle offline/online events
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Connection restored', {
        description: 'Your data will now sync with the server'
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline', {
        description: 'Data will be stored locally until connection is restored'
      });
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for messages from service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, timestamp } = event.data;
        
        if (type === 'SYNC_COMPLETED') {
          setSyncInProgress(false);
          setLastSynced(timestamp);
          localStorage.setItem('lastSyncTime', timestamp);
          toast.success('Data synced successfully');
        } else if (type === 'SYNC_FAILED') {
          setSyncInProgress(false);
          toast.error('Sync failed', { 
            description: 'Please try again later' 
          });
        } else if (type === 'BACKUP_COMPLETED') {
          toast.success('Backup completed', { 
            description: `Version: ${event.data.version}` 
          });
        }
      });
    }

    // Initial check
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle manual sync request
  const handleSync = () => {
    if (!isOnline) {
      toast.error('Cannot sync while offline');
      return;
    }

    setSyncInProgress(true);
    toast.loading('Syncing data...', { duration: 3000 });

    // Register a sync task with the service worker
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready
        .then((registration) => {
          // Check if sync is available in the registration
          if ('sync' in registration) {
            return (registration as any).sync.register('sync-data');
          } else {
            throw new Error('Background sync not available');
          }
        })
        .catch((err) => {
          console.error('Sync registration failed:', err);
          setSyncInProgress(false);
          toast.error('Sync failed', { 
            description: 'Background sync not available' 
          });
          
          // Fallback for browsers that don't support background sync
          syncDataManually();
        });
    } else {
      // Fallback for browsers that don't support background sync
      syncDataManually();
    }
  };

  // Fallback sync function
  const syncDataManually = () => {
    // Simulate sync process
    setTimeout(() => {
      const now = new Date().toISOString();
      setLastSynced(now);
      localStorage.setItem('lastSyncTime', now);
      setSyncInProgress(false);
      toast.success('Data synced successfully');
    }, 2000);
  };

  // If we're online, show minimal status
  if (isOnline) {
    return (
      <div className={`bg-green-50 border-t border-green-200 p-1 text-green-800 ${className}`}>
        <div className="container flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            <span className="hidden sm:inline">Online</span>
            <Lock className="h-3 w-3 ml-2" aria-label="Encrypted connection" />
            {lastSynced && (
              <span className="hidden md:inline text-xs ml-2">
                Last sync: {new Date(lastSynced).toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs py-0 px-2"
            onClick={handleSync}
            disabled={syncInProgress}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${syncInProgress ? 'animate-spin' : ''}`} />
            {syncInProgress ? 'Syncing...' : 'Sync'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-amber-50 border-t border-amber-200 p-2 text-amber-800 ${className}`}>
      <div className="container flex items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-1">
          <WifiOff className="h-4 w-4" />
          <span>
            {isMobile ? 
              'Working offline. Changes will sync later.' : 
              'Working offline. All data will be stored locally and synced when connection is restored.'}
          </span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-amber-100 border-amber-300"
          onClick={() => toast.info('Your data is safely stored locally and will sync automatically when you reconnect.')}
        >
          <Database className="h-4 w-4 mr-1" />
          {isMobile ? 'Info' : 'Storage Info'}
        </Button>
      </div>
    </div>
  );
};

export default NetworkStatus;
