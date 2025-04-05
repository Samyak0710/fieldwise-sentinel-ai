
import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-muted-foreground">Customer satisfaction based on our post-implementation surveys</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <p className="text-muted-foreground">Technologies integrated to deliver comprehensive pest management solutions</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">30+</div>
            <p className="text-muted-foreground">Partners collaborating with us to enhance agricultural innovation</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">10 years</div>
            <p className="text-muted-foreground">Serving the agricultural community with advanced pest solutions</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
