import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import FarmerProfile from '@/components/FarmerProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const FarmerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.farmerData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">No Farmer Profile Found</h1>
          <p className="text-muted-foreground">Please complete your registration first.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Registration
          </Button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <FarmerProfile 
          farmer={user.farmerData} 
          onEdit={handleEdit}
          showSuggestions={true}
        />
      </div>
    </div>
  );
};

export default FarmerProfilePage;