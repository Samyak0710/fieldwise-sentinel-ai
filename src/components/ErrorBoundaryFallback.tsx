
import React from 'react';
import { Button } from "@/components/ui/button";

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-700 mb-4">We're sorry, but there was an error loading this part of the application.</p>
      <pre className="bg-gray-100 p-4 rounded-md text-left text-red-600 text-sm mb-4 overflow-auto max-w-full">
        {error.message}
      </pre>
      <Button 
        onClick={resetErrorBoundary}
        variant="default"
      >
        Try again
      </Button>
    </div>
  );
};

export default ErrorBoundaryFallback;
