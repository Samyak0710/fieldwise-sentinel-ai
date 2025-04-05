
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import PestDetection from '@/components/PestDetection';
import FieldMap from '@/components/FieldMap';
import TreatmentHistory from '@/components/TreatmentHistory';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6 space-y-8">
        <Dashboard />
        <PestDetection />
        <FieldMap />
        <TreatmentHistory />
      </main>
      <footer className="border-t py-4 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          FieldWise Sentinel AI - Intelligent Pest Management System
        </div>
      </footer>
    </div>
  );
};

export default Index;
