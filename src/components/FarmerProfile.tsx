import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MapPin, User, GraduationCap, Sprout, FlaskConical, AlertTriangle, CheckCircle, Smartphone, TestTube } from 'lucide-react';
import { Farmer } from '@/utils/types';

interface FarmerProfileProps {
  farmer: Farmer;
  onEdit?: () => void;
  showSuggestions?: boolean;
}

const FarmerProfile: React.FC<FarmerProfileProps> = ({ 
  farmer, 
  onEdit, 
  showSuggestions = true 
}) => {
  // Validate completeness of data
  const getCompletionStatus = () => {
    const requiredFields = [
      farmer.name, farmer.age, farmer.education,
      farmer.acre, farmer.soilType, farmer.phValue,
      farmer.taluk, farmer.district, farmer.hobli, farmer.village, farmer.pincode,
      farmer.latitude, farmer.longitude
    ];
    
    const completedFields = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== '' && field !== 0
    ).length;
    
    return {
      completed: completedFields,
      total: requiredFields.length,
      percentage: Math.round((completedFields / requiredFields.length) * 100)
    };
  };

  const completion = getCompletionStatus();

  const getMissingFields = () => {
    const missing = [];
    if (!farmer.name) missing.push({ field: 'Name', suggestion: 'Required for farmer identification' });
    if (!farmer.age || farmer.age === 0) missing.push({ field: 'Age', suggestion: 'Needed for demographic analysis' });
    if (!farmer.education) missing.push({ field: 'Education', suggestion: 'Helps tailor communication methods' });
    if (!farmer.acre || farmer.acre === 0) missing.push({ field: 'Land Size', suggestion: 'Essential for crop planning and yield estimates' });
    if (!farmer.soilType) missing.push({ field: 'Soil Type', suggestion: 'Conduct soil texture analysis or visual inspection' });
    if (!farmer.phValue || farmer.phValue === 0) missing.push({ field: 'Soil pH', suggestion: 'Use pH meter or test strips (₹50-200 cost)' });
    if (!farmer.latitude || farmer.latitude === 0) missing.push({ field: 'Coordinates', suggestion: 'Use smartphone GPS or Google Maps location sharing' });
    
    return missing;
  };

  const missingFields = getMissingFields();

  const formatCoordinates = (lat: number, lng: number) => {
    if (!lat || !lng) return 'Not provided';
    return `${lat.toFixed(6)}°, ${lng.toFixed(6)}°`;
  };

  const getPhStatus = (ph: number) => {
    if (ph < 6.0) return { status: 'Acidic', color: 'destructive' };
    if (ph > 8.0) return { status: 'Alkaline', color: 'destructive' };
    return { status: 'Optimal', color: 'primary' };
  };

  const phStatus = farmer.phValue ? getPhStatus(farmer.phValue) : null;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">{farmer.name || 'Unnamed Farmer'}</CardTitle>
                <CardDescription>Farmer ID: {farmer.id}</CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={completion.percentage > 80 ? "default" : "secondary"}>
                {completion.percentage}% Complete
              </Badge>
              {onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Completion Status */}
      {completion.percentage < 100 && showSuggestions && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Profile is {completion.completed}/{completion.total} fields complete. 
            Complete missing fields for better farming recommendations.
          </AlertDescription>
        </Alert>
      )}

      {/* Detailed Profile Table */}
      <Card>
        <CardHeader>
          <CardTitle>Farmer Profile Details</CardTitle>
          <CardDescription>Complete digital farmer profile for smart agriculture</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Field</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Personal Information */}
              <TableRow>
                <TableCell rowSpan={3} className="font-medium bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Personal Info</span>
                  </div>
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>{farmer.name || <span className="text-muted-foreground">Not provided</span>}</TableCell>
                <TableCell>
                  {farmer.name ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Age</TableCell>
                <TableCell>
                  {farmer.age && farmer.age > 0 ? (
                    `${farmer.age} years`
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </TableCell>
                <TableCell>
                  {farmer.age && farmer.age > 0 ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Education</TableCell>
                <TableCell>
                  {farmer.education ? (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{farmer.education}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </TableCell>
                <TableCell>
                  {farmer.education ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>

              {/* Land Details */}
              <TableRow>
                <TableCell rowSpan={3} className="font-medium bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <Sprout className="h-4 w-4" />
                    <span>Land Details</span>
                  </div>
                </TableCell>
                <TableCell>Acreage</TableCell>
                <TableCell>
                  {farmer.acre && farmer.acre > 0 ? (
                    `${farmer.acre} acres`
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </TableCell>
                <TableCell>
                  {farmer.acre && farmer.acre > 0 ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Soil Type</TableCell>
                <TableCell>{farmer.soilType || <span className="text-muted-foreground">Not provided</span>}</TableCell>
                <TableCell>
                  {farmer.soilType ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Soil pH Value</TableCell>
                <TableCell>
                  {farmer.phValue && farmer.phValue > 0 ? (
                    <div className="flex items-center space-x-2">
                      <FlaskConical className="h-4 w-4" />
                      <span>{farmer.phValue}</span>
                      {phStatus && (
                        <Badge variant={phStatus.color as any} className="text-xs">
                          {phStatus.status}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </TableCell>
                <TableCell>
                  {farmer.phValue && farmer.phValue > 0 ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>

              {/* Location Details */}
              <TableRow>
                <TableCell rowSpan={5} className="font-medium bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                </TableCell>
                <TableCell>Taluk</TableCell>
                <TableCell>{farmer.taluk || <span className="text-muted-foreground">Not provided</span>}</TableCell>
                <TableCell>
                  {farmer.taluk ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>District</TableCell>
                <TableCell>{farmer.district || <span className="text-muted-foreground">Not provided</span>}</TableCell>
                <TableCell>
                  {farmer.district ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hobli</TableCell>
                <TableCell>{farmer.hobli || <span className="text-muted-foreground">Not provided</span>}</TableCell>
                <TableCell>
                  {farmer.hobli ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Village</TableCell>
                <TableCell>{farmer.village || <span className="text-muted-foreground">Not provided</span>}</TableCell>
                <TableCell>
                  {farmer.village ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pincode</TableCell>
                <TableCell>{farmer.pincode || <span className="text-muted-foreground">Not provided</span>}</TableCell>
                <TableCell>
                  {farmer.pincode ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>

              {/* Coordinates */}
              <TableRow>
                <TableCell className="font-medium bg-muted/30">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>GPS Coordinates</span>
                  </div>
                </TableCell>
                <TableCell>Lat, Long</TableCell>
                <TableCell>
                  <code className="text-xs bg-muted p-1 rounded">
                    {formatCoordinates(farmer.latitude, farmer.longitude)}
                  </code>
                </TableCell>
                <TableCell>
                  {farmer.latitude && farmer.longitude ? (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Data Collection Suggestions */}
      {missingFields.length > 0 && showSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <span>Data Collection Suggestions</span>
            </CardTitle>
            <CardDescription>
              Complete your profile for better farming insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missingFields.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{item.field}</h4>
                    <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <h4 className="font-medium">Quick Collection Methods:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border">
                  <h5 className="font-medium text-sm flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>GPS Coordinates</span>
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Open Google Maps → Long press your field location → Copy coordinates
                  </p>
                </div>
                <div className="p-3 rounded-lg border">
                  <h5 className="font-medium text-sm flex items-center space-x-2">
                    <FlaskConical className="h-4 w-4" />
                    <span>Soil pH Testing</span>
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use digital pH meter (₹200-500) or pH test strips (₹50-100)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Ready JSON Export */}
      <Card>
        <CardHeader>
          <CardTitle>Database Ready Format</CardTitle>
          <CardDescription>JSON structure for database storage and API integration</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-40">
            {JSON.stringify(farmer, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmerProfile;