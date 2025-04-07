
import React from 'react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Bug, LogOut, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationMenu from './NotificationMenu';
import VoiceCommand from './VoiceCommand';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  
  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/60 backdrop-blur-sm" role="banner">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-2">
          <Bug className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold hidden sm:inline-block">FieldWise Sentinel</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1" role="navigation" aria-label="Main Navigation">
          <Button variant="ghost" className="text-muted-foreground" aria-current="page">Dashboard</Button>
          <Button variant="ghost" className="text-muted-foreground">Fields</Button>
          <Button variant="ghost" className="text-muted-foreground">Reports</Button>
          <Button variant="ghost" className="text-muted-foreground">Settings</Button>
        </nav>
        
        <div className="ml-auto flex items-center gap-2">
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
              <nav className="flex flex-col space-y-4 py-4" role="navigation" aria-label="Mobile Navigation">
                <Button variant="ghost" className="justify-start">Dashboard</Button>
                <Button variant="ghost" className="justify-start">Fields</Button>
                <Button variant="ghost" className="justify-start">Reports</Button>
                <Button variant="ghost" className="justify-start">Settings</Button>
                <Button variant="ghost" className="justify-start text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
