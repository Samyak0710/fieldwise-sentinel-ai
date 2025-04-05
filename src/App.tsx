
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import NotificationSystem from "./components/NotificationSystem";

const queryClient = new QueryClient();

const App = () => {
  // Simulate authentication state - in a real app, this would check for a valid token
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" expand={true} closeButton richColors />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
