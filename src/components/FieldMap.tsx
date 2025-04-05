
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, Bug, AlertTriangle, Leaf, Droplets, Layers, ArrowRight 
} from 'lucide-react';
import { fields, getDetectionsByFieldId, getPestById } from '@/utils/mockData';

const FieldMap: React.FC = () => {
  const [selectedField, setSelectedField] = useState(fields[0].id);

  const fieldDetections = getDetectionsByFieldId(selectedField);
  const hasDetections = fieldDetections.length > 0;
  
  return (
    <div id="map">
      <Card className="fieldwise-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Field Map
          </CardTitle>
          <CardDescription>
            View pest detection hotspots and field status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Tabs defaultValue="map" className="space-y-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="map">Field Map</TabsTrigger>
              <TabsTrigger value="list">Field List</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="space-y-4">
              {/* Map visualization (simulated) */}
              <div className="relative w-full h-80 bg-muted rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center space-y-3">
                    <Layers className="h-8 w-8 mx-auto opacity-50" />
                    <p>Interactive map visualization</p>
                    <p className="text-xs">(Simulated for prototype)</p>
                  </div>
                </div>
                
                {/* Field selection indicators */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                  {fields.map((field) => (
                    <Button 
                      key={field.id}
                      variant="outline"
                      size="sm"
                      className={`text-xs flex items-center gap-1 ${
                        field.id === selectedField ? 'bg-primary text-primary-foreground' : 'bg-background'
                      }`}
                      onClick={() => setSelectedField(field.id)}
                    >
                      <span>{field.name}</span>
                      {getDetectionsByFieldId(field.id).length > 0 && (
                        <Badge variant="outline" className="ml-1 text-[0.6rem] h-4 px-1 bg-red-500/10">
                          {getDetectionsByFieldId(field.id).length}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
                
                {/* Detection indicators - these would be positioned based on real coordinates in a real implementation */}
                {fieldDetections.map((detection, i) => (
                  <div 
                    key={detection.id}
                    className="absolute rounded-full bg-red-500 animate-pulse-subtle"
                    style={{
                      width: '12px',
                      height: '12px',
                      top: `${30 + (i * 15)}%`,
                      left: `${40 + (i * 10)}%`,
                    }}
                    title={getPestById(detection.pestId)?.name}
                  ></div>
                ))}
              </div>
              
              {/* Field info */}
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">
                    {fields.find(f => f.id === selectedField)?.name}
                  </h3>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {fields.find(f => f.id === selectedField)?.size} acres
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Leaf className="h-4 w-4 text-fieldwise-green" />
                    <span>Crop: {fields.find(f => f.id === selectedField)?.cropType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bug className="h-4 w-4 text-fieldwise-earth" />
                    <span>
                      {hasDetections 
                        ? `${fieldDetections.length} pest detections` 
                        : 'No pests detected'}
                    </span>
                  </div>
                </div>
              </div>
              
              {hasDetections && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Active Pest Alerts</h4>
                  {fieldDetections.map(detection => {
                    const pest = getPestById(detection.pestId);
                    if (!pest) return null;
                    
                    return (
                      <div key={detection.id} className="flex items-center justify-between p-2 rounded-md border">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${
                            pest.threat === 'high' ? 'text-red-500' :
                            pest.threat === 'medium' ? 'text-amber-500' : 'text-green-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{pest.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(detection.timestamp).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs h-7">
                          <span>Details</span>
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="space-y-4">
              <div className="space-y-3">
                {fields.map(field => {
                  const fieldDetections = getDetectionsByFieldId(field.id);
                  
                  return (
                    <div 
                      key={field.id}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        field.id === selectedField ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedField(field.id)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{field.name}</h3>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {field.size} acres
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Leaf className="h-4 w-4 text-fieldwise-green" />
                          <span>Crop: {field.cropType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-4 w-4 text-fieldwise-sky" />
                          <span>Last Treatment: 2 days ago</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          {fieldDetections.length > 0 ? (
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <span className="text-amber-600">
                                {fieldDetections.length} active pest detections
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-green-600">No pests detected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Add this missing component
const Check = ({ className }: { className?: string }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
};

export default FieldMap;
