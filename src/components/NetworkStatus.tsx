
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Wifi, WifiOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface NetworkStatusProps {
  className?: string;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ className }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
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

    // Initial check
    setIsOnline(navigator.onLine);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If we're online, don't show anything
  if (isOnline) return null;

  return (
    <div className={`bg-amber-50 border-t border-amber-200 p-2 text-amber-800 ${className}`}>
      <div className="container flex items-center justify-center gap-2 text-sm">
        <WifiOff className="h-4 w-4" />
        <span>
          {isMobile ? 
            'Working offline. Changes will sync later.' : 
            'Working offline. All data will be stored locally and synced when connection is restored.'}
        </span>
      </div>
    </div>
  );
};

export default NetworkStatus;
