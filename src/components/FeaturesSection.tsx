
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="/lovable-uploads/a71cde7c-e0f1-49f0-9333-abb6970835c0.png" 
              alt="Farmer using PestVision" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          
          <div>
            <h2 className="section-title">AI-Powered Pest Detection and Management</h2>
            <p className="text-lg mb-8">
              PestVision uses state-of-the-art AI technology to detect pests in your crops with incredible accuracy. Our system can identify threats before they cause damage and suggest appropriate actions.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg">Daily AI analysis using drone imagery</h3>
                  <p className="text-muted-foreground">Get comprehensive aerial views of your fields</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg">93% accuracy in pest detection</h3>
                  <p className="text-muted-foreground">More accurate than traditional scouting methods</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg">Receive instant feedback and recommended actions</h3>
                  <p className="text-muted-foreground">Take action quickly to prevent crop damage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
