
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Menu, X, Mic, MicOff, Leaf, AlertTriangle 
} from "lucide-react";
import OfflineNotification from './OfflineNotification';
import { simulateNetworkStatus } from '@/utils/mockData';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [isOnline, setIsOnline] = useState(simulateNetworkStatus());

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleListening = () => {
    setListening(!listening);
    // In a real app, this would activate the speech recognition
    if (!listening) {
      console.log("Voice recognition activated");
    } else {
      console.log("Voice recognition deactivated");
    }
  };

  // Simulate network status changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(simulateNetworkStatus());
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-fieldwise-green" />
            <h1 className="text-xl font-bold">FieldWise Sentinel</h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <a href="#dashboard" className="text-sm font-medium hover:text-primary">Dashboard</a>
            <a href="#detection" className="text-sm font-medium hover:text-primary">Pest Detection</a>
            <a href="#map" className="text-sm font-medium hover:text-primary">Field Map</a>
            <a href="#treatments" className="text-sm font-medium hover:text-primary">Treatments</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {!isOnline && <AlertTriangle className="h-5 w-5 text-amber-500" />}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleListening}
            className={listening ? "bg-primary text-primary-foreground" : ""}
          >
            {listening ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col gap-4">
            <a href="#dashboard" className="text-sm font-medium hover:text-primary" onClick={() => setMenuOpen(false)}>Dashboard</a>
            <a href="#detection" className="text-sm font-medium hover:text-primary" onClick={() => setMenuOpen(false)}>Pest Detection</a>
            <a href="#map" className="text-sm font-medium hover:text-primary" onClick={() => setMenuOpen(false)}>Field Map</a>
            <a href="#treatments" className="text-sm font-medium hover:text-primary" onClick={() => setMenuOpen(false)}>Treatments</a>
          </nav>
        </div>
      )}
      
      {!isOnline && <OfflineNotification />}
    </header>
  );
};

export default Header;
