
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface SprayHistoryItem {
  date: Date;
  location: string;
  pestType: string;
  chemical: string;
}

interface SprayHistoryProps {
  history: SprayHistoryItem[];
}

const SprayHistory: React.FC<SprayHistoryProps> = ({ history }) => {
  const exportHistory = () => {
    const csv = [
      ['Date', 'Location', 'Pest Type', 'Chemical Used'],
      ...history.map(spray => [
        spray.date.toISOString(),
        spray.location,
        spray.pestType,
        spray.chemical
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spray_history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Spray history has been exported as CSV',
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Spray History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-4">
            No spray history recorded yet
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {history
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .map((spray, index) => (
                <div 
                  key={index} 
                  className="p-3 border rounded-md text-sm flex justify-between"
                >
                  <div>
                    <p className="font-medium">{spray.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {spray.pestType} - {spray.chemical}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{spray.date.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {spray.date.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full"
          onClick={exportHistory}
          disabled={history.length === 0}
        >
          Export History to CSV
        </Button>
      </CardContent>
    </Card>
  );
};

export default SprayHistory;
