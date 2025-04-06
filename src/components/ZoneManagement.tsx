
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Edit2, Trash2, Plus, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Zone {
  id: string;
  name: string;
  type: 'greenhouse' | 'field' | 'orchard' | 'nursery';
  size: number;
  unit: 'hectares' | 'acres';
  coordinates: {
    x: number;
    y: number;
  };
  color: string;
}

const defaultZones: Zone[] = [
  { 
    id: 'greenhouse-1', 
    name: 'Greenhouse 1', 
    type: 'greenhouse', 
    size: 0.5, 
    unit: 'hectares',
    coordinates: { x: 30, y: 40 },
    color: '#4ade80' 
  },
  { 
    id: 'north-field', 
    name: 'North Field', 
    type: 'field', 
    size: 2.5, 
    unit: 'hectares',
    coordinates: { x: 50, y: 20 },
    color: '#facc15' 
  },
  { 
    id: 'south-field', 
    name: 'South Field', 
    type: 'field', 
    size: 3.2, 
    unit: 'hectares',
    coordinates: { x: 55, y: 60 },
    color: '#fb923c' 
  },
  { 
    id: 'apple-orchard', 
    name: 'Apple Orchard', 
    type: 'orchard', 
    size: 1.8, 
    unit: 'hectares',
    coordinates: { x: 80, y: 35 },
    color: '#ef4444' 
  }
];

const ZoneManagement: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [editZone, setEditZone] = useState<Zone | null>(null);
  const [activeTab, setActiveTab] = useState<string>('map');
  const [isLoading, setIsLoading] = useState(false);
  const [mapData, setMapData] = useState<any>(null);
  const { toast } = useToast();
  
  // Load zones from localStorage
  useEffect(() => {
    const savedZones = localStorage.getItem('farmZones');
    if (savedZones) {
      try {
        setZones(JSON.parse(savedZones));
      } catch (error) {
        console.error('Error parsing saved zones:', error);
        setZones(defaultZones);
      }
    } else {
      setZones(defaultZones);
    }
  }, []);
  
  // Save zones to localStorage when they change
  useEffect(() => {
    if (zones.length > 0) {
      localStorage.setItem('farmZones', JSON.stringify(zones));
    }
  }, [zones]);
  
  const handleCreateZone = () => {
    const newId = `zone-${Date.now()}`;
    const colors = ['#4ade80', '#facc15', '#fb923c', '#ef4444', '#3b82f6', '#a855f7'];
    
    const newZone: Zone = {
      id: newId,
      name: `New Zone ${zones.length + 1}`,
      type: 'field',
      size: 1.0,
      unit: 'hectares',
      coordinates: { 
        x: Math.floor(Math.random() * 70) + 10, 
        y: Math.floor(Math.random() * 70) + 10 
      },
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    setZones([...zones, newZone]);
    setEditZone(newZone);
    setActiveTab('list');
    
    toast({
      title: "Zone Created",
      description: `${newZone.name} has been added to your farm`,
    });
  };
  
  const handleUpdateZone = (zone: Zone) => {
    setZones(zones.map(z => z.id === zone.id ? zone : z));
    setEditZone(null);
    
    toast({
      title: "Zone Updated",
      description: `${zone.name} has been updated`,
    });
  };
  
  const handleDeleteZone = (id: string) => {
    const zoneToDelete = zones.find(z => z.id === id);
    setZones(zones.filter(zone => zone.id !== id));
    
    if (editZone?.id === id) {
      setEditZone(null);
    }
    
    toast({
      title: "Zone Deleted",
      description: `${zoneToDelete?.name} has been removed`,
      variant: "destructive",
    });
  };
  
  const refreshMapData = () => {
    setIsLoading(true);
    
    // Simulate loading time
    setTimeout(() => {
      // Simulate pest data for each zone
      const updatedMapData = zones.map(zone => {
        return {
          ...zone,
          pestCount: Math.floor(Math.random() * 20),
          lastScan: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
          riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
        };
      });
      
      setMapData(updatedMapData);
      setIsLoading(false);
      
      toast({
        title: "Map Data Updated",
        description: "Latest pest detection data has been loaded",
      });
    }, 1500);
  };
  
  useEffect(() => {
    refreshMapData();
  }, [zones]);
  
  return (
    <div id="zone-management" className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Farm Zone Management
          </CardTitle>
          <CardDescription>
            Create and manage zones to organize pest monitoring activities
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="map">Map View</TabsTrigger>
                <TabsTrigger value="list">Zone List</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshMapData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
                
                <Button size="sm" onClick={handleCreateZone}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Zone
                </Button>
              </div>
            </div>
            
            <TabsContent value="map" className="mt-0">
              <div className="relative border rounded-lg overflow-hidden h-96 bg-gray-100">
                {/* Simple map visualization */}
                <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-30"></div>
                
                {/* Zone markers */}
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                    style={{ 
                      left: `${zone.coordinates.x}%`, 
                      top: `${zone.coordinates.y}%`,
                    }}
                    onClick={() => setEditZone(zone)}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold relative"
                      style={{ backgroundColor: zone.color }}
                    >
                      {zone.name.substring(0, 2).toUpperCase()}
                      
                      {mapData && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white shadow-md rounded px-2 py-1 text-xs whitespace-nowrap">
                          {mapData.find((z: any) => z.id === zone.id)?.pestCount || 0} pests
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
                  <h4 className="text-sm font-medium mb-2">Pest Risk Levels</h4>
                  <div className="space-y-2">
                    {mapData?.map((zone: any) => (
                      <div key={zone.id} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        ></div>
                        <span className="text-xs">{zone.name}:</span>
                        <span className={`text-xs font-medium ${
                          zone.riskLevel === 'High' ? 'text-red-500' : 
                          zone.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {zone.riskLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {mapData && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mapData.slice(0, 3).map((zone: any) => (
                    <Card key={zone.id} className="bg-primary/5">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          ></div>
                          <h4 className="font-medium">{zone.name}</h4>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="text-muted-foreground">Pest Count:</span> {zone.pestCount}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Last Scan:</span>{' '}
                            {new Date(zone.lastScan).toLocaleString()}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Risk Level:</span>{' '}
                            <span className={
                              zone.riskLevel === 'High' ? 'text-red-500' : 
                              zone.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                            }>
                              {zone.riskLevel}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              {editZone ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {editZone.id.startsWith('zone-') ? 'Create Zone' : 'Edit Zone'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Zone Name</label>
                        <Input
                          value={editZone.name}
                          onChange={(e) => setEditZone({ ...editZone, name: e.target.value })}
                          placeholder="Enter zone name"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <select
                          value={editZone.type}
                          onChange={(e) => setEditZone({ 
                            ...editZone, 
                            type: e.target.value as 'greenhouse' | 'field' | 'orchard' | 'nursery'
                          })}
                          className="w-full px-3 py-2 mt-1 rounded-md border border-input"
                        >
                          <option value="greenhouse">Greenhouse</option>
                          <option value="field">Field</option>
                          <option value="orchard">Orchard</option>
                          <option value="nursery">Nursery</option>
                        </select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Size</label>
                          <Input
                            type="number"
                            value={editZone.size}
                            onChange={(e) => setEditZone({ 
                              ...editZone, 
                              size: parseFloat(e.target.value) || 0 
                            })}
                            min="0.1"
                            step="0.1"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Unit</label>
                          <select
                            value={editZone.unit}
                            onChange={(e) => setEditZone({ 
                              ...editZone, 
                              unit: e.target.value as 'hectares' | 'acres'
                            })}
                            className="w-full px-3 py-2 mt-1 rounded-md border border-input"
                          >
                            <option value="hectares">Hectares</option>
                            <option value="acres">Acres</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Color</label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={editZone.color}
                            onChange={(e) => setEditZone({ ...editZone, color: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer"
                          />
                          <span className="text-sm">{editZone.color}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between gap-4 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditZone(null)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={() => handleUpdateZone(editZone)}>
                          Save Zone
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {zones.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No zones created yet</p>
                      <Button onClick={handleCreateZone}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Zone
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {zones.map((zone) => (
                        <Card key={zone.id} className="overflow-hidden">
                          <div className="flex items-stretch">
                            <div 
                              className="w-2 h-full flex-shrink-0"
                              style={{ backgroundColor: zone.color }}
                            ></div>
                            <CardContent className="p-4 flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-medium">{zone.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)} • {zone.size} {zone.unit}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setEditZone(zone)}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteZone(zone.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              {mapData && (
                                <div className="mt-2 pt-2 border-t text-sm grid grid-cols-3 gap-2">
                                  {(() => {
                                    const zoneData = mapData.find((z: any) => z.id === zone.id);
                                    if (!zoneData) return null;
                                    
                                    return (
                                      <>
                                        <div>
                                          <span className="block text-muted-foreground">Pest Count</span>
                                          <span className="font-medium">{zoneData.pestCount}</span>
                                        </div>
                                        <div>
                                          <span className="block text-muted-foreground">Risk Level</span>
                                          <span className={`font-medium ${
                                            zoneData.riskLevel === 'High' ? 'text-red-500' : 
                                            zoneData.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                                          }`}>
                                            {zoneData.riskLevel}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="block text-muted-foreground">Last Scan</span>
                                          <span className="font-medium">
                                            {new Date(zoneData.lastScan).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </div>
                              )}
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZoneManagement;
