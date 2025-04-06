
import React from 'react';
import { Home, Palmtree, WifiOff, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FarmTypesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Smart Solutions for Every Farm Type</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our agricultural pest management system adapts to your specific farming operation, providing tailored recommendations for optimal results.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="feature-card text-center border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-col items-center">
              <Home className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Greenhouse Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Specialized sensors and climate-specific pest modeling for controlled environment agriculture.</p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Real-time humidity and temperature control</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Early detection system for greenhouse pests</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Biological control agent scheduling</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="feature-card text-center border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-col items-center">
              <Palmtree className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Open Field Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Drone-based surveillance and weather-adaptive pest prediction for large acreage operations.</p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Weather forecast integration</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Zone-specific treatment recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Aerial mapping of pest hotspots</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="feature-card text-center border-primary/10 hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-col items-center">
              <Droplets className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Hydroponic Growers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Specialized nutrient and solution monitoring with pest intervention for water-based systems.</p>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Water quality and nutrient balance tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Root health monitoring system</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  <span>Pathogen-free solution maintenance</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="feature-card text-center border-primary/10 hover:border-primary/30 transition-colors md:col-span-3 mt-4">
            <CardHeader className="flex flex-col items-center">
              <WifiOff className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Remote & Low-Connectivity Farms</CardTitle>
            </CardHeader>
            <CardContent className="max-w-2xl mx-auto">
              <p className="mb-4">Offline-capable pest management tools with periodic synchronization for remote farming areas.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-left">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Offline image analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>SMS-based alerts</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Low-bandwidth sync options</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Battery-optimized operation</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Manual data backup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                    <span>Field agent support system</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FarmTypesSection;
