
import React from 'react';
import { X, AlertTriangle, Bug, Droplets, Calendar, CheckCircle, Clock } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Pest, Detection, Treatment } from '@/utils/mockData';

interface PestDetailsModalProps {
  pest: Pest;
  detections: Detection[];
  treatments: Treatment[];
  isOpen: boolean;
  onClose: () => void;
}

const PestDetailsModal: React.FC<PestDetailsModalProps> = ({ 
  pest, 
  detections, 
  treatments, 
  isOpen, 
  onClose 
}) => {
  const getThreatColor = (threat: 'low' | 'medium' | 'high') => {
    switch (threat) {
      case 'low': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'medium': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                {pest.name}
                <Badge className={getThreatColor(pest.threat)}>
                  {pest.threat.charAt(0).toUpperCase() + pest.threat.slice(1)} Threat
                </Badge>
              </DialogTitle>
              <DialogDescription className="italic">
                {pest.scientificName}
              </DialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-muted rounded-md flex items-center justify-center p-4 h-48">
            <img 
              src={pest.imageUrl} 
              alt={pest.name} 
              className="max-h-full max-w-full object-contain" 
            />
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground mb-4">
              {pest.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Affected Crops</h4>
                <div className="flex flex-wrap gap-1">
                  {pest.affectedCrops.map(crop => (
                    <Badge key={crop} variant="outline">
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Recent Detections</h4>
                <p className="text-sm">
                  <span className="font-bold text-lg">{detections.length}</span> detections in the last 30 days
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="treatments">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="treatments" className="flex items-center gap-1">
              <Droplets className="h-4 w-4" />
              <span>Recommended Treatments</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Detection & Treatment History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="treatments" className="space-y-4">
            <h3 className="text-lg font-medium">Recommended Treatment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pest.recommendedTreatments.map((treatment, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Droplets className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{treatment}</h4>
                        <p className="text-sm text-muted-foreground">
                          Apply as needed based on infestation level
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="space-y-6">
              {/* Detection History */}
              <div>
                <h3 className="text-lg font-medium mb-4">Detection History</h3>
                {detections.length > 0 ? (
                  <div className="space-y-3">
                    {detections.map(detection => (
                      <Card key={detection.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Bug className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <h4 className="font-medium">
                                  Detected with {(detection.confidence * 100).toFixed(0)}% confidence
                                </h4>
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(detection.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Location: {detection.location.fieldId}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No detection history available</p>
                )}
              </div>
              
              {/* Treatment History */}
              <div>
                <h3 className="text-lg font-medium mb-4">Treatment History</h3>
                {treatments.length > 0 ? (
                  <div className="space-y-3">
                    {treatments.map(treatment => (
                      <Card key={treatment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {treatment.status === 'completed' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : treatment.status === 'scheduled' ? (
                                <Clock className="h-4 w-4 text-amber-500" />
                              ) : (
                                <X className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <h4 className="font-medium">{treatment.method}</h4>
                                <Badge variant={treatment.status === 'completed' ? 'default' : 
                                  treatment.status === 'scheduled' ? 'outline' : 'destructive'}>
                                  {treatment.status.charAt(0).toUpperCase() + treatment.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Date: {treatment.dateApplied} • Field: {treatment.fieldId}
                              </p>
                              {treatment.notes && (
                                <p className="text-sm mt-2">
                                  Notes: {treatment.notes}
                                </p>
                              )}
                              {treatment.effectivenessRating && (
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Effectiveness:</span>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <div 
                                        key={i}
                                        className={`w-4 h-1.5 rounded-full ${
                                          i < treatment.effectivenessRating! 
                                            ? 'bg-primary' 
                                            : 'bg-muted-foreground/20'
                                        }`}
                                      ></div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No treatment history available</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PestDetailsModal;
