
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(true);
  
  const handleLogin = () => {
    // Show success notification
    toast.success('Successfully logged in!', {
      description: 'Welcome back to FieldWise Sentinel'
    });
    
    // In a real app, this would include storing authentication token
    navigate('/');
  };
  
  const handleSignup = () => {
    // Show success notification
    toast.success('Account created successfully!', {
      description: 'Welcome to FieldWise Sentinel'
    });
    
    // Navigate to home page after successful signup
    navigate('/');
  };
  
  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      {showLogin ? (
        <LoginForm onLogin={handleLogin} onToggleForm={toggleForm} />
      ) : (
        <SignupForm onSignup={handleSignup} onToggleForm={toggleForm} />
      )}
    </>
  );
};

export default Login;
