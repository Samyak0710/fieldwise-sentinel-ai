import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Bug, AlertTriangle, Check, RefreshCw, BarChart, Volume2, VolumeX, BellRing, BellOff, Languages } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { pestCommunicationService, CommunicationPreference } from '@/services/pestCommunicationService';

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

const enhancedPestData = {
  aphid: {
    commonSigns: ['Curled leaves', 'Sticky honeydew', 'Black sooty mold'],
    preferredConditions: 'Warm, dry weather with temperatures 65-80°F',
    naturalEnemies: ['Ladybugs', 'Lacewings', 'Parasitic wasps'],
    organicControls: ['Neem oil', 'Insecticidal soap', 'Strong water spray'],
    chemicalControls: ['Imidacloprid', 'Acetamiprid', 'Pymetrozine'],
    threshold: 15,
  },
  whitefly: {
    commonSigns: ['White insects under leaves', 'Sticky honeydew', 'Yellow speckling'],
    preferredConditions: 'Warm, humid weather with temperatures 75-85°F',
    naturalEnemies: ['Encarsia formosa', 'Delphastus catalinae', 'Macrolophus pygmaeus'],
    organicControls: ['Yellow sticky traps', 'Insecticidal soap', 'Neem oil'],
    chemicalControls: ['Pyriproxyfen', 'Buprofezin', 'Spiromesifen'],
    threshold: 10,
  },
  bollworm: {
    commonSigns: ['Holes in fruits', 'Frass (waste) around entry holes', 'Eggs on leaves'],
    preferredConditions: 'Warm nights, dry conditions, temperatures 70-90°F',
    naturalEnemies: ['Trichogramma wasps', 'Predatory bugs', 'Bacillus thuringiensis (Bt)'],
    organicControls: ['Bt sprays', 'Spinosad', 'Trap crops'],
    chemicalControls: ['Chlorantraniliprole', 'Emamectin benzoate', 'Indoxacarb'],
    threshold: 5,
  }
};

