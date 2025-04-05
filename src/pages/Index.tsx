
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import PestDetection from '@/components/PestDetection';
import FieldMap from '@/components/FieldMap';
import TreatmentHistory from '@/components/TreatmentHistory';
import EnvironmentalSensors from '@/components/EnvironmentalSensors';
import TreatmentGuide from '@/components/TreatmentGuide';
import FarmerChatbot from '@/components/FarmerChatbot';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">
          FieldWise Sentinel - Intelligent Pest Management
        </h1>
        <Dashboard />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnvironmentalSensors />
          </div>
          <div className="lg:col-span-1">
            <FarmerChatbot />
          </div>
        </div>
        <PestDetection />
        <TreatmentGuide />
        <FieldMap />
        <TreatmentHistory />
      </main>
      <footer className="border-t py-4 bg-card/60 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground">
          FieldWise Sentinel AI - Intelligent Pest Management System
        </div>
      </footer>
    </div>
  );
};

export default Index;
