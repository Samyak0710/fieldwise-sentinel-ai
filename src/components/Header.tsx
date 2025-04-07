
import React from 'react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Bug, LogOut, MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationMenu from './NotificationMenu';
import VoiceCommand from './VoiceCommand';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/60 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center gap-2">
          <Bug className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold hidden sm:inline-block">FieldWise Sentinel</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <Link to="/dashboard">
            <Button variant="ghost" className="text-muted-foreground">Dashboard</Button>
          </Link>
          <Button variant="ghost" className="text-muted-foreground">Fields</Button>
          <Button variant="ghost" className="text-muted-foreground">Reports</Button>
          <Button variant="ghost" className="text-muted-foreground">Settings</Button>
        </div>
        
        <div className="ml-auto flex items-center gap-2">
          <VoiceCommand />
          <NotificationMenu />
          <ModeToggle />
          <Button size="icon" variant="ghost" onClick={handleLogout} className="hidden sm:flex">
            <LogOut className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col space-y-4 py-4">
                <Link to="/dashboard">
                  <Button variant="ghost" className="justify-start w-full">Dashboard</Button>
                </Link>
                <Button variant="ghost" className="justify-start">Fields</Button>
                <Button variant="ghost" className="justify-start">Reports</Button>
                <Button variant="ghost" className="justify-start">Settings</Button>
                <Button variant="ghost" className="justify-start text-red-500" onClick={handleLogout}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
