
import React from 'react';
import { Greenhouse, Palmtree, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FarmTypesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Solutions for Every Farm Type</h2>
          <p className="section-description">
            No matter what type of farming operation you run, PestVision has a solution designed for your specific needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="feature-card text-center">
            <CardHeader className="flex flex-col items-center">
              <Greenhouse className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Greenhouse Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Specialized sensors and climate-specific pest modeling for controlled environment agriculture.</p>
            </CardContent>
          </Card>
          
          <Card className="feature-card text-center">
            <CardHeader className="flex flex-col items-center">
              <Palmtree className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Open Field Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Drone-based surveillance and weather-adaptive pest prediction for large acreage operations.</p>
            </CardContent>
          </Card>
          
          <Card className="feature-card text-center">
            <CardHeader className="flex flex-col items-center">
              <WifiOff className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Farmers with Limited Connectivity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Offline-capable pest management tools with periodic synchronization for remote farming areas.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FarmTypesSection;
