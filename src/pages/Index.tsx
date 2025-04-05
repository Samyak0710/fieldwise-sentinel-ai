
import React from 'react';
import NewHeader from '@/components/NewHeader';
import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import StatsSection from '@/components/StatsSection';
import BenefitsSection from '@/components/BenefitsSection';
import FarmTypesSection from '@/components/FarmTypesSection';
import NewFooter from '@/components/NewFooter';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NewHeader />
      
      <main className="flex-1">
        <Hero 
          backgroundImage="/lovable-uploads/7dad43a8-762b-4fcf-8ef2-8031147cc7eb.png"
          title="Smarter Pest Control"
          subtitle="with PestVision"
          description="PestVision offers an intelligent pest management system using AI and computer vision to enhance crop health and productivity while reducing chemical use and costs, saving you time and resources."
        />
        
        <FeaturesSection />
        
        <BenefitsSection />
        
        <StatsSection />
        
        <div className="py-16 px-4 bg-secondary/50">
          <div className="container mx-auto text-center">
            <h2 className="section-title">Key Features of the PestVision Intelligent Pest Management System</h2>
            <p className="section-description mb-8">
              PestVision offers a suite of features designed to give you real-time pest management capabilities with health and environmental benefits.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">AI-Driven</h3>
                <p>
                  Our machine learning algorithms continuously improve detection accuracy by learning from new data inputs and farmer feedback.
                </p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Offline Mode</h3>
                <p>
                  Continue monitoring and receiving recommendations even in areas with limited internet connectivity.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <FarmTypesSection />
        
        <div className="py-16 px-4 bg-primary text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Pest Management Approach?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join thousands of farmers who are already benefiting from PestVision's innovative technology.
            </p>
            <button className="bg-white text-primary font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors">
              Get Started Today
            </button>
          </div>
        </div>
      </main>
      
      <NewFooter />
    </div>
  );
};

export default Index;
