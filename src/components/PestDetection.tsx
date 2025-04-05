
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, Upload, Bug, AlertTriangle, Check, RefreshCw
} from 'lucide-react';
import { 
  pests, detections, getPestById, Detection
} from '@/utils/mockData';

const PestDetection: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<Detection | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    console.log("Camera capture requested");
    simulateImageCapture();
  };
  
  const handleFileUpload = () => {
    // In a real app, this would open a file picker
    console.log("File upload requested");
    simulateImageCapture();
  };
  
  const simulateImageCapture = () => {
    setSelectedFile('/placeholder.svg');
    setResult(null);
  };
  
  const analyzeImage = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a delay
    setTimeout(() => {
      // Randomly select one of the mock detections
      const randomDetection = detections[Math.floor(Math.random() * detections.length)];
      setResult(randomDetection);
      setIsAnalyzing(false);
    }, 2000);
  };
  
  const resetDetection = () => {
    setSelectedFile(null);
    setResult(null);
  };
  
  const getPestInfo = (pestId: string) => {
    return getPestById(pestId);
  };
  
  return (
    <div id="detection">
      <Card className="fieldwise-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bug className="h-5 w-5 text-primary" />
            Pest Detection
          </CardTitle>
          <CardDescription>
            Capture or upload an image to identify pests using our offline AI model
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {!selectedFile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="h-32 flex flex-col gap-2"
                variant="outline"
                onClick={handleCameraCapture}
              >
                <Camera className="h-6 w-6" />
                <span>Capture Image</span>
              </Button>
              <Button 
                className="h-32 flex flex-col gap-2"
                variant="outline"
                onClick={handleFileUpload}
              >
                <Upload className="h-6 w-6" />
                <span>Upload Image</span>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 aspect-video bg-muted rounded-md flex items-center justify-center">
                  <img 
                    src={selectedFile} 
                    alt="Selected" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                <div className="w-full md:w-1/2 space-y-4">
                  {isAnalyzing ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                      <p className="text-center text-sm">Analyzing image using local AI model...</p>
                    </div>
                  ) : result ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Analysis Complete</h3>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-md space-y-2">
                        <p className="font-medium">{getPestInfo(result.pestId)?.name} Detected</p>
                        <p className="text-sm text-muted-foreground">
                          Scientific Name: {getPestInfo(result.pestId)?.scientificName}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Confidence:</span>
                          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${result.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{Math.round(result.confidence * 100)}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Recommended Treatments:</h4>
                        <ul className="text-sm space-y-1">
                          {getPestInfo(result.pestId)?.recommendedTreatments.map((treatment, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-primary">•</span>
                              <span>{treatment}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="h-6 w-6 text-amber-500" />
                      <p className="text-center text-sm">Ready to analyze. Press the button below to start.</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={resetDetection}>
                  New Image
                </Button>
                {!result && !isAnalyzing && (
                  <Button onClick={analyzeImage}>
                    Analyze Image
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PestDetection;
