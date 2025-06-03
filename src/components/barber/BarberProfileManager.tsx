
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Plus, X, Star, MapPin, Clock } from "lucide-react";
import { sanitizeInput } from '@/utils/securityHelpers';

interface BarberProfile {
  id: string;
  name: string;
  bio: string;
  specialty: string;
  experience: string;
  hourlyRate: number;
  location: string;
  phone: string;
  services: string[];
  workingHours: { [key: string]: string };
  portfolioImages: string[];
  profileImage: string;
  rating: number;
  completedCuts: number;
}

interface BarberProfileManagerProps {
  profile: BarberProfile;
  onUpdateProfile: (profile: BarberProfile) => void;
}

const BarberProfileManager = ({ profile, onUpdateProfile }: BarberProfileManagerProps) => {
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const [newService, setNewService] = useState('');
  const [newImage, setNewImage] = useState('');

  const handleSave = () => {
    // Sanitize inputs before saving
    const sanitizedProfile = {
      ...tempProfile,
      name: sanitizeInput(tempProfile.name),
      bio: sanitizeInput(tempProfile.bio),
      specialty: sanitizeInput(tempProfile.specialty),
      location: sanitizeInput(tempProfile.location),
      phone: sanitizeInput(tempProfile.phone),
      services: tempProfile.services.map(service => sanitizeInput(service))
    };
    
    onUpdateProfile(sanitizedProfile);
    setEditMode(false);
  };

  const addService = () => {
    if (newService.trim() && !tempProfile.services.includes(newService.trim())) {
      setTempProfile({
        ...tempProfile,
        services: [...tempProfile.services, sanitizeInput(newService.trim())]
      });
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setTempProfile({
      ...tempProfile,
      services: tempProfile.services.filter(s => s !== service)
    });
  };

  const addPortfolioImage = () => {
    if (newImage.trim()) {
      setTempProfile({
        ...tempProfile,
        portfolioImages: [...tempProfile.portfolioImages, newImage.trim()]
      });
      setNewImage('');
    }
  };

  const removePortfolioImage = (index: number) => {
    setTempProfile({
      ...tempProfile,
      portfolioImages: tempProfile.portfolioImages.filter((_, i) => i !== index)
    });
  };

  if (!editMode) {
    return (
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.profileImage} />
                <AvatarFallback className="bg-red-600 text-white text-2xl">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-red-400 font-medium">{profile.specialty}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{profile.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{profile.experience}</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setEditMode(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Camera className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{profile.completedCuts}</div>
              <div className="text-sm text-gray-400">Completed Cuts</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">${profile.hourlyRate}</div>
              <div className="text-sm text-gray-400">Hourly Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{profile.services.length}</div>
              <div className="text-sm text-gray-400">Services Offered</div>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.services.map(service => (
                <Badge key={service} variant="outline" className="border-red-500 text-red-400">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            Save Changes
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Name</label>
              <Input
                value={tempProfile.name}
                onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Specialty</label>
              <Input
                value={tempProfile.specialty}
                onChange={(e) => setTempProfile({...tempProfile, specialty: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Bio</label>
            <Textarea
              value={tempProfile.bio}
              onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Experience</label>
              <Input
                value={tempProfile.experience}
                onChange={(e) => setTempProfile({...tempProfile, experience: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Hourly Rate ($)</label>
              <Input
                type="number"
                value={tempProfile.hourlyRate}
                onChange={(e) => setTempProfile({...tempProfile, hourlyRate: parseInt(e.target.value)})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Phone</label>
              <Input
                value={tempProfile.phone}
                onChange={(e) => setTempProfile({...tempProfile, phone: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Management */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="Add new service..."
              className="bg-gray-800 border-gray-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && addService()}
            />
            <Button onClick={addService} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tempProfile.services.map(service => (
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
        </CardContent>
      </Card>

      {/* Portfolio Management */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="Image URL..."
              className="bg-gray-800 border-gray-600 text-white"
              onKeyPress={(e) => e.key === 'Enter' && addPortfolioImage()}
            />
            <Button onClick={addPortfolioImage} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {tempProfile.portfolioImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePortfolioImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarberProfileManager;
