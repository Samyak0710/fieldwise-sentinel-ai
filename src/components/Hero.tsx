
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  backgroundImage: string;
  title: string;
  subtitle: string;
  description: string;
}

const Hero: React.FC<HeroProps> = ({ backgroundImage, title, subtitle, description }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4 z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">{title}</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">{subtitle}</h2>
        <p className="text-lg md:text-xl max-w-xl mx-auto mb-8">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-white text-primary hover:bg-white/90">
            Learn More
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
