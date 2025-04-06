
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, CalendarDays, Bug, BarChart2 } from 'lucide-react';

const EnvironmentalStatus: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-primary/5">
        <CardContent className="p-4 flex flex-col items-center">
          <Bug className="h-8 w-8 text-red-500 mb-2" />
          <span className="text-xs text-muted-foreground">Pest Pressure</span>
          <span className="text-xl font-medium">Moderate</span>
        </CardContent>
      </Card>
      
      <Card className="bg-primary/5">
        <CardContent className="p-4 flex flex-col items-center">
          <Leaf className="h-8 w-8 text-green-500 mb-2" />
          <span className="text-xs text-muted-foreground">Crop Stage</span>
          <span className="text-xl font-medium">Vegetative</span>
        </CardContent>
      </Card>
      
      <Card className="bg-primary/5">
        <CardContent className="p-4 flex flex-col items-center">
          <CalendarDays className="h-8 w-8 text-blue-500 mb-2" />
          <span className="text-xs text-muted-foreground">Last Treatment</span>
          <span className="text-xl font-medium">9 days ago</span>
        </CardContent>
      </Card>
      
      <Card className="bg-primary/5">
        <CardContent className="p-4 flex flex-col items-center">
          <BarChart2 className="h-8 w-8 text-purple-500 mb-2" />
          <span className="text-xs text-muted-foreground">Efficacy</span>
          <span className="text-xl font-medium">86%</span>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalStatus;
