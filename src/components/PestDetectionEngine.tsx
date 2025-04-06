
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Bug, AlertTriangle, Check, RefreshCw, BarChart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Detection {
  id: string;
  pestType: 'aphid' | 'whitefly' | 'bollworm';
  confidence: number;
  boundingBox: { x: number, y: number, width: number, height: number };
  timestamp: Date;
}

const mockImages = [
  '/placeholder.svg',
  '/placeholder.svg',
  '/placeholder.svg'
];

const PestDetectionEngine: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();
  
  const generateMockDetections = () => {
    const pestTypes: ('aphid' | 'whitefly' | 'bollworm')[] = ['aphid', 'whitefly', 'bollworm'];
    const numDetections = Math.floor(Math.random() * 8) + 1; // 1-8 detections
    
    const newDetections: Detection[] = [];
    
    for (let i = 0; i < numDetections; i++) {
      const pestType = pestTypes[Math.floor(Math.random() * pestTypes.length)];
      
      newDetections.push({
        id: `detection-${Date.now()}-${i}`,
        pestType,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        boundingBox: {
          x: Math.random() * 0.8, // Random position within container
          y: Math.random() * 0.8,
          width: Math.random() * 0.2 + 0.1, // Random size
          height: Math.random() * 0.2 + 0.1
        },
        timestamp: new Date()
      });
    }
    
    return newDetections;
  };
  
  const handleCameraCapture = () => {
    // In a real app, this would access the camera
    setActiveTab('camera');
    setTimeout(() => {
      const randomImageIndex = Math.floor(Math.random() * mockImages.length);
      setSelectedFile(mockImages[randomImageIndex]);
      setAnalysisComplete(false);
      setDetections([]);
    }, 500);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setSelectedFile(event.target.result);
          setAnalysisComplete(false);
          setDetections([]);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleDummyUpload = () => {
    const randomImageIndex = Math.floor(Math.random() * mockImages.length);
    setSelectedFile(mockImages[randomImageIndex]);
    setAnalysisComplete(false);
    setDetections([]);
  };
  
  const analyzeImage = () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with a delay
    setTimeout(() => {
      const newDetections = generateMockDetections();
      setDetections(newDetections);
      
      // Store in localStorage for offline functionality
      const storedDetections = JSON.parse(localStorage.getItem('pestDetections') || '[]');
      localStorage.setItem('pestDetections', JSON.stringify([...storedDetections, ...newDetections]));
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis Complete",
        description: `Detected ${newDetections.length} pests in the image`,
      });
    }, 2500);
  };
  
  const resetDetection = () => {
    setSelectedFile(null);
    setAnalysisComplete(false);
    setDetections([]);
  };
  
  const renderBoundingBoxes = () => {
    if (!selectedFile || !analysisComplete) return null;
    
    return detections.map((detection) => (
      <div
        key={detection.id}
        className="absolute border-2 border-red-500 flex items-center justify-center"
        style={{
          left: `${detection.boundingBox.x * 100}%`,
          top: `${detection.boundingBox.y * 100}%`,
          width: `${detection.boundingBox.width * 100}%`,
          height: `${detection.boundingBox.height * 100}%`
        }}
      >
        <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
          {detection.pestType} ({Math.round(detection.confidence * 100)}%)
        </div>
      </div>
    ));
  };
  
  const getDetectionStats = () => {
    const stats = {
      aphid: 0,
      whitefly: 0,
      bollworm: 0,
      total: detections.length,
      avgConfidence: 0
    };
    
    detections.forEach(detection => {
      stats[detection.pestType]++;
      stats.avgConfidence += detection.confidence;
    });
    
    if (detections.length > 0) {
      stats.avgConfidence = stats.avgConfidence / detections.length;
    }
    
    return stats;
  };
  
  const stats = getDetectionStats();
  
  return (
    <div id="detection-engine" className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-primary" />
            AI Pest Detection Engine
          </CardTitle>
          <CardDescription>
            Upload or capture an image to detect pests using YOLOv8 model
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="upload" onClick={() => setActiveTab('upload')}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </TabsTrigger>
              <TabsTrigger value="camera" onClick={handleCameraCapture}>
                <Camera className="h-4 w-4 mr-2" />
                Use Camera
              </TabsTrigger>
              <TabsTrigger value="stats">
                <BarChart className="h-4 w-4 mr-2" />
                Detection Stats
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-0">
              {!selectedFile ? (
                <div className="border-2 border-dashed rounded-lg p-10 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="mb-2 font-medium">Click to upload an image</p>
                    <p className="text-sm text-muted-foreground">
                      or drag and drop (PNG, JPG)
                    </p>
                  </label>
                  
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={handleDummyUpload}
                  >
                    Use Sample Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative border rounded-lg overflow-hidden aspect-video bg-black flex items-center justify-center">
                    <img
                      src={selectedFile}
                      alt="Selected for analysis"
                      className="max-h-full max-w-full object-contain"
                    />
                    {renderBoundingBoxes()}
                  </div>
                  
                  <div className="flex justify-between gap-4">
                    <Button variant="outline" onClick={resetDetection}>
                      Reset
                    </Button>
                    
                    <Button 
                      onClick={analyzeImage} 
                      disabled={isAnalyzing || analysisComplete}
                      className="min-w-[150px]"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : analysisComplete ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Complete
                        </>
                      ) : (
                        'Analyze Image'
                      )}
                    </Button>
                  </div>
                  
                  {analysisComplete && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium mb-2">Detection Results</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span>Aphids</span>
                            <span className="font-medium">{stats.aphid}</span>
                          </div>
                          <Progress value={(stats.aphid / stats.total) * 100} className="h-2 bg-muted" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span>Whiteflies</span>
                            <span className="font-medium">{stats.whitefly}</span>
                          </div>
                          <Progress value={(stats.whitefly / stats.total) * 100} className="h-2 bg-muted" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span>Bollworms</span>
                            <span className="font-medium">{stats.bollworm}</span>
                          </div>
                          <Progress value={(stats.bollworm / stats.total) * 100} className="h-2 bg-muted" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Average Confidence</span>
                          <span className="font-medium">{Math.round(stats.avgConfidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="camera" className="mt-0">
              {!selectedFile ? (
                <div className="border-2 border-dashed rounded-lg p-10 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-primary" />
                  </div>
                  <p className="mb-2 font-medium">Camera Access Required</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click below to activate your camera
                  </p>
                  <Button onClick={handleCameraCapture}>
                    <Camera className="h-4 w-4 mr-2" />
                    Activate Camera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative border rounded-lg overflow-hidden aspect-video bg-black flex items-center justify-center">
                    <img
                      src={selectedFile}
                      alt="Camera capture"
                      className="max-h-full max-w-full object-contain"
                    />
                    {renderBoundingBoxes()}
                  </div>
                  
                  <div className="flex justify-between gap-4">
                    <Button variant="outline" onClick={resetDetection}>
                      Reset
                    </Button>
                    
                    <Button 
                      onClick={analyzeImage} 
                      disabled={isAnalyzing || analysisComplete}
                      className="min-w-[150px]"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : analysisComplete ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Complete
                        </>
                      ) : (
                        'Analyze Capture'
                      )}
                    </Button>
                  </div>
                  
                  {analysisComplete && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h3 className="font-medium mb-2">Detection Results</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span>Aphids</span>
                            <span className="font-medium">{stats.aphid}</span>
                          </div>
                          <Progress value={(stats.aphid / stats.total) * 100} className="h-2 bg-muted" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span>Whiteflies</span>
                            <span className="font-medium">{stats.whitefly}</span>
                          </div>
                          <Progress value={(stats.whitefly / stats.total) * 100} className="h-2 bg-muted" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span>Bollworms</span>
                            <span className="font-medium">{stats.bollworm}</span>
                          </div>
                          <Progress value={(stats.bollworm / stats.total) * 100} className="h-2 bg-muted" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Average Confidence</span>
                          <span className="font-medium">{Math.round(stats.avgConfidence * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="stats" className="mt-0">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-medium mb-4">Historical Detection Data</h3>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-4xl font-bold text-primary">43</div>
                    <div className="text-sm text-muted-foreground">Total Detections</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-4xl font-bold text-yellow-500">18</div>
                    <div className="text-sm text-muted-foreground">Aphids</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-4xl font-bold text-blue-500">15</div>
                    <div className="text-sm text-muted-foreground">Whiteflies</div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                    <div className="text-4xl font-bold text-red-500">10</div>
                    <div className="text-sm text-muted-foreground">Bollworms</div>
                  </div>
                </div>
                
                <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <BarChart className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      Detection statistics chart
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (Simulated for prototype)
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
                  <span>Data based on 20 field scans</span>
                  <Button variant="link" size="sm" className="h-auto p-0">
                    Export as CSV
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PestDetectionEngine;
