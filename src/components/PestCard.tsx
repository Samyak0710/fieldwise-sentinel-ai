
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pest } from '@/utils/mockData';

interface PestCardProps {
  pest: Pest;
  detectionCount: number;
  onClick?: () => void;
}

const PestCard: React.FC<PestCardProps> = ({ pest, detectionCount, onClick }) => {
  const getThreatColor = (threat: 'low' | 'medium' | 'high') => {
    switch (threat) {
      case 'low': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'medium': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  return (
    <Card className="fieldwise-card cursor-pointer" onClick={onClick}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{pest.name}</CardTitle>
          <Badge className={getThreatColor(pest.threat)}>
            {pest.threat.charAt(0).toUpperCase() + pest.threat.slice(1)} Threat
          </Badge>
        </div>
        <p className="text-xs italic text-muted-foreground">{pest.scientificName}</p>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded bg-muted flex-shrink-0 flex items-center justify-center">
            <img src={pest.imageUrl} alt={pest.name} className="w-12 h-12" />
          </div>
          <div className="flex-1">
            <p className="text-sm line-clamp-2 mb-2">{pest.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Affects: {pest.affectedCrops.slice(0, 2).join(', ')}
                {pest.affectedCrops.length > 2 ? '...' : ''}
              </span>
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                {detectionCount} {detectionCount === 1 ? 'detection' : 'detections'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PestCard;
