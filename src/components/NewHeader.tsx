
import React from 'react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const NewHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm bg-white/5">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-primary">PestVision</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/technology" className="nav-link">Technology</Link>
          <Link to="/benefits" className="nav-link">Benefits for Farmers</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-md">
            Get Started
          </Button>
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/technology" className="text-lg font-medium py-2">Technology</Link>
                <Link to="/benefits" className="text-lg font-medium py-2">Benefits for Farmers</Link>
                <Link to="/contact" className="text-lg font-medium py-2">Contact</Link>
                <Button className="mt-4 w-full">Get Started</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
