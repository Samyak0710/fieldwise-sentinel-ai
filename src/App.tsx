
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import NetworkStatus from "./components/NetworkStatus";
import { ErrorBoundary } from "react-error-boundary";
import { Loader2 } from "lucide-react";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NotificationSystem = lazy(() => import("./components/NotificationSystem"));

// Fallback for suspense
const SuspenseFallback = () => (
  <div className="flex items-center justify-center h-screen w-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-lg">Loading application...</span>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
    <p className="text-gray-700 mb-4">We're sorry, but there was an error loading this part of the application.</p>
    <pre className="bg-gray-100 p-4 rounded-md text-left text-red-600 text-sm mb-4 overflow-auto max-w-full">
      {error.message}
    </pre>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
    >
      Try again
    </button>
  </div>
);

// Create a query client with optimized settings for offline use
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Use cached data while refetching
      refetchOnWindowFocus: true,
      // Make queries work offline with caching
      networkMode: 'always',
      // Add 30 minute cache time
      gcTime: 30 * 60 * 1000,
      // Use optimistic updates
      refetchOnMount: false,
      // Add error handling
      useErrorBoundary: true,
    },
    mutations: {
      // Don't retry mutations automatically
      retry: false,
      // Use optimistic updates
      networkMode: 'online',
    },
  },
});

// Register service worker for PWA functionality with error handling
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Setup periodic background sync if available
        if ('periodicSync' in registration) {
          // Request permission for background sync
          navigator.permissions.query({
            name: 'periodic-background-sync' as PermissionName,
          }).then((status) => {
            if (status.state === 'granted') {
              // Register for background sync every 24 hours
              registration.periodicSync.register('sync-data', {
                minInterval: 24 * 60 * 60 * 1000, // 24 hours
              }).catch(error => {
                console.error('Periodic background sync registration failed:', error);
              });
              
              // Register for automated backups every week
              registration.periodicSync.register('backup-data', {
                minInterval: 7 * 24 * 60 * 60 * 1000, // 7 days
              }).catch(error => {
                console.error('Periodic backup registration failed:', error);
              });
            }
          });
        }
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
  
  // Add install prompt for PWA
  let deferredPrompt: any;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Update UI to notify the user they can install the PWA
    // We'll implement this in a component later
  });
}

const App = () => {
  // Simulate authentication state - in a real app, this would check for a valid token
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);
  
  // For demo purposes, check if user is authenticated
  useEffect(() => {
    // This is just for demo - in a real app, you'd check for a valid token
    const checkAuth = () => {
      const hasAuth = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(hasAuth);
    };
    
    checkAuth();
    
    // Listen for authentication changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
  
  // For demo purposes, simulate login
  useEffect(() => {
    // This lets us bypass authentication for development
    if (import.meta.env.DEV) {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
    }
    
    // Set app as ready
    setIsAppReady(true);
    
    // Setup performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Create performance observer for Core Web Vitals
      const perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          // Log performance metrics
          console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(0)}ms`);
        });
      });
      
      // Observe paint timing
      perfObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
    }
  }, []);
  
  if (!isAppReady) {
    return <SuspenseFallback />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" expand={true} closeButton richColors />
            <BrowserRouter>
              <NetworkStatus />
              <Suspense fallback={<SuspenseFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/dashboard/*" 
                    element={
                      isAuthenticated ? 
                        <Dashboard /> : 
                        <Navigate to="/login" replace />
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
