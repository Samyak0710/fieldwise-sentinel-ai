
import React from 'react';
import { WifiOff } from 'lucide-react';

const OfflineNotification: React.FC = () => {
  return (
    <div className="bg-amber-50 border-t border-amber-200 p-2 text-amber-800">
      <div className="container flex items-center justify-center gap-2 text-sm">
        <WifiOff className="h-4 w-4" />
        <span>
          Working offline. All detections will be stored locally and synced when connection is restored.
        </span>
      </div>
    </div>
  );
};

export default OfflineNotification;
