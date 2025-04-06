
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, Upload, Bug, AlertTriangle, Check, RefreshCw, Filter
} from 'lucide-react';
import { pestDetectionService, PestDetection } from '@/services/pestDetectionService';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WebSocketEvent } from '@/services/webSocketService';
import { useToast } from '@/hooks/use-toast';

const RealtimePestDetection: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<PestDetection[]>([]);
  const [selectedZone, setSelectedZone] = useState('greenhouse-1');
  const { subscribe, isConnected, isSimulated } = useWebSocket();
  const { toast } = useToast();
  
  // Load initial detections and set up WebSocket subscription
  useEffect(() => {
    const loadDetections = async () => {
      try {
        // Get detections for the selected zone
        const zoneDetections = await pestDetectionService.getDetectionsByLocation(selectedZone);
        setDetections(zoneDetections);
      } catch (error) {
        console.error('Failed to load pest detections:', error);
        
        // Try to load from localStorage
        try {
          const savedDetections = JSON.parse(localStorage.getItem('pestDetections') || '[]');
          const zoneDetections = savedDetections.filter((d: any) => d.location === selectedZone);
          setDetections(zoneDetections);
        } catch (e) {
          console.error('Failed to parse saved pest detections:', e);
        }
      }
    };
    
    loadDetections();
    
    // Subscribe to real-time pest detections
    const unsubscribe = subscribe(WebSocketEvent.PEST_DETECTION, (detection: PestDetection) => {
      // Only add the detection if it's for the selected zone
      if (detection.location === selectedZone) {
        setDetections(prev => [detection, ...prev]);
        
        // Show a toast notification
        toast({
          title: `${detection.pestType} Detected`,
          description: `${detection.count} ${detection.pestType}(s) detected in ${detection.location} with ${Math.round(detection.confidence * 100)}% confidence`,
          variant: detection.count > 5 ? 'destructive' : 'default'
        });
        
        // Save to localStorage
        pestDetectionService.saveDetectionsToLocalStorage([detection]);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [subscribe, selectedZone, toast]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleCameraCapture = () => {
    // In a real app, this would access the camera API
    // For this prototype, we'll just open the file picker
    document.getElementById('image-upload')?.click();
  };
  
  const analyzeImage = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    try {
      // Upload the image for analysis
      const result = await pestDetectionService.detectPests(selectedFile, selectedZone);
      
      // Add the new detections to the list
      if (result.detections.length > 0) {
        setDetections(prev => [...result.detections, ...prev]);
        
        // Save to localStorage
        pestDetectionService.saveDetectionsToLocalStorage(result.detections);
        
        toast({
          title: 'Pest Detection Complete',
          description: `Detected ${result.detections.length} pests in the image`,
        });
      } else {
        toast({
          title: 'No Pests Detected',
          description: 'The image analysis found no pests',
        });
      }
    } catch (error) {
      console.error('Failed to analyze image:', error);
      toast({
        title: 'Analysis Failed',
        description: 'There was an error analyzing the image',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetDetection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  
  // List of zones for selection
  const zones = [
    { id: 'greenhouse-1', name: 'Greenhouse 1' },
    { id: 'greenhouse-2', name: 'Greenhouse 2' },
    { id: 'north-field', name: 'North Field' },
    { id: 'south-field', name: 'South Field' },
  ];
  
  // Group detections by pest type
  const pestCounts = detections.reduce((acc, detection) => {
    acc[detection.pestType] = (acc[detection.pestType] || 0) + detection.count;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div id="pest-detection">
      <Card>
        <CardHeader className="bg-primary/5">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bug className="h-5 w-5 text-primary" />
                Pest Detection
              </CardTitle>
              <CardDescription>
                AI-powered pest identification
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              {isSimulated && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">Simulated</span>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Zone</label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input"
                >
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
              
              {!previewUrl ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-32 flex flex-col gap-2"
                    variant="outline"
                    onClick={handleCameraCapture}
                  >
                    <Camera className="h-6 w-6" />
                    <span>Capture Image</span>
                    <input 
                      id="image-upload"
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </Button>
                  <Button 
                    className="h-32 flex flex-col gap-2"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <Upload className="h-6 w-6" />
                    <span>Upload Image</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <img 
                      src={previewUrl} 
                      alt="Selected" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={resetDetection}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : 'Analyze Image'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Recent Detections</h3>
                <Button variant="ghost" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  <span className="text-xs">Filter</span>
                </Button>
              </div>
              
              {Object.keys(pestCounts).length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bug className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No pest detections in this zone</p>
                  <p className="text-xs">Upload an image to start detection</p>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {Object.entries(pestCounts).map(([pestType, count]) => (
                      <Card key={pestType} className="bg-primary/5">
                        <CardContent className="p-3 flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium capitalize">{pestType}</p>
                            <p className="text-xs text-muted-foreground">Total detected</p>
                          </div>
                          <div className="text-xl font-bold">{count}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="space-y-2 h-40 overflow-y-auto pr-2">
                    {detections.slice(0, 10).map((detection, index) => (
                      <div key={index} className="p-2 border rounded-md text-sm flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${
                            detection.count > 10 ? 'text-red-500' : 
                            detection.count > 5 ? 'text-amber-500' : 
                            'text-green-500'
                          }`} />
                          <div>
                            <p className="font-medium capitalize">{detection.pestType}</p>
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
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{detection.count}</span>
                          <span className="text-xs bg-primary/10 rounded-full px-2 py-0.5">
                            {Math.round(detection.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {detections.length > 0 && (
                <Button variant="outline" size="sm" className="w-full text-xs">
                  View All Detections
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimePestDetection;
