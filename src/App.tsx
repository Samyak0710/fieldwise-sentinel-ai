
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ErrorBoundaryFallback from './components/ErrorBoundaryFallback';
import PestLibrary from './pages/PestLibrary';
import FarmerProfilePage from './pages/FarmerProfile';

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pest-library" element={<PestLibrary />} />
            <Route path="/login" element={<Login />} />
            <Route path="/farmer-profile" element={<FarmerProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