const PestDetectionEngine: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [enhancedDataEnabled, setEnhancedDataEnabled] = useState(true);
  const [communicationPrefs, setCommunicationPrefs] = useState<CommunicationPreference>(
    pestCommunicationService.getPreferences()
  );
  
  useEffect(() => {
    setCommunicationPrefs(pestCommunicationService.getPreferences());
  }, []);
  
  useEffect(() => {
    pestCommunicationService.savePreferences(communicationPrefs);
  }, [communicationPrefs]);
  
  const generateEnhancedDetections = () => {
    const pestTypes: ('aphid' | 'whitefly' | 'bollworm')[] = ['aphid', 'whitefly', 'bollworm'];
    
    const primaryPestType = pestTypes[Math.floor(Math.random() * pestTypes.length)];
    const secondaryPresence = Math.random() > 0.7;
    
    const numPrimaryPests = Math.floor(Math.random() * 10) + 1;
    const numSecondaryPests = secondaryPresence ? Math.floor(Math.random() * 3) + 1 : 0;
    
    const secondaryPestType = pestTypes.filter(p => p !== primaryPestType)[
      Math.floor(Math.random() * (pestTypes.length - 1))
    ];
    
    const newDetections: Detection[] = [];
    
    for (let i = 0; i < numPrimaryPests; i++) {
      const baseX = Math.random() * 0.7;
      const baseY = Math.random() * 0.7;
      
      newDetections.push({
        id: `detection-${Date.now()}-${i}`,
        pestType: primaryPestType,
        confidence: Math.random() * 0.15 + 0.8,
        boundingBox: {
          x: baseX + (Math.random() * 0.1),
          y: baseY + (Math.random() * 0.1),
          width: Math.random() * 0.1 + 0.05,
          height: Math.random() * 0.1 + 0.05
        },
        timestamp: new Date()
      });
    }
    
    for (let i = 0; i < numSecondaryPests; i++) {
      newDetections.push({
        id: `detection-sec-${Date.now()}-${i}`,
        pestType: secondaryPestType,
        confidence: Math.random() * 0.2 + 0.7,
        boundingBox: {
          x: Math.random() * 0.8,
          y: Math.random() * 0.8,
          width: Math.random() * 0.1 + 0.05,
          height: Math.random() * 0.1 + 0.05
        },
        timestamp: new Date()
      });
    }
    
    return newDetections;
  };
  
  const generateBasicDetections = () => {
    const pestTypes: ('aphid' | 'whitefly' | 'bollworm')[] = ['aphid', 'whitefly', 'bollworm'];
    const numDetections = Math.floor(Math.random() * 8) + 1;
    
    const newDetections: Detection[] = [];
    
    for (let i = 0; i < numDetections; i++) {
      const pestType = pestTypes[Math.floor(Math.random() * pestTypes.length)];
      
      newDetections.push({
        id: `detection-${Date.now()}-${i}`,
        pestType,
        confidence: Math.random() * 0.3 + 0.7,
        boundingBox: {
          x: Math.random() * 0.8,
          y: Math.random() * 0.8,
          width: Math.random() * 0.2 + 0.1,
          height: Math.random() * 0.2 + 0.1
        },
        timestamp: new Date()
      });
    }
    
    return newDetections;
  };
  
  const handleCameraCapture = () => {
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
    
    setTimeout(() => {
      const newDetections = enhancedDataEnabled 
        ? generateEnhancedDetections() 
        : generateBasicDetections();
      
      setDetections(newDetections);
      
      const storedDetections = JSON.parse(localStorage.getItem('pestDetections') || '[]');
      localStorage.setItem('pestDetections', JSON.stringify([...storedDetections, ...newDetections]));
      
      pestCommunicationService.communicateDetectionResults(
        newDetections.map(d => ({
          id: d.id,
          timestamp: d.timestamp.toISOString(),
          pestType: d.pestType,
          confidence: d.confidence,
          location: 'current-image',
          count: 1,
          boundingBoxes: [{
            x: d.boundingBox.x,
            y: d.boundingBox.y,
            width: d.boundingBox.width,
            height: d.boundingBox.height,
            pestType: d.pestType,
            confidence: d.confidence
          }]
        }))
      );
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };
  
  const resetDetection = () => {
    setSelectedFile(null);
    setAnalysisComplete(false);
    setDetections([]);
  };
  
  const toggleVoice = () => {
    setCommunicationPrefs(prev => ({
      ...prev,
      voiceEnabled: !prev.voiceEnabled
    }));
  };
  
  const toggleNotifications = () => {
    setCommunicationPrefs(prev => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled
    }));
  };
  
  const toggleDetailedAnalysis = () => {
    setCommunicationPrefs(prev => ({
      ...prev,
      detailedAnalysis: !prev.detailedAnalysis
    }));
  };
  
  const handleLanguageChange = (value: string) => {
    setCommunicationPrefs(prev => ({
      ...prev,
      language: value as 'en' | 'es' | 'fr' | 'de'
    }));
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
  
  const getPestInfo = (pestType: 'aphid' | 'whitefly' | 'bollworm') => {
    return enhancedPestData[pestType];
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
            Upload or capture an image to detect pests using enhanced YOLOv8 model with communication features
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
              <TabsTrigger value="settings">
                <Languages className="h-4 w-4 mr-2" />
                Communication
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
                      
                      {enhancedDataEnabled && stats.total > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Enhanced Analysis</h4>
                          
                          {stats.aphid > 0 && (
                            <div className="mb-3 p-2 bg-white rounded-md">
                              <h5 className="font-medium text-sm">Aphid Information</h5>
                              <p className="text-xs mb-1">Threshold: {getPestInfo('aphid').threshold} per plant</p>
                              <p className="text-xs text-amber-600">
                                {stats.aphid > getPestInfo('aphid').threshold 
                                  ? 'Treatment recommended' 
                                  : 'Below treatment threshold'}
                              </p>
                              <p className="text-xs mt-1">Recommended controls: {getPestInfo('aphid').organicControls.join(', ')}</p>
                            </div>
                          )}
                          
                          {stats.whitefly > 0 && (
                            <div className="mb-3 p-2 bg-white rounded-md">
                              <h5 className="font-medium text-sm">Whitefly Information</h5>
                              <p className="text-xs mb-1">Threshold: {getPestInfo('whitefly').threshold} per plant</p>
                              <p className="text-xs text-amber-600">
                                {stats.whitefly > getPestInfo('whitefly').threshold
                                  ? 'Treatment recommended' 
                                  : 'Below treatment threshold'}
                              </p>
                              <p className="text-xs mt-1">Recommended controls: {getPestInfo('whitefly').organicControls.join(', ')}</p>
                            </div>
                          )}
                          
                          {stats.bollworm > 0 && (
                            <div className="mb-3 p-2 bg-white rounded-md">
                              <h5 className="font-medium text-sm">Bollworm Information</h5>
                              <p className="text-xs mb-1">Threshold: {getPestInfo('bollworm').threshold} per plant</p>
                              <p className="text-xs text-red-600">
                                {stats.bollworm > getPestInfo('bollworm').threshold
                                  ? 'Immediate treatment recommended!' 
                                  : 'Treatment recommended'}
                              </p>
                              <p className="text-xs mt-1">Recommended controls: {getPestInfo('bollworm').organicControls.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      )}
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
            
            <TabsContent value="settings" className="mt-0">
              <div className="p-4 bg-primary/5 rounded-lg space-y-4">
                <h3 className="font-medium mb-2">Communication Preferences</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure how the AI communicates detection results with you
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {communicationPrefs.voiceEnabled ? (
                          <Volume2 className="h-4 w-4 inline mr-2" />
                        ) : (
                          <VolumeX className="h-4 w-4 inline mr-2" />
                        )}
                        Voice Feedback
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Hear detection results spoken aloud
                      </p>
                    </div>
                    <Switch 
                      checked={communicationPrefs.voiceEnabled}
                      onCheckedChange={toggleVoice}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {communicationPrefs.notificationsEnabled ? (
                          <BellRing className="h-4 w-4 inline mr-2" />
                        ) : (
                          <BellOff className="h-4 w-4 inline mr-2" />
                        )}
                        Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Show toast notifications for detection results
                      </p>
                    </div>
                    <Switch
                      checked={communicationPrefs.notificationsEnabled}
                      onCheckedChange={toggleNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Detailed Analysis
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Include treatment recommendations in communications
                      </p>
                    </div>
                    <Switch
                      checked={communicationPrefs.detailedAnalysis}
                      onCheckedChange={toggleDetailedAnalysis}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-base">
                      <Languages className="h-4 w-4 inline mr-2" />
                      Language
                    </Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Select language for voice feedback and notifications
                    </p>
                    <Select 
                      value={communicationPrefs.language} 
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        Enhanced Detection Data
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Use advanced pest data and image recognition
                      </p>
                    </div>
                    <Switch
                      checked={enhancedDataEnabled}
                      onCheckedChange={setEnhancedDataEnabled}
                    />
                  </div>
                </div>
                
                <div className="mt-6 p-3 bg-primary/10 rounded-md">
                  <h4 className="font-medium text-sm mb-1">Training Status</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={85} className="h-2 flex-1" />
                    <span className="text-xs font-medium">85%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    AI model trained on 12,500+ images of 25 crop varieties and 30+ pest species.
                    Last updated: April 8, 2025
                  </p>
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Test Communication</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const message = "Test detection complete. Found 3 aphids, 2 whiteflies, and 1 bollworm.";
                        if (communicationPrefs.voiceEnabled && 'speechSynthesis' in window) {
                          const utterance = new SpeechSynthesisUtterance(message);
                          utterance.lang = communicationPrefs.language;
                          window.speechSynthesis.speak(utterance);
                        }
                        if (communicationPrefs.notificationsEnabled) {
                          toast.success('Test Notification', {
                            description: message
                          });
                        }
                      }}
                      size="sm"
                    >
                      Test Notification
                    </Button>
                  </div>
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
