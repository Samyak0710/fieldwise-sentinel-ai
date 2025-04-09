
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, BugOff, ScanLine, Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";

const WorkflowSimulation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<{
    aphids: number;
    whiteflies: number;
    bollworms: number;
    threshold: number;
    shouldSpray: boolean;
    confidence: number;
  } | null>(null);
  
  const totalSteps = 4;
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if the file is an image
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Read the file and set the image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Move to the next step
      setCurrentStep(1);
    }
  };

  const handleUseSampleImage = () => {
    // Use a sample image for the demo
    setUploadedImage('/placeholder.svg');
    setCurrentStep(1);
  };
  
  const handleDetect = () => {
    if (!uploadedImage) return;
    
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Generate random detection results
      const aphids = Math.floor(Math.random() * 30);
      const whiteflies = Math.floor(Math.random() * 50);
      const bollworms = Math.floor(Math.random() * 5);
      const threshold = 25;
      const totalPests = aphids + whiteflies + bollworms;
      
      setDetectionResults({
        aphids,
        whiteflies,
        bollworms,
        threshold,
        shouldSpray: totalPests > threshold,
        confidence: 0.85 + (Math.random() * 0.1)
      });
      
      setIsProcessing(false);
      setCurrentStep(2);
      
      toast.success('Pest detection completed', {
        description: `Found ${totalPests} pests in the image.`
      });
    }, 3000);
  };
  
  const handleGetRecommendation = () => {
    if (!detectionResults) return;
    
    setCurrentStep(3);
    
    if (detectionResults.shouldSpray) {
      toast.info('Spray Recommendation', {
        description: 'Spraying is recommended based on detected pest levels and environmental conditions.',
        duration: 5000
      });
    } else {
      toast.info('Spray Recommendation', {
        description: 'Spraying is NOT recommended at this time. Pest levels are below threshold.',
        duration: 5000
      });
    }
  };
  
  const resetWorkflow = () => {
    setCurrentStep(0);
    setUploadedImage(null);
    setDetectionResults(null);
  };
  
  const steps = [
    {
      title: "Image Capture",
      description: "Upload an image or use a sample",
      icon: <Camera className="h-6 w-6" />
    },
    {
      title: "Pest Detection",
      description: "AI analyzes the image",
      icon: <ScanLine className="h-6 w-6" />
    },
    {
      title: "Pest Counting",
      description: "View detection results",
      icon: <BugOff className="h-6 w-6" />
    },
    {
      title: "Recommendation",
      description: "Get spray recommendation",
      icon: <Droplets className="h-6 w-6" />
    }
  ];
  
  return (
    <section id="workflow-simulation" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Workflow Simulation</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience how our AI Vision Pest Management System works through this interactive demo.
          </p>
        </div>
        
        <div className="mb-10">
          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 rounded-full shadow">
              <Progress value={(currentStep / (totalSteps - 1)) * 100} className="w-64 h-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div 
                key={step.title} 
                className={`text-center p-4 rounded-lg transition-all ${
                  currentStep === index 
                    ? 'bg-primary text-white scale-110 shadow-md' 
                    : currentStep > index 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                <div className="flex justify-center mb-2">
                  {step.icon}
                </div>
                <h3 className="font-medium text-sm mb-1">{step.title}</h3>
                <p className="text-xs opacity-80">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border">
          {currentStep === 0 && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Upload a Crop Image</h3>
              <p className="text-muted-foreground mb-6">
                Upload an image of your crops to detect pests, or use one of our sample images.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button className="relative overflow-hidden">
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  Upload Image
                </Button>
                <Button variant="outline" onClick={handleUseSampleImage}>
                  Use Sample Image
                </Button>
              </div>
            </div>
          )}
          
          {currentStep === 1 && uploadedImage && (
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4 text-center">Detect Pests</h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded crop" 
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Click "Detect Pests" to analyze this image using our YOLOv8-based AI model.
                  </p>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="text-center mb-6">
                    <h4 className="font-medium mb-2">Image Processing</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Our AI model will scan the image to detect and classify aphids, whiteflies, and bollworms.
                    </p>
                    
                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="animate-pulse flex items-center justify-center gap-2">
                          <ScanLine className="h-5 w-5 text-primary animate-spin" />
                          <span>Processing image...</span>
                        </div>
                        <Progress value={Math.random() * 100} className="w-full h-2" />
                      </div>
                    ) : (
                      <Button onClick={handleDetect} className="px-8">
                        <ScanLine className="h-4 w-4 mr-2" />
                        Detect Pests
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && detectionResults && (
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4 text-center">Detection Results</h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="border rounded-lg overflow-hidden mb-4 relative">
                    <img 
                      src={uploadedImage!} 
                      alt="Analyzed crop" 
                      className="w-full aspect-video object-cover"
                    />
                    
                    {/* Simulate bounding boxes */}
                    <div className="absolute top-1/3 left-1/4 w-16 h-12 border-2 border-red-500 rounded opacity-70">
                      <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-1 rounded">
                        Aphid: {(detectionResults.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 right-1/3 w-20 h-10 border-2 border-yellow-500 rounded opacity-70">
                      <div className="absolute -top-6 left-0 bg-yellow-500 text-white text-xs px-1 rounded">
                        Whitefly: {((detectionResults.confidence - 0.05) * 100).toFixed(0)}%
                      </div>
                    </div>
                    
                    {detectionResults.bollworms > 0 && (
                      <div className="absolute bottom-1/4 right-1/4 w-24 h-18 border-2 border-purple-500 rounded opacity-70">
                        <div className="absolute -top-6 left-0 bg-purple-500 text-white text-xs px-1 rounded">
                          Bollworm: {((detectionResults.confidence + 0.02) * 100).toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-medium mb-4 flex items-center">
                      <BugOff className="h-5 w-5 mr-2 text-primary" />
                      Pest Detection Summary
                    </h4>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Aphids</span>
                          <span className="font-medium">{detectionResults.aphids}</span>
                        </div>
                        <Progress value={(detectionResults.aphids / detectionResults.threshold) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Whiteflies</span>
                          <span className="font-medium">{detectionResults.whiteflies}</span>
                        </div>
                        <Progress value={(detectionResults.whiteflies / detectionResults.threshold) * 100} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Bollworms</span>
                          <span className="font-medium">{detectionResults.bollworms}</span>
                        </div>
                        <Progress value={(detectionResults.bollworms / detectionResults.threshold) * 100} className="h-2" />
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Total Pests</span>
                          <span className="font-bold">{detectionResults.aphids + detectionResults.whiteflies + detectionResults.bollworms}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Threshold Level</span>
                          <span className="font-bold">{detectionResults.threshold}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleGetRecommendation} className="w-full">
                      Get Spray Recommendation
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && detectionResults && (
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4 text-center">Spray Recommendation</h3>
              <div className="max-w-2xl mx-auto">
                <div className={`p-6 rounded-lg mb-6 ${
                  detectionResults.shouldSpray ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center mb-4">
                    {detectionResults.shouldSpray ? (
                      <>
                        <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                        <div>
                          <h4 className="font-bold text-red-700">Spray Recommended</h4>
                          <p className="text-sm text-red-600">Pest density exceeds threshold</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-8 w-8 text-green-500 mr-3" />
                        <div>
                          <h4 className="font-bold text-green-700">No Spray Needed</h4>
                          <p className="text-sm text-green-600">Pest density below threshold</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <p className="flex justify-between">
                      <span className="font-medium">Total pests detected:</span>
                      <span>{detectionResults.aphids + detectionResults.whiteflies + detectionResults.bollworms}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Treatment threshold:</span>
                      <span>{detectionResults.threshold}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-medium">Detection confidence:</span>
                      <span>{(detectionResults.confidence * 100).toFixed(1)}%</span>
                    </p>
                    
                    {detectionResults.shouldSpray && (
                      <div className="pt-3 border-t mt-3">
                        <h5 className="font-medium mb-2">Recommended Actions:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Apply eco-friendly neem oil spray at 5ml/liter concentration</li>
                          <li>Spray during early morning or late evening for best results</li>
                          <li>Focus application on underside of leaves where pests hide</li>
                          <li>Schedule follow-up detection scan in 3 days to assess efficacy</li>
                        </ul>
                      </div>
                    )}
                    
                    {!detectionResults.shouldSpray && (
                      <div className="pt-3 border-t mt-3">
                        <h5 className="font-medium mb-2">Monitoring Recommendations:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Continue regular monitoring every 3-5 days</li>
                          <li>Consider preventative measures if trending upward</li>
                          <li>Document current conditions for future reference</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="font-medium mb-3">Environmental Conditions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Temperature</div>
                      <div className="font-bold">{20 + Math.floor(Math.random() * 10)}°C</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Humidity</div>
                      <div className="font-bold">{60 + Math.floor(Math.random() * 20)}%</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Wind Speed</div>
                      <div className="font-bold">{1 + Math.floor(Math.random() * 4)} m/s</div>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <div className="text-xs text-muted-foreground mb-1">Forecast</div>
                      <div className="font-bold">Clear</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button onClick={resetWorkflow} variant="outline">
                    Start Over
                  </Button>
                  <Button onClick={() => window.location.href = '#voice-command'} variant="default">
                    Try Voice Commands
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSimulation;
