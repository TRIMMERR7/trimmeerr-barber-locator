
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, MapPin } from "lucide-react";
import { useBarberProfile } from '@/hooks/useBarberProfile';
import { sanitizeInput } from '@/utils/securityHelpers';
import { geocodeAddress } from '@/utils/geocoding';
import { toast } from 'sonner';

interface BarberProfileSetupProps {
  onComplete: () => void;
}

const BarberProfileSetup = ({ onComplete }: BarberProfileSetupProps) => {
  const { createProfile } = useBarberProfile();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [newService, setNewService] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  
  const [formData, setFormData] = useState({
    business_name: '',
    specialty: '',
    experience: '',
    bio: '',
    hourly_rate: 0,
    phone: '',
    location: '',
    services: [] as string[],
    profile_image_url: ''
  });

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, sanitizeInput(newService.trim())]
      });
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter(s => s !== service)
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const location = e.target.value;
    setFormData({ ...formData, location });
    // Clear previous coordinates when location changes
    setCoordinates(null);
  };

  const handleGeocodeLocation = async () => {
    if (!formData.location.trim()) {
      toast.error('Please enter a location first');
      return;
    }

    setGeocoding(true);
    try {
      const coords = await geocodeAddress(formData.location);
      if (coords) {
        setCoordinates(coords);
        toast.success('Location found and verified!');
      } else {
        toast.error('Could not find location. Please check the address.');
      }
    } catch (error) {
      toast.error('Error verifying location. Please try again.');
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coordinates) {
      toast.error('Please verify your location before submitting');
      return;
    }

    setLoading(true);

    try {
      const sanitizedData = {
        ...formData,
        business_name: sanitizeInput(formData.business_name),
        specialty: sanitizeInput(formData.specialty),
        experience: sanitizeInput(formData.experience),
        bio: sanitizeInput(formData.bio),
        phone: sanitizeInput(formData.phone),
        location: sanitizeInput(formData.location),
        services: formData.services.map(service => sanitizeInput(service)),
        latitude: coordinates.lat,
        longitude: coordinates.lng
      };

      await createProfile(sanitizedData);
      toast.success('Barber profile created successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center">
              Set Up Your Barber Profile
            </CardTitle>
            <p className="text-gray-400 text-center">
              Complete your profile to start receiving bookings
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Business Name
                  </label>
                  <Input
                    value={formData.business_name}
                    onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Your barbershop name"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Specialty
                  </label>
                  <Input
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="e.g., Fades & Braids"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Bio
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Tell clients about yourself and your experience..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Experience
                  </label>
                  <Input
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="8 years"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Hourly Rate ($)
                  </label>
                  <Input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({...formData, hourly_rate: parseInt(e.target.value)})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="35"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Phone
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="(555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Location *
                </label>
                <div className="flex gap-2">
                  <Input
                    value={formData.location}
                    onChange={handleLocationChange}
                    className="bg-gray-800 border-gray-600 text-white flex-1"
                    placeholder="123 Main St, City, State"
                    required
                  />
                  <Button
                    type="button"
                    onClick={handleGeocodeLocation}
                    disabled={geocoding || !formData.location.trim()}
                    className="bg-blue-600 hover:bg-blue-700 px-3"
                  >
                    {geocoding ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {coordinates && (
                  <p className="text-green-400 text-sm mt-1">
                    ✓ Location verified: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Click the map icon to verify your location appears correctly on the map
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Services
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Add service..."
                    className="bg-gray-800 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  />
                  <Button 
                    type="button"
                    onClick={addService} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.services.map(service => (
                    <Badge 
                      key={service}
                      variant="outline" 
                      className="border-gray-600 text-white bg-gray-800 cursor-pointer hover:bg-red-600"
                      onClick={() => removeService(service)}
                    >
                      {service} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={loading || !coordinates}
              >
                {loading ? 'Creating Profile...' : 'Create Barber Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarberProfileSetup;
