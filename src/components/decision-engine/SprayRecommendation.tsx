
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, AlertTriangle } from 'lucide-react';

interface SprayRecommendationProps {
  recommendation: 'spray' | 'dont-spray';
  justification: string[];
  onRecord: () => void;
}

const SprayRecommendation: React.FC<SprayRecommendationProps> = ({
  recommendation,
  justification,
  onRecord
}) => {
  return (
    <Card className={
      recommendation === 'spray' 
        ? 'border-green-500 bg-green-50' 
        : 'border-red-500 bg-red-50'
    }>
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-4">
          {recommendation === 'spray' ? (
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-12 w-12 text-green-500" />
            </div>
          ) : (
            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
          )}
        </div>
        
        <h3 className={
          `text-center text-xl font-bold mb-4 ${
            recommendation === 'spray' ? 'text-green-700' : 'text-red-700'
          }`
        }>
          {recommendation === 'spray' 
            ? 'Spray Recommended' 
            : 'Spray Not Recommended'
          }
        </h3>
        
        <div className="space-y-2">
          <h4 className="font-medium">Justification:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {justification.map((reason, index) => (
              <li key={index} className="text-sm">{reason}</li>
            ))}
          </ul>
        </div>
        
        {recommendation === 'spray' && (
          <Button 
            className="w-full mt-4 bg-green-600 hover:bg-green-700"
            onClick={onRecord}
          >
            Record Spray Application
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SprayRecommendation;
