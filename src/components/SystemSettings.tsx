
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Bell, Bug, User, Shield, Database } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ThresholdSettings {
  aphids: number;
  whiteflies: number;
  bollworms: number;
}

interface NotificationSettings {
  emailAlerts: boolean;
  smsAlerts: boolean;
  pushNotifications: boolean;
  dailyReports: boolean;
  alertThreshold: 'low' | 'medium' | 'high';
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  farmName: string;
  farmLocation: string;
}

const SystemSettings: React.FC = () => {
  const [thresholds, setThresholds] = useState<ThresholdSettings>({
    aphids: 10,
    whiteflies: 15,
    bollworms: 5
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    dailyReports: true,
    alertThreshold: 'medium'
  });
  
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Farmer',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    farmName: 'Green Valley Farm',
    farmLocation: 'California, USA'
  });
  
  const [activeTab, setActiveTab] = useState('thresholds');
  const { toast } = useToast();
  
  // Load settings from localStorage
  useEffect(() => {
    const savedThresholds = localStorage.getItem('pestThresholds');
    const savedNotifications = localStorage.getItem('notificationSettings');
    const savedProfile = localStorage.getItem('userProfile');
    
    if (savedThresholds) {
      setThresholds(JSON.parse(savedThresholds));
    }
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('pestThresholds', JSON.stringify(thresholds));
  }, [thresholds]);
  
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
  }, [notifications]);
  
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);
  
  const handleSliderChange = (pest: keyof ThresholdSettings, value: number[]) => {
    setThresholds({
      ...thresholds,
      [pest]: value[0]
    });
  };
  
  const handleSwitchChange = (setting: keyof NotificationSettings, checked: boolean) => {
    setNotifications({
      ...notifications,
      [setting]: checked
    });
  };
  
  const handleAlertThresholdChange = (value: 'low' | 'medium' | 'high') => {
    setNotifications({
      ...notifications,
      alertThreshold: value
    });
  };
  
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated",
    });
  };
  
  const handleResetDefaults = () => {
    setThresholds({
      aphids: 10,
      whiteflies: 15,
      bollworms: 5
    });
    
    setNotifications({
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      dailyReports: true,
      alertThreshold: 'medium'
    });
    
    toast({
      title: "Settings Reset",
      description: "Default configuration has been restored",
    });
  };
  
  const clearAllData = () => {
    // Show a confirmation dialog before proceeding
    if (window.confirm('Are you sure you want to clear all application data? This action cannot be undone.')) {
      // Clear all localStorage items except user authentication
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      localStorage.clear();
      localStorage.setItem('isAuthenticated', isAuthenticated || 'true');
      
      // Reset states to defaults
      setThresholds({
        aphids: 10,
        whiteflies: 15,
        bollworms: 5
      });
      
      setNotifications({
        emailAlerts: true,
        smsAlerts: false,
        pushNotifications: true,
        dailyReports: true,
        alertThreshold: 'medium'
      });
      
      toast({
        title: "Data Cleared",
        description: "All application data has been reset",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div id="settings" className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            System Settings
          </CardTitle>
          <CardDescription>
            Configure pest detection thresholds, notifications, and user profile
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="thresholds" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="thresholds">
                <Bug className="h-4 w-4 mr-2" />
                Pest Thresholds
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                User Profile
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Shield className="h-4 w-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="thresholds" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Pest Detection Thresholds</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Set the thresholds at which the system will trigger alerts and recommendations.
                    Higher thresholds mean fewer alerts but may delay treatment.
                  </p>
                  
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Aphids (per leaf)</Label>
                        <span className="font-medium">{thresholds.aphids}</span>
                      </div>
                      <Slider
                        value={[thresholds.aphids]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(value) => handleSliderChange('aphids', value)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low Threshold</span>
                        <span>High Threshold</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Whiteflies (per plant)</Label>
                        <span className="font-medium">{thresholds.whiteflies}</span>
                      </div>
                      <Slider
                        value={[thresholds.whiteflies]}
                        min={1}
                        max={50}
                        step={1}
                        onValueChange={(value) => handleSliderChange('whiteflies', value)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low Threshold</span>
                        <span>High Threshold</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Bollworms (per acre)</Label>
                        <span className="font-medium">{thresholds.bollworms}</span>
                      </div>
                      <Slider
                        value={[thresholds.bollworms]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={(value) => handleSliderChange('bollworms', value)}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low Threshold</span>
                        <span>High Threshold</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleResetDefaults}>
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure how and when you receive alerts about pest detections and system status.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-alerts" className="font-medium">Email Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-alerts"
                        checked={notifications.emailAlerts}
                        onCheckedChange={(checked) => handleSwitchChange('emailAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sms-alerts" className="font-medium">SMS Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via text message
                        </p>
                      </div>
                      <Switch
                        id="sms-alerts"
                        checked={notifications.smsAlerts}
                        onCheckedChange={(checked) => handleSwitchChange('smsAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in-app and on mobile
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('pushNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="daily-reports" className="font-medium">Daily Summary Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive daily reports of pest activity
                        </p>
                      </div>
                      <Switch
                        id="daily-reports"
                        checked={notifications.dailyReports}
                        onCheckedChange={(checked) => handleSwitchChange('dailyReports', checked)}
                      />
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Label className="font-medium mb-2 block">Alert Threshold</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose when to receive alerts based on pest detection severity
                      </p>
                      
                      <div className="flex gap-4">
                        <Button
                          variant={notifications.alertThreshold === 'low' ? 'default' : 'outline'}
                          onClick={() => handleAlertThresholdChange('low')}
                          className="flex-1"
                        >
                          Low
                        </Button>
                        <Button
                          variant={notifications.alertThreshold === 'medium' ? 'default' : 'outline'}
                          onClick={() => handleAlertThresholdChange('medium')}
                          className="flex-1"
                        >
                          Medium
                        </Button>
                        <Button
                          variant={notifications.alertThreshold === 'high' ? 'default' : 'outline'}
                          onClick={() => handleAlertThresholdChange('high')}
                          className="flex-1"
                        >
                          High
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleResetDefaults}>
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">User Profile</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Manage your personal information and farm details
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="farm-name">Farm Name</Label>
                      <Input
                        id="farm-name"
                        value={profile.farmName}
                        onChange={(e) => handleProfileChange('farmName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="farm-location">Farm Location</Label>
                      <Input
                        id="farm-location"
                        value={profile.farmLocation}
                        onChange={(e) => handleProfileChange('farmLocation', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleResetDefaults}>
                    Reset to Defaults
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Configure system behavior, data management, and integrations
                  </p>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="font-medium">Data Management</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-dashed">
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <h5 className="font-medium">Export All Data</h5>
                              <p className="text-sm text-muted-foreground">
                                Download all pest detection and spray history
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Database className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-dashed">
                          <CardContent className="p-4 flex justify-between items-center">
                            <div>
                              <h5 className="font-medium">Backup Configuration</h5>
                              <p className="text-sm text-muted-foreground">
                                Save your system settings
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Backup
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">System Maintenance</h4>
                      
                      <Card className="border-dashed border-destructive/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-destructive">Reset Application Data</h5>
                              <p className="text-sm text-muted-foreground">
                                Clear all detection history, zones, and settings
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={clearAllData}
                            >
                              Reset
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Warning: This action cannot be undone. All data will be permanently deleted.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
