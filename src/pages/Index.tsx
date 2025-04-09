
import { NewHeader } from "@/components/NewHeader";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FarmTypesSection from "@/components/FarmTypesSection";
import SystemComponentsSection from "@/components/SystemComponentsSection";
import WorkflowSimulation from "@/components/WorkflowSimulation";
import BenefitsSection from "@/components/BenefitsSection";
import VoiceCommandInterface from "@/components/VoiceCommandInterface";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BugOff, AreaChart, Leaf, Wifi, Bot, Satellite, Droplets, Zap } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-white">
      <NewHeader />
      
      {/* Hero Section */}
      <Hero
        backgroundImage="/placeholder.svg"
        title="AI-Driven Precision Pest Management"
        subtitle="Smart Detection & Decision Support"
        description="Reduce pesticide usage by 60% while maintaining optimal crop health through intelligent pest detection and precise treatment recommendations."
      />
      
      {/* Features Overview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Pest Management</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our system combines cutting-edge AI detection with environmental monitoring to provide smart, timely recommendations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BugOff className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Pest Detection</h3>
            <p className="text-muted-foreground mb-4">
              YOLOv8-powered real-time detection of aphids, whiteflies, and bollworms with high accuracy.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Image-based pest identification</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Density mapping and hotspot detection</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Historical trend analysis</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <AreaChart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Environmental Monitoring</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive sensor array for optimal treatment timing based on environmental conditions.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Temperature, humidity, and CO₂ tracking</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Weather forecast integration</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Spray condition recommendations</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Smart Decision Engine</h3>
            <p className="text-muted-foreground mb-4">
              Data-driven recommendations for when, where, and how to treat pest issues effectively.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Threshold-based spray recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Treatment history tracking</span>
              </li>
              <li className="flex items-start">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>Resistance management protocols</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/dashboard">
            <Button size="lg" className="px-8">
              Explore the Dashboard
            </Button>
          </Link>
        </div>
      </section>
      
      {/* System Components Section */}
      <SystemComponentsSection />
      
      {/* Workflow Simulation Section */}
      <WorkflowSimulation />
      
      {/* Voice Command Interface Section */}
      <section id="voice-command" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Voice Command Interface</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Control the system hands-free with natural language commands, perfect for field operations.
            </p>
          </div>
          
          <VoiceCommandInterface />
          
          <div className="mt-12 max-w-4xl mx-auto bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Sample Voice Commands</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium mb-2 flex items-center">
                  <Mic className="h-4 w-4 mr-2 text-primary" />
                  Check Zone Commands
                </p>
                <ul className="space-y-2 text-sm">
                  <li>"Check zone 3"</li>
                  <li>"Show pest status in greenhouse"</li>
                  <li>"What's the pest situation in north field?"</li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-medium mb-2 flex items-center">
                  <Droplets className="h-4 w-4 mr-2 text-primary" />
                  Treatment Commands
                </p>
                <ul className="space-y-2 text-sm">
                  <li>"Should I spray today?"</li>
                  <li>"When was the last treatment?"</li>
                  <li>"Record pest sighting in zone 2"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Advanced Technology Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powered by Advanced Technology</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our system combines multiple technologies to deliver a comprehensive solution for modern agriculture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Offline Capability</h3>
              <p className="text-muted-foreground">
                Full functionality maintained even without internet connection, crucial for remote farming areas.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Voice Interface</h3>
              <p className="text-muted-foreground">
                Hands-free operation through natural language voice commands for field usage.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Satellite className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Zone Mapping</h3>
              <p className="text-muted-foreground">
                Field zone management with location-specific pest monitoring and recommendations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Droplets className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Spray Optimization</h3>
              <p className="text-muted-foreground">
                Precision recommendations that reduce chemical usage by up to 60% while maintaining efficacy.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits & Future Enhancements Section */}
      <BenefitsSection />
      
      {/* Farm Types Section */}
      <FarmTypesSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center">
          <Zap className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Pest Management?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
            Join the future of smart agriculture with our intelligent pest management system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 text-primary">
                Try the Demo
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 text-white border-white hover:bg-white/10"
              onClick={() => setShowDownloadModal(true)}
            >
              Download PDF Summary
            </Button>
          </div>
        </div>
      </section>
      
      {/* Download PDF Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Download System Summary</h3>
            <p className="text-muted-foreground mb-6">
              Please enter your email to receive our detailed PDF summary of the AI Vision Pest Management System.
            </p>
            <div className="space-y-4">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full px-4 py-2 border rounded-md"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDownloadModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    setShowDownloadModal(false);
                    window.open('/dummy-pest-management-summary.pdf');
                    toast.success('Summary PDF sent to your email', {
                      description: 'Check your inbox for the detailed system specification.'
                    });
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
