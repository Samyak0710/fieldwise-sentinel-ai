
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Bug, LogOut, MenuIcon, RefreshCw, WifiOff } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationMenu from './NotificationMenu';
import VoiceCommand from './VoiceCommand';
import { useIsMobile } from '@/hooks/use-mobile';
import { apiService } from '@/services/api';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [syncingData, setSyncingData] = useState(false);
  
  useEffect(() => {
    // Load pending requests count from localStorage
    try {
      const offlineQueue = localStorage.getItem('offline_requests_queue');
      if (offlineQueue) {
        const queue = JSON.parse(offlineQueue);
        setPendingRequestsCount(Array.isArray(queue) ? queue.length : 0);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
    
    // Handle offline/online events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
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
  
  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    window.location.href = '/login';
  };
  
  const handleSyncData = async () => {
    if (!isOnline) return;
    
    setSyncingData(true);
    try {
      await apiService.processPendingRequests();
      setPendingRequestsCount(0);
    } catch (error) {
      console.error('Failed to sync data:', error);
    } finally {
      setSyncingData(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/60 backdrop-blur-sm" role="banner">
      <div className="container flex h-16 items-center">
        <Link 
          to="/" 
          className="mr-4 flex items-center gap-2"
          aria-label="FieldWise Sentinel Home"
        >
          <Bug className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold hidden sm:inline-block">FieldWise Sentinel</span>
        </Link>
        
        <nav 
          className="hidden md:flex items-center space-x-1" 
          role="navigation" 
          aria-label="Main Navigation"
        >
          <Link to="/dashboard">
            <Button 
              variant="ghost" 
              className={location.pathname === '/dashboard' ? 'bg-accent' : 'text-muted-foreground'} 
              aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/dashboard/fields">
            <Button 
              variant="ghost" 
              className={location.pathname.includes('/fields') ? 'bg-accent' : 'text-muted-foreground'} 
              aria-current={location.pathname.includes('/fields') ? 'page' : undefined}
            >
              Fields
            </Button>
          </Link>
          <Link to="/dashboard/reports">
            <Button 
              variant="ghost" 
              className={location.pathname.includes('/reports') ? 'bg-accent' : 'text-muted-foreground'} 
              aria-current={location.pathname.includes('/reports') ? 'page' : undefined}
            >
              Reports
            </Button>
          </Link>
          <Link to="/dashboard/settings">
            <Button 
              variant="ghost" 
              className={location.pathname.includes('/settings') ? 'bg-accent' : 'text-muted-foreground'} 
              aria-current={location.pathname.includes('/settings') ? 'page' : undefined}
            >
              Settings
            </Button>
          </Link>
        </nav>
        
        <div className="ml-auto flex items-center gap-2">
          {/* Show sync button if there are pending requests and we're online */}
          {isOnline && pendingRequestsCount > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSyncData}
              disabled={syncingData}
              aria-label={`Sync ${pendingRequestsCount} pending requests`}
              className="text-xs gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${syncingData ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
              <span className="bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
                {pendingRequestsCount}
              </span>
            </Button>
          )}
          
          {/* Show offline indicator if offline */}
          {!isOnline && (
            <div className="flex items-center text-amber-600 gap-1 text-xs border border-amber-200 rounded px-2 py-1">
              <WifiOff className="h-3 w-3" />
              <span className="hidden sm:inline">Offline</span>
            </div>
          )}
          
          <VoiceCommand />
          <NotificationMenu />
          <ModeToggle />
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleLogout} 
            className="hidden sm:flex"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <MenuIcon className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex items-center gap-2 mb-6">
                <Bug className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">FieldWise Sentinel</span>
              </div>
              
              <nav className="flex flex-col space-y-4 py-4" role="navigation" aria-label="Mobile Navigation">
                <Link to="/dashboard">
                  <Button 
                    variant="ghost" 
                    className="justify-start w-full"
                    aria-current={location.pathname === '/dashboard' ? 'page' : undefined}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/dashboard/fields">
                  <Button 
                    variant="ghost" 
                    className="justify-start w-full"
                    aria-current={location.pathname.includes('/fields') ? 'page' : undefined}
                  >
                    Fields
                  </Button>
                </Link>
                <Link to="/dashboard/reports">
                  <Button 
                    variant="ghost" 
                    className="justify-start w-full"
                    aria-current={location.pathname.includes('/reports') ? 'page' : undefined}
                  >
                    Reports
                  </Button>
                </Link>
                <Link to="/dashboard/settings">
                  <Button 
                    variant="ghost" 
                    className="justify-start w-full"
                    aria-current={location.pathname.includes('/settings') ? 'page' : undefined}
                  >
                    Settings
                  </Button>
                </Link>
                <Button variant="ghost" className="justify-start text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                  Logout
                </Button>
              </nav>
              
              {/* Mobile offline indicators */}
              {!isOnline && (
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex items-center text-amber-600 gap-2 text-sm">
                    <WifiOff className="h-4 w-4" />
                    <span>Working offline</span>
                  </div>
                </div>
              )}
              
              {isOnline && pendingRequestsCount > 0 && (
                <div className="mt-auto pt-4 border-t border-border">
                  <Button 
                    onClick={handleSyncData}
                    disabled={syncingData}
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${syncingData ? 'animate-spin' : ''}`} />
                    Sync {pendingRequestsCount} pending requests
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
