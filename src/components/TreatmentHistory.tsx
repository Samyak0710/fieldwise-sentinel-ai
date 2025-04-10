
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Droplets, Calendar, Check, Clock, X, Plus, 
  Filter, ArrowUpDown, ChevronRight 
} from 'lucide-react';
import { 
  treatments, pests, fields, getPestById, getFieldById
} from '@/utils/mockData';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { decisionService, SprayHistory } from '../services/decisionService';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

const TreatmentHistory: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [sprayHistory, setSprayHistory] = useState<SprayHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSprayHistory = async () => {
      try {
        setIsLoading(true);
        const history = await decisionService.getSprayHistory();
        setSprayHistory(history);
      } catch (error) {
        console.error('Error fetching spray history:', error);
        toast.error('Failed to load treatment history');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSprayHistory();
  }, []);
  
  // Combine supabase spray history with mock treatments for now
  const allTreatments = [
    ...treatments,
    ...sprayHistory.map(spray => ({
      id: spray.id,
      fieldId: typeof spray.location === 'string' ? spray.location : 'unknown',
      pestId: typeof spray.target === 'string' ? spray.target : 'unknown',
      method: spray.product,
      dateApplied: spray.date.toISOString().split('T')[0],
      status: 'completed' as 'scheduled' | 'completed' | 'cancelled',
      notes: spray.notes,
      effectivenessRating: 4
    }))
  ];
  
  const filteredTreatments = allTreatments.filter(treatment => {
    if (filter === 'scheduled') return treatment.status === 'scheduled';
    if (filter === 'completed') return treatment.status === 'completed';
    if (filter === 'cancelled') return treatment.status === 'cancelled';
    return true; // 'all'
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };
  
  return (
    <div id="treatments" className="animate-fade-in-slide duration-700">
      <Card className="fieldwise-card transform transition-all hover:shadow-lg">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Treatment History
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 transition-transform hover:scale-105"
              onClick={() => {
                toast.info('Add New Treatment', {
                  description: 'This feature is coming soon!'
                });
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>New Treatment</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] h-8">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Treatments</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="sm" className="h-8">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              <span>Sort by Date</span>
            </Button>
          </div>
          
          {/* Treatment List */}
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTreatments.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No treatments found with the selected filter.</p>
                </div>
              ) : (
                filteredTreatments.map((treatment, index) => {
                  const pest = getPestById(treatment.pestId);
                  const field = getFieldById(treatment.fieldId);
                  
                  return (
                    <div 
                      key={treatment.id} 
                      className="border rounded-md overflow-hidden transition-all hover:shadow-md transform hover:-translate-y-1"
                      style={{ 
                        animationDelay: `${index * 0.05}s`,
                        animationFillMode: 'both',
                        animation: 'fadeIn 0.5s ease-out'
                      }}
                    >
                      <div className="flex items-center p-3 gap-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(treatment.status)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap gap-x-2 gap-y-1 items-baseline">
                            <h3 className="font-medium">{treatment.method}</h3>
                            <span className="text-sm text-muted-foreground">for {pest?.name || treatment.pestId}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{treatment.dateApplied}</span>
                            </div>
                            <div className="text-muted-foreground truncate">
                              {field?.name || treatment.fieldId}
                            </div>
                          </div>
                          {treatment.notes && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {treatment.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 transition-transform hover:scale-110"
                            onClick={() => {
                              toast.info('Treatment Details', {
                                description: `View details for ${treatment.method}`
                              });
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {treatment.status === 'completed' && treatment.effectivenessRating && (
                        <div className="px-3 py-2 bg-muted/50 border-t flex justify-between items-center">
                          <span className="text-xs">Effectiveness Rating</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i}
                                className={`w-4 h-1.5 rounded-full ${
                                  i < treatment.effectivenessRating! 
                                    ? 'bg-primary' 
                                    : 'bg-muted-foreground/20'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentHistory;
