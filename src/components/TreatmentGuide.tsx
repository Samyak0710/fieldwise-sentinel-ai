
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, CheckCircle, ArrowRight, RotateCw } from 'lucide-react';

const TreatmentGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const treatmentSteps = [
    {
      title: "Pest Identification",
      description: "Use AI detection to identify the specific pest affecting your crops.",
      instructions: "Upload clear images of affected plants to the Pest Detection section."
    },
    {
      title: "Environmental Assessment",
      description: "Check environmental conditions to determine optimal treatment timing.",
      instructions: "Review sensor data for temperature, humidity, and weather conditions."
    },
    {
      title: "Treatment Selection",
      description: "Choose the appropriate treatment method based on pest type and severity.",
      instructions: "Consider biological controls for low infestations, chemical for severe cases."
    },
    {
      title: "Application Planning",
      description: "Plan the application method, dosage, and target areas.",
      instructions: "Calculate required amount based on field size and infestation level."
    },
    {
      title: "Application",
      description: "Apply the treatment following safety guidelines and optimal conditions.",
      instructions: "Wear protective equipment and apply during recommended weather conditions."
    },
    {
      title: "Monitoring & Documentation",
      description: "Document the treatment and monitor effectiveness.",
      instructions: "Record application details and schedule follow-up inspections."
    }
  ];
  
  const handleNext = () => {
    if (currentStep < treatmentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleReset = () => {
    setCurrentStep(0);
  };
  
  return (
    <div id="treatment-guide">
      <Card className="fieldwise-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            Treatment Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between">
              {treatmentSteps.map((_, index) => (
                <div 
                  key={index} 
                  className={`flex-1 h-1 mx-1 rounded-full ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                ></div>
              ))}
            </div>
            <div className="mt-2 text-sm text-center text-muted-foreground">
              Step {currentStep + 1} of {treatmentSteps.length}
            </div>
          </div>
          
          {/* Current step content */}
          <div className="py-4 px-2">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center bg-primary/10 w-8 h-8 rounded-full text-primary font-bold">
                {currentStep + 1}
              </span>
              {treatmentSteps[currentStep].title}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {treatmentSteps[currentStep].description}
            </p>
            <div className="bg-muted/30 p-3 rounded-md border border-border mb-6">
              <p className="font-medium mb-1">Instructions:</p>
              <p className="text-sm">{treatmentSteps[currentStep].instructions}</p>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep === treatmentSteps.length - 1 ? (
                <Button onClick={handleReset} className="gap-2">
                  <RotateCw className="h-4 w-4" />
                  Start Over
                </Button>
              ) : (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Completion indicator */}
          {currentStep === treatmentSteps.length - 1 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">
                You've completed all steps in the treatment guide. Remember to document your treatment for future reference.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentGuide;
