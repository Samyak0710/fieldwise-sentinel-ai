
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// Import pages
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PestLibrary from './pages/PestLibrary';
import NotFound from './pages/NotFound';

// Import components
import { Toaster } from 'sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import NotificationSystem from './components/NotificationSystem';
import OfflineNotification from './components/OfflineNotification';
import PageTransition from './components/PageTransition';

function App() {
  return (
    <>
      {/* Global notifications and offline indicators */}
      <NotificationSystem />
      <OfflineNotification />
      <Toaster position="top-right" richColors closeButton />
      <ShadcnToaster />
      
      {/* Main app with 3D page transitions */}
      <PageTransition>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/library" element={<PestLibrary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </>
  );
}

export default App;
