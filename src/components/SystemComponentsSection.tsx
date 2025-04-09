
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Thermometer, Droplets, Wind, Cpu, Mic, Cloud } from 'lucide-react';

const SystemComponentsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">System Components</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI Vision Pest Management System combines hardware and software components
            to provide comprehensive pest monitoring and management.
          </p>
        </div>
        
        <Tabs defaultValue="polyhouse" className="w-full mb-16">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="polyhouse">Polyhouse Setup</TabsTrigger>
              <TabsTrigger value="field">Open Field Setup</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="polyhouse" className="mt-0">
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Polyhouse Configuration</h3>
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-3/4 h-3/4 border-2 border-dashed border-primary/40 rounded-lg flex items-center justify-center relative">
                    <p className="text-primary font-medium">Polyhouse Area</p>
                    
                    {/* Camera positions */}
                    <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-primary p-2 rounded-full">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs mt-1">Camera 1</p>
                    </div>
                    
                    <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div className="bg-primary p-2 rounded-full">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs mt-1">Camera 2</p>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2">
                      <div className="bg-primary p-2 rounded-full">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs mt-1">Camera 3</p>
                    </div>
                    
                    <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2">
                      <div className="bg-primary p-2 rounded-full">
                        <Camera className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs mt-1">Camera 4</p>
                    </div>
                    
                    {/* Sensor position */}
                    <div className="absolute center transform">
                      <div className="bg-emerald-500 p-2 rounded-full">
                        <Thermometer className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs mt-1">Sensor Hub</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Camera className="h-4 w-4 mr-2 text-primary" />
                      Camera Coverage
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      4-camera setup provides full 360° coverage of the polyhouse environment with minimal blind spots.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Thermometer className="h-4 w-4 mr-2 text-primary" />
                      Sensor Positioning
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Centralized sensor hub for temperature, humidity, and CO₂ monitoring with wireless transmission.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-primary" />
                      Processing Unit
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Edge computing with NVIDIA Jetson Xavier processes all camera feeds for real-time pest detection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="field" className="mt-0">
            <div className="border rounded-lg p-6 bg-white shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Open Field Configuration</h3>
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-3/4 h-3/4 border-2 border-dashed border-primary/40 rounded-lg grid grid-cols-2 gap-4 p-6">
                    <div className="border border-primary/30 rounded-lg flex items-center justify-center relative">
                      <p className="text-primary/80 font-medium">Zone A</p>
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary p-2 rounded-full">
                          <Camera className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-primary/30 rounded-lg flex items-center justify-center relative">
                      <p className="text-primary/80 font-medium">Zone B</p>
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary p-2 rounded-full">
                          <Camera className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-primary/30 rounded-lg flex items-center justify-center relative">
                      <p className="text-primary/80 font-medium">Zone C</p>
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary p-2 rounded-full">
                          <Camera className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-primary/30 rounded-lg flex items-center justify-center relative">
                      <p className="text-primary/80 font-medium">Zone D</p>
                      <div className="absolute top-2 right-2">
                        <div className="bg-primary p-2 rounded-full">
                          <Camera className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Central sensor hub */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="bg-emerald-500 p-2 rounded-full">
                        <Thermometer className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs mt-1">Weather Station</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Camera className="h-4 w-4 mr-2 text-primary" />
                      Zone Coverage
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Field divided into multiple zones with dedicated cameras mounted on poles or drones for aerial monitoring.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Wind className="h-4 w-4 mr-2 text-primary" />
                      Weather Monitoring
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Advanced weather station tracks temperature, humidity, wind, and rainfall for optimal spray timing.
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Cloud className="h-4 w-4 mr-2 text-primary" />
                      Data Transmission
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Solar-powered 4G/5G connectivity ensures reliable data transmission even in remote agricultural areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI Vision Cameras</CardTitle>
              <CardDescription>High-resolution imaging</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our system uses high-definition cameras with wide-angle lenses to capture detailed images of crops for pest detection. Each camera can monitor up to 100m² of crop area.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Resolution: 4K • Frame Rate: 30fps • Night Vision: Yes</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Thermometer className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Environmental Sensors</CardTitle>
              <CardDescription>Comprehensive monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our environmental sensor array monitors temperature, humidity, CO₂ levels, and soil moisture. These readings help determine optimal spray conditions and pest activity patterns.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Sensors: Temperature, Humidity, CO₂, Soil • Accuracy: ±0.5°C, ±2% RH</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Edge Processing</CardTitle>
              <CardDescription>Real-time analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                NVIDIA Jetson Xavier NX provides powerful edge computing capabilities, running YOLOv8 models for real-time pest detection without requiring constant internet connectivity.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Processor: 384-core NVIDIA Volta GPU • RAM: 8GB • Storage: 128GB</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Voice Interface</CardTitle>
              <CardDescription>Hands-free operation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                The voice command interface allows farmers to interact with the system hands-free while working in the field. Commands include checking pest status, requesting spray recommendations, and viewing historical data.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Languages: English, Hindi • Noise Cancellation: Yes • Wake Word: Optional</p>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <Button size="lg" className="px-8" asChild>
            <a href="#workflow-simulation">See How It Works</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SystemComponentsSection;
