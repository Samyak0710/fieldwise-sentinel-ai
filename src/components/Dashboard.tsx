
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PestCard from './PestCard';
import VoiceCommand from './VoiceCommand';
import { Bug, Clock, Zap, ArrowRight, BarChart, Wifi, Database, PieChart } from 'lucide-react';
import { pests, getDetectionsByPestId } from '@/utils/mockData';

const Dashboard: React.FC = () => {
  return (
    <div id="dashboard" className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="fieldwise-card">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Detections</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">42</div>
              <Bug className="h-8 w-8 text-fieldwise-green" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last 7 days: <span className="text-green-600">+12%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="fieldwise-card">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Treatment</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-end justify-between">
              <div className="font-bold">April 6th</div>
              <Clock className="h-8 w-8 text-fieldwise-earth" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Predatory mites in East Greenhouse
            </p>
          </CardContent>
        </Card>
        
        <Card className="fieldwise-card">
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-end justify-between">
              <div className="font-bold text-green-600">Operational</div>
              <Zap className="h-8 w-8 text-fieldwise-sky" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Battery: 78% · Storage: 34% used
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pests section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Bug className="h-5 w-5 text-fieldwise-green" />
              Recent Pest Activity
            </h2>
            <a href="#" className="text-sm text-primary flex items-center">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pests.map(pest => (
              <PestCard 
                key={pest.id} 
                pest={pest} 
                detectionCount={getDetectionsByPestId(pest.id).length}
              />
            ))}
          </div>
          
          {/* Data visualization */}
          <Card className="fieldwise-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Detection Analytics
              </CardTitle>
              <CardDescription>
                Pest detection trends over time
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                <div className="text-center space-y-2">
                  <PieChart className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Detection analytics visualization
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (Simulated for prototype)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right sidebar */}
        <div className="space-y-6">
          <VoiceCommand />
          
          <Card className="fieldwise-card">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Wifi className="h-5 w-5 text-primary" />
                Offline Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Database className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Local Storage</p>
                  <p className="text-muted-foreground">All detection data stored securely on device</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Bug className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Offline Detection</p>
                  <p className="text-muted-foreground">AI models run locally without internet</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Auto-Sync</p>
                  <p className="text-muted-foreground">Seamlessly syncs data when connection returns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
