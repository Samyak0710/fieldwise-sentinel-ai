
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Droplets, 
  Zap, 
  Leaf, 
  ShieldCheck, 
  BarChart3, 
  Calendar, 
  Sprout, 
  Languages, 
  Smartphone, 
  Timer 
} from 'lucide-react';

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Benefits & Future Enhancements</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI Vision Pest Management System delivers significant improvements in farming efficiency, 
            sustainability, and crop yields with an exciting roadmap ahead.
          </p>
        </div>
        
        <Tabs defaultValue="benefits" className="w-full mb-16">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="benefits">Current Benefits</TabsTrigger>
              <TabsTrigger value="roadmap">Future Roadmap</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="benefits" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Droplets className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">Reduced Chemical Usage</CardTitle>
                  <CardDescription>Precision pest detection enables targeted spraying</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Pesticide Reduction</span>
                      <span className="text-sm font-medium">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our system reduces chemical usage by 60% on average by only recommending spraying when 
                    pests exceed economic thresholds and targeting specific areas.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">Improved Crop Yields</CardTitle>
                  <CardDescription>Early detection prevents yield losses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Yield Increase</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Early detection and timely intervention prevent pest population explosions that 
                    damage crops, resulting in up to 25% higher yields compared to traditional methods.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">Operational Efficiency</CardTitle>
                  <CardDescription>Automates monitoring and decision-making</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Labor Efficiency</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automated monitoring reduces the need for manual scouting by 45%, freeing up 
                    labor for other farm tasks while providing more accurate and consistent observations.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">Environmental Impact</CardTitle>
                  <CardDescription>Reduced chemical runoff and emissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Environmental Benefit</span>
                      <span className="text-sm font-medium">55%</span>
                    </div>
                    <Progress value={55} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By targeting only necessary treatments, the system reduces chemical runoff into 
                    waterways and decreases the carbon footprint associated with pesticide production and application.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">Resistance Management</CardTitle>
                  <CardDescription>Reduces pest resistance development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Resistance Reduction</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Strategic application and rotation of control measures based on AI recommendations 
                    helps slow the development of pesticide resistance in target pest populations.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-4">Data-Driven Insights</CardTitle>
                  <CardDescription>Historical trends and patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Decision Accuracy</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The system accumulates historical data on pest populations, environmental conditions, 
                    and treatment efficacy, enabling increasingly accurate predictions and recommendations over time.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Field Study Results</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Recent field trials across 5 farms in India demonstrated significant improvements
                  compared to traditional pest management approaches.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pesticide Usage</span>
                      <span className="font-medium text-green-600">-60%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Treatment Cost</span>
                      <span className="font-medium text-green-600">-35%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full rounded-full" style={{width: '35%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Crop Yield</span>
                      <span className="font-medium text-emerald-600">+25%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{width: '25%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Detection Accuracy</span>
                      <span className="font-medium text-primary">92%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Farmer Testimonials</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm italic mb-2">
                      "This system has completely transformed my pest management strategy. I've cut my pesticide costs by half while seeing better crop quality."
                    </p>
                    <p className="text-xs font-medium">— Rajesh Patel, Cotton Farmer, Gujarat</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm italic mb-2">
                      "The voice commands are incredibly useful when I'm working in the field. I can check pest status and get recommendations without stopping my work."
                    </p>
                    <p className="text-xs font-medium">— Lakshmi Singh, Vegetable Grower, Maharashtra</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm italic mb-2">
                      "The real-time monitoring has helped us respond to pest issues days earlier than we used to. This early intervention has significantly improved our yield."
                    </p>
                    <p className="text-xs font-medium">— Vijay Sharma, Greenhouse Manager, Karnataka</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="roadmap" className="mt-0">
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
              
              <div className="space-y-12 relative z-10">
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-primary"></div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 ml-2">
                    <h3 className="text-xl font-bold mb-2">Q3 2024: Predictive Analytics</h3>
                    <p className="text-muted-foreground mb-4">
                      Enhanced prediction capabilities using historical data and weather forecasts.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <Sprout className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Pest Forecasting</h4>
                            <p className="text-sm text-muted-foreground">
                              Predict pest outbreaks 7-10 days in advance based on weather patterns and historical trends.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <BarChart3 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Trend Analysis</h4>
                            <p className="text-sm text-muted-foreground">
                              Advanced analytics to identify seasonal patterns and long-term pest population dynamics.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center">
                      <Languages className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-primary/80"></div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 ml-2">
                    <h3 className="text-xl font-bold mb-2">Q4 2024: Multi-language Support</h3>
                    <p className="text-muted-foreground mb-4">
                      Expanded language capabilities to reach more farmers across different regions.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <Mic className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Voice Recognition</h4>
                            <p className="text-sm text-muted-foreground">
                              Support for 10+ Indian languages including Hindi, Tamil, Telugu, Marathi, and Punjabi.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <Smartphone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">UI Translation</h4>
                            <p className="text-sm text-muted-foreground">
                              Complete interface localization with region-specific terminology for pest and crop names.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/60 flex items-center justify-center">
                      <Timer className="h-5 w-5 text-white" />
                    </div>
                    <div className="h-full w-0.5 bg-primary/60"></div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 ml-2">
                    <h3 className="text-xl font-bold mb-2">Q1 2025: Real-time Integration</h3>
                    <p className="text-muted-foreground mb-4">
                      Enhanced connectivity with farm equipment and management systems.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <Droplets className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Sprayer Integration</h4>
                            <p className="text-sm text-muted-foreground">
                              Direct communication with smart sprayers for automated, precision application of treatments.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <Zap className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Farm Management</h4>
                            <p className="text-sm text-muted-foreground">
                              API integration with popular farm management software for unified data and reporting.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-10 h-10 rounded-full bg-primary/40 flex items-center justify-center">
                      <Leaf className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border flex-1 ml-2">
                    <h3 className="text-xl font-bold mb-2">Q2 2025: Biological Control Integration</h3>
                    <p className="text-muted-foreground mb-4">
                      Advanced capabilities for managing biological pest control methods.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Beneficial Insect Tracking</h4>
                            <p className="text-sm text-muted-foreground">
                              AI detection of beneficial predators and parasitoids to monitor biological control effectiveness.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start mb-2">
                          <Sprout className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Integrated Pest Management</h4>
                            <p className="text-sm text-muted-foreground">
                              Comprehensive IPM recommendations combining chemical, biological, and cultural control methods.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 p-6 bg-primary/5 rounded-lg max-w-4xl mx-auto">
              <h3 className="text-xl font-bold mb-4">What's New in Our Latest Update</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm flex">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mic className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Enhanced Voice Command Interface</h4>
                    <p className="text-sm text-muted-foreground">
                      Improved voice recognition accuracy and expanded command vocabulary for more intuitive interaction.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Camera className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Advanced Pest Recognition</h4>
                    <p className="text-sm text-muted-foreground">
                      Added detection support for 5 new pest species and improved identification accuracy in low-light conditions.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Offline Mode Capabilities</h4>
                    <p className="text-sm text-muted-foreground">
                      Added robust offline functionality allowing the system to continue monitoring and providing recommendations without internet connectivity.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm flex">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Improved Data Visualization</h4>
                    <p className="text-sm text-muted-foreground">
                      Redesigned dashboard with enhanced charts and heat maps for more intuitive pest pressure monitoring and trend analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default BenefitsSection;
