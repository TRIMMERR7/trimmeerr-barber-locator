import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, MapPin, CheckCircle, AlertCircle, Loader2, Edit } from "lucide-react";
import { useBarberProfile } from '@/hooks/useBarberProfile';
import { sanitizeInput } from '@/utils/securityHelpers';
import { geocodeAddress, validateCoordinates } from '@/utils/geocoding';
import { toast } from 'sonner';
import ImageUploader from './ImageUploader';
import WorkingHoursEditor from './WorkingHoursEditor';

interface BarberProfileSetupProps {
  onComplete: () => void;
  editMode?: boolean;
}

const BarberProfileSetup = ({ onComplete, editMode = false }: BarberProfileSetupProps) => {
  const { profile, createProfile, updateProfile } = useBarberProfile();
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [newService, setNewService] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [profileCreated, setProfileCreated] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [locationVerified, setLocationVerified] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    business_name: '',
    specialty: '',
    experience: '',
    bio: '',
    hourly_rate: 0,
    phone: '',
    location: '',
    services: [] as string[],
    profile_image_url: '',
    portfolio_images: [] as string[],
    working_hours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true }
    }
  });

  // Pre-populate form if profile exists
  useEffect(() => {
    if (profile) {
      setFormData({
        business_name: profile.business_name || '',
        specialty: profile.specialty || '',
        experience: profile.experience || '',
        bio: profile.bio || '',
        hourly_rate: profile.hourly_rate || 0,
        phone: profile.phone || '',
        location: profile.location || '',
        services: profile.services || [],
        profile_image_url: profile.profile_image_url || '',
        portfolio_images: profile.portfolio_images || [],
        working_hours: profile.working_hours || formData.working_hours
      });
      
      if (profile.latitude && profile.longitude) {
        setCoordinates({ lat: profile.latitude, lng: profile.longitude });
        setLocationVerified(true);
      }
      
      setProfileId(profile.id);
    }
  }, [profile]);

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
    setCoordinates(null);
    setLocationVerified(false);
    setLocationError(null);
  };

  const handleGeocodeLocation = async () => {
    if (!formData.location.trim()) {
      toast.error('Please enter a location first');
      return;
    }

    setGeocoding(true);
    setLocationVerified(false);
    setLocationError(null);
    
    try {
      console.log('Starting geocoding for:', formData.location);
      const coords = await geocodeAddress(formData.location);
      
      if (coords && validateCoordinates(coords.lat, coords.lng)) {
        setCoordinates(coords);
        setLocationVerified(true);
        setLocationError(null);
        toast.success('Location verified successfully!');
        console.log('Location verified:', coords);
      } else {
        setCoordinates(null);
        setLocationVerified(false);
        setLocationError('Could not verify this address. Please try a different format or check for typos.');
        toast.error('Could not verify location. Try simplifying the address or checking for typos.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setCoordinates(null);
      setLocationVerified(false);
      setLocationError('Error verifying location. Please try again.');
      toast.error('Error verifying location. Please try again.');
    } finally {
      setGeocoding(false);
    }
  };

  const isFormComplete = () => {
    return (
      formData.business_name.trim() &&
      formData.specialty.trim() &&
      formData.experience.trim() &&
      formData.hourly_rate > 0 &&
      formData.phone.trim() &&
      formData.location.trim() &&
      locationVerified &&
      coordinates &&
      formData.services.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationVerified || !coordinates) {
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
        longitude: coordinates.lng,
        is_active: editMode ? profile?.is_active : false
      };

      const savedProfile = editMode && profile 
        ? await updateProfile(sanitizedData)
        : await createProfile(sanitizedData);
        
      setProfileCreated(true);
      setProfileId(savedProfile.id);
      
      if (editMode) {
        toast.success('Profile updated successfully!');
        onComplete();
      } else {
        toast.success('Profile saved successfully! Click "Go Live" to appear on the map.');
      }
    } catch (error) {
      toast.error(editMode ? 'Failed to update profile. Please try again.' : 'Failed to save profile. Please try again.');
      console.error('Profile save error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = async () => {
    if (!profileId) return;

    setLoading(true);
    try {
      await updateProfile({ is_active: true });
      toast.success('Congratulations! You are now live on the map and clients can book with you!');
      onComplete();
    } catch (error) {
      toast.error('Failed to activate profile. Please try again.');
      console.error('Profile activation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show success state with Go Live button (only for new profiles)
  if (profileCreated && !editMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700 max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">
              Profile {profileCreated ? 'Created' : 'Ready'} Successfully!
            </CardTitle>
            <p className="text-gray-400">
              Your barber profile is ready. Click "Go Live" to start appearing on the map and receiving bookings from clients.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Profile Summary:</h3>
              <div className="space-y-1 text-sm text-gray-300">
                <p><span className="text-gray-400">Business:</span> {formData.business_name}</p>
                <p><span className="text-gray-400">Specialty:</span> {formData.specialty}</p>
                <p><span className="text-gray-400">Rate:</span> ${formData.hourly_rate}/hr</p>
                <p><span className="text-gray-400">Location:</span> {formData.location}</p>
                <p><span className="text-gray-400">Services:</span> {formData.services.join(', ')}</p>
              </div>
            </div>
            
            <Button 
              onClick={handleGoLive}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
            >
              {loading ? 'Going Live...' : '🚀 Go Live on Map'}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Once you go live, clients will be able to see your profile and book appointments with you.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl text-center flex items-center justify-center gap-2">
              {editMode ? <Edit className="w-6 h-6" /> : null}
              {editMode ? 'Edit Your Barber Profile' : 'Set Up Your Barber Profile'}
            </CardTitle>
            <p className="text-gray-400 text-center">
              {editMode 
                ? 'Update your profile information and settings'
                : 'Complete all fields to create your profile, then go live to start receiving bookings'
              }
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Image Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ImageUploader
                  images={formData.profile_image_url ? [formData.profile_image_url] : []}
                  onImagesChange={(images) => setFormData({...formData, profile_image_url: images[0] || ''})}
                  single={true}
                  label="Profile Picture"
                />
                
                <ImageUploader
                  images={formData.portfolio_images}
                  onImagesChange={(images) => setFormData({...formData, portfolio_images: images})}
                  maxImages={6}
                  label="Portfolio Images"
                />
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Business Name *
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
                    Specialty *
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
                    Experience *
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
                    Hourly Rate ($) *
                  </label>
                  <Input
                    type="number"
                    value={formData.hourly_rate || ''}
                    onChange={(e) => setFormData({...formData, hourly_rate: parseInt(e.target.value) || 0})}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="35"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Phone *
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

              {/* Location Section */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Location * <span className="text-xs text-gray-500">(Include street address, city, state, and ZIP)</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={formData.location}
                      onChange={handleLocationChange}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="1234 Main St, Houston, TX 77001"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      <p>✓ Good: "1234 Main St, Houston, TX 77001"</p>
                      <p>✓ Good: "5678 Westheimer Rd, Houston, Texas 77057"</p>
                      <p>✓ Good: "900 Louisiana St, Houston, TX 77002"</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleGeocodeLocation}
                    disabled={geocoding || !formData.location.trim()}
                    className="bg-blue-600 hover:bg-blue-700 px-3 min-w-[44px]"
                  >
                    {geocoding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {/* Location verification status */}
                {locationVerified && coordinates && (
                  <div className="mt-2 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                    <p className="text-green-400 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Location verified successfully!
                    </p>
                    <p className="text-xs text-green-300 mt-1">
                      Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                )}
                
                {locationError && (
                  <div className="mt-2 p-3 bg-red-900/30 border border-red-700 rounded-lg">
                    <p className="text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {locationError}
                    </p>
                    <div className="text-xs text-red-300 mt-2 space-y-1">
                      <p>Try these formats:</p>
                      <p>• "Street Number Street Name, Houston, TX ZIP"</p>
                      <p>• Use "TX" instead of "Texas"</p>
                      <p>• Include the ZIP code</p>
                      <p>• Avoid complex descriptions like "Service Road"</p>
                    </div>
                  </div>
                )}
                
                {!locationVerified && formData.location.trim() && !geocoding && !locationError && (
                  <p className="text-yellow-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Please click the location button to verify your address
                  </p>
                )}
              </div>

              {/* Working Hours */}
              <WorkingHoursEditor
                workingHours={formData.working_hours}
                onChange={(hours) => setFormData({...formData, working_hours: hours})}
              />

              {/* Services */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  Services *
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
                {formData.services.length === 0 && (
                  <p className="text-red-400 text-sm mt-1">Please add at least one service</p>
                )}
              </div>

              {/* Profile Completion */}
              {!editMode && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Profile Completion</h3>
                  <div className="space-y-2 text-sm">
                    <div className={`flex items-center gap-2 ${formData.business_name ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.business_name ? '✓' : '○'} Business Name
                    </div>
                    <div className={`flex items-center gap-2 ${formData.specialty ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.specialty ? '✓' : '○'} Specialty
                    </div>
                    <div className={`flex items-center gap-2 ${formData.experience ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.experience ? '✓' : '○'} Experience
                    </div>
                    <div className={`flex items-center gap-2 ${formData.hourly_rate > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.hourly_rate > 0 ? '✓' : '○'} Hourly Rate
                    </div>
                    <div className={`flex items-center gap-2 ${formData.phone ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.phone ? '✓' : '○'} Phone Number
                    </div>
                    <div className={`flex items-center gap-2 ${locationVerified ? 'text-green-400' : 'text-gray-400'}`}>
                      {locationVerified ? '✓' : '○'} Verified Location
                    </div>
                    <div className={`flex items-center gap-2 ${formData.services.length > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                      {formData.services.length > 0 ? '✓' : '○'} Services ({formData.services.length})
                    </div>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={loading || !isFormComplete()}
              >
                {loading ? (editMode ? 'Updating Profile...' : 'Saving Profile...') : (editMode ? 'Update Profile' : 'Create Profile')}
              </Button>

              {!editMode && !isFormComplete() && (
                <p className="text-yellow-400 text-sm text-center">
                  Please complete all required fields and verify your location to save your profile
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BarberProfileSetup;

}
