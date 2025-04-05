
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    // In a real app, this would include storing authentication token
    navigate('/');
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default Login;
