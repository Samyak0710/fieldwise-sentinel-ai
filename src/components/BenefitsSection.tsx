
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, TrendingUp, Wifi } from "lucide-react";

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-secondary/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Unlock the Full Potential of Your Farm with PestVision's Benefits</h2>
          <p className="section-description">
            PestVision offers a real-time insect detection and management solution that enhances your crop yields while reducing costs and environmental impact.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="feature-card">
            <CardHeader>
              <Heart className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Health</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Protect your crops from pest damage with early detection that enables timely interventions.</p>
            </CardContent>
          </Card>
          
          <Card className="feature-card">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Yield</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Increase crop yields by up to 20% with preventive pest management and optimized resource application.</p>
            </CardContent>
          </Card>
          
          <Card className="feature-card">
            <CardHeader>
              <Wifi className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Connectivity</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Works in remote farm areas with limited internet connectivity through our offline-capable system.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
