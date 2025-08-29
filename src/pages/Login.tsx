
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import FarmerRegistrationForm from '@/components/FarmerRegistrationForm';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentForm, setCurrentForm] = useState<'login' | 'signup' | 'register'>('login');
  
  const handleLogin = (userData: any) => {
    // Show success notification
    toast.success('Successfully logged in!', {
      description: `Welcome back, ${userData.email}!`
    });
    
    // Use auth context to login
    login(userData);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const handleSignup = (userData: any) => {
    // Show success notification
    toast.success('Account created successfully!', {
      description: 'Please complete your farmer profile'
    });
    
    // Store basic user data temporarily
    localStorage.setItem('tempUser', JSON.stringify(userData));
    
    // Move to farmer registration
    setCurrentForm('register');
  };
  
  const handleFarmerRegistration = (farmerData: any) => {
    // Combine user and farmer data
    const tempUser = JSON.parse(localStorage.getItem('tempUser') || '{}');
    const completeData = { ...tempUser, farmerData };
    
    // Show success notification
    toast.success('Registration completed successfully!', {
      description: 'Welcome to FieldWise Sentinel'
    });
    
    // Use auth context to login with complete data
    login(completeData);
    localStorage.removeItem('tempUser');
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const toggleToLogin = () => setCurrentForm('login');
  const toggleToSignup = () => setCurrentForm('signup');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentForm === 'login' && (
          <LoginForm 
            onLogin={handleLogin} 
            onToggleForm={toggleToSignup} 
          />
        )}
        {currentForm === 'signup' && (
          <SignupForm 
            onSignup={handleSignup} 
            onToggleForm={toggleToLogin} 
          />
        )}
        {currentForm === 'register' && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Complete Your Profile</h2>
              <p className="text-muted-foreground">
                Please provide your farming details to complete registration
              </p>
            </div>
            <FarmerRegistrationForm 
              onSubmit={handleFarmerRegistration}
              showTitle={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
