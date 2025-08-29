import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const farmerSchema = z.object({
  // Personal Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100'),
  education: z.string().min(1, 'Education is required'),
  
  // Land Details
  acre: z.number().min(0.1, 'Acre must be at least 0.1').max(1000, 'Acre must be less than 1000'),
  soilType: z.string().min(1, 'Soil type is required'),
  phValue: z.number().min(0, 'pH must be between 0-14').max(14, 'pH must be between 0-14'),
  
  // Location Details
  taluk: z.string().min(1, 'Taluk is required'),
  district: z.string().min(1, 'District is required'),
  hobli: z.string().min(1, 'Hobli is required'),
  village: z.string().min(1, 'Village is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits').max(6, 'Pincode must be 6 digits'),
  
  // Coordinates
  latitude: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
  longitude: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude')
});

type FarmerFormData = z.infer<typeof farmerSchema>;

const FarmerRegistrationForm = () => {
  const form = useForm<FarmerFormData>({
    resolver: zodResolver(farmerSchema),
    defaultValues: {
      name: '',
      age: 0,
      education: '',
      acre: 0,
      soilType: '',
      phValue: 7.0,
      taluk: '',
      district: '',
      hobli: '',
      village: '',
      pincode: '',
      latitude: 0,
      longitude: 0
    }
  });

  const onSubmit = (data: FarmerFormData) => {
    console.log('Farmer registration data:', data);
    toast.success('Farmer registered successfully!');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Farmer Registration</CardTitle>
        <CardDescription>
          Register your details to access our smart farming platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter age"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input placeholder="Educational qualification" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Land Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Land Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="acre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Acre</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="Land size in acres"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Soil</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Loamy, Clay, Sandy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>pH Value</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="14"
                          placeholder="Soil pH (0-14)"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Location Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="taluk"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taluk</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter taluk" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter district" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hobli"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hobli</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter hobli" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="village"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Village</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter village" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter pincode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Coordinates */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          placeholder="Enter latitude"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.000001"
                          placeholder="Enter longitude"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Register Farmer
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FarmerRegistrationForm;