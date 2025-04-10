
import React, { useState } from 'react';
import { NewHeader } from "@/components/NewHeader";
import { pests, getDetectionsByPestId, getTreatmentsByPestId, getBeneficialPests, getHarmfulPests } from '@/utils/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Bug, AlertTriangle, Droplets, ArrowLeft, ArrowRight, Filter, Info, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PestDetailsModal from '@/components/PestDetailsModal';
import { useNavigate } from 'react-router-dom';

export default function PestLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [threatFilter, setThreatFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [selectedPest, setSelectedPest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pestTypeFilter, setPestTypeFilter] = useState('all'); // 'all', 'harmful', 'beneficial'
  const navigate = useNavigate();
  
  // Get all unique crops from pest data
  const allCrops = Array.from(
    new Set(pests.flatMap(pest => pest.affectedCrops))
  ).sort();
  
  // Filter pests based on search term, filters, and pest type
  const filteredPests = pests.filter(pest => {
    const matchesSearch = 
      pest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      pest.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pest.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesThreat = threatFilter === 'all' || pest.threat === threatFilter;
    
    const matchesCrop = 
      cropFilter === 'all' || 
      pest.affectedCrops.some(crop => crop.toLowerCase() === cropFilter.toLowerCase());
      
    const matchesPestType = 
      pestTypeFilter === 'all' || 
      (pestTypeFilter === 'beneficial' && pest.isBeneficial) ||
      (pestTypeFilter === 'harmful' && !pest.isBeneficial);
    
    return matchesSearch && matchesThreat && matchesCrop && matchesPestType;
  });
  
  const getThreatColor = (threat) => {
    switch (threat) {
      case 'low': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'medium': return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'high': return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };
  
  const handleOpenDetails = (pest) => {
    setSelectedPest(pest);
    setShowModal(true);
  };

  const handleGetStarted = () => {
    navigate('/dashboard');
  };
  
  const handleLearnMore = (pestId) => {
    window.open(`https://ipm.ucanr.edu/PMG/PESTNOTES/pn${pestId}.html`, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <NewHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bug className="h-8 w-8 text-primary" />
              Pest Library
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive information on common agricultural pests and treatment methods
            </p>
          </div>
          
          <div className="space-x-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button onClick={handleGetStarted}>
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search pests by name or description..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Select value={threatFilter} onValueChange={setThreatFilter}>
                  <SelectTrigger>
                    <span className="flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by threat" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Threat Levels</SelectItem>
                    <SelectItem value="low">Low Threat</SelectItem>
                    <SelectItem value="medium">Medium Threat</SelectItem>
                    <SelectItem value="high">High Threat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={cropFilter} onValueChange={setCropFilter}>
                  <SelectTrigger>
                    <span className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by crop" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crops</SelectItem>
                    {allCrops.map(crop => (
                      <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={pestTypeFilter} onValueChange={setPestTypeFilter}>
                  <SelectTrigger>
                    <span className="flex items-center">
                      <Bug className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by pest type" />
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pests</SelectItem>
                    <SelectItem value="harmful">Harmful Pests</SelectItem>
                    <SelectItem value="beneficial">Beneficial Insects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPests.length} out of {pests.length} pests
          </p>
        </div>
        
        {/* Pests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPests.length > 0 ? (
            filteredPests.map(pest => (
              <Card key={pest.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-muted flex items-center justify-center border-b">
                  <img 
                    src={pest.imageUrl} 
                    alt={pest.name} 
                    className="h-full w-full object-contain" 
                  />
                  <Badge className={`absolute top-3 right-3 ${getThreatColor(pest.threat)}`}>
                    {pest.threat.charAt(0).toUpperCase() + pest.threat.slice(1)} Threat
                  </Badge>
                  {pest.isBeneficial && (
                    <Badge className="absolute top-3 left-3 bg-green-100 text-green-800">
                      Beneficial
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{pest.name}</CardTitle>
                      <p className="text-sm italic text-muted-foreground">
                        {pest.scientificName}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {pest.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {pest.affectedCrops.slice(0, 3).map(crop => (
                      <Badge key={crop} variant="outline">
                        {crop}
                      </Badge>
                    ))}
                    {pest.affectedCrops.length > 3 && (
                      <Badge variant="outline">+{pest.affectedCrops.length - 3} more</Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 flex items-center justify-center" 
                      onClick={() => handleOpenDetails(pest)}
                    >
                      View Details
                      <Info className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <Button 
                      className="flex-1 flex items-center justify-center"
                      variant="outline"
                      onClick={() => handleLearnMore(pest.id.replace('p', ''))}
                    >
                      Learn More
                      <BookOpen className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 py-16 text-center">
              <Bug className="h-16 w-16 mx-auto text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-medium mb-1">No pests found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
      
      {/* Pest Details Modal */}
      {showModal && selectedPest && (
        <PestDetailsModal 
          pest={selectedPest} 
          detections={getDetectionsByPestId(selectedPest.id)}
          treatments={getTreatmentsByPestId(selectedPest.id)}
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}
