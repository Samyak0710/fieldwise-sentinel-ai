
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Fingerprint, LogOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Simulated authentication status
const AuthStatus = () => {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState('');
  
  // Simulate authentication token refresh
  const refreshToken = () => {
    toast.loading('Refreshing authentication token...', { duration: 1500 });
    
    setTimeout(() => {
      localStorage.setItem('auth_token_timestamp', new Date().toISOString());
      toast.success('Authentication token refreshed');
    }, 1500);
  };
  
  // Simulate logout
  const handleLogout = () => {
    toast.loading('Logging out...', { duration: 1000 });
    
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'false');
      toast.success('Logged out successfully');
      window.location.href = '/login';
    }, 1000);
  };
  
  // Simulate saving API key
  const saveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    toast.loading('Saving API key...', { duration: 1000 });
    
    setTimeout(() => {
      localStorage.setItem('api_key', apiKey);
      setShowApiKeyModal(false);
      toast.success('API key saved successfully');
    }, 1000);
  };
  
  return (
    <>
      <Card className="bg-background border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Fingerprint className="h-4 w-4 text-primary" />
              </div>
              
              <div className="text-sm">
                <span className="font-medium">John Farmer</span>
                <span className="text-muted-foreground text-xs block">
                  Farm Manager · API Access Enabled
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowApiKeyModal(true)}
              >
                <Key className="h-4 w-4 mr-1" />
                API Key
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshToken}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* API Key Dialog */}
      <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage API Key</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Your API Key</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="apiKey"
                  placeholder="Enter your API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This key allows authorized access to the PestVision API. Keep it secure and never share it.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowApiKeyModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveApiKey}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AuthStatus;
