
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useBarberProfile } from '@/hooks/useBarberProfile';
import { Settings, Eye, EyeOff, Edit, MapPin, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import BarberProfileSetup from './BarberProfileSetup';

interface BarberAdminPanelProps {
  onEditProfile: () => void;
  onCompleteProfile?: () => void;
}

const BarberAdminPanel = ({ onEditProfile, onCompleteProfile }: BarberAdminPanelProps) => {
  const { profile, updateProfile, loading } = useBarberProfile();
  const [updating, setUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Complete Your Profile Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-400">
              You haven't set up your barber profile yet. Complete your profile to appear on the map and start receiving bookings from clients.
            </p>
            <Button 
              onClick={onCompleteProfile}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Complete Profile & Go Live
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showEditModal) {
    return (
      <BarberProfileSetup 
        editMode={true}
        onComplete={() => setShowEditModal(false)}
      />
    );
  }

  const isProfileComplete = () => {
    return profile.business_name && 
           profile.specialty && 
           profile.experience && 
           profile.hourly_rate && 
           profile.phone && 
           profile.location && 
           profile.services && 
           profile.services.length > 0;
  };

  const toggleActive = async () => {
    if (!isProfileComplete()) {
      toast.error('Please complete your profile before going live');
      return;
    }

    setUpdating(true);
    try {
      await updateProfile({ is_active: !profile.is_active });
      toast.success(
        profile.is_active 
          ? 'Profile deactivated - you won\'t receive new bookings' 
          : 'Profile activated - you can now receive bookings'
      );
    } catch (error) {
      toast.error('Failed to update profile status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Check */}
      {!isProfileComplete() && (
        <Card className="bg-red-900/20 border-red-700">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Profile Incomplete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Your profile is missing required information. Complete your profile to appear on the map and receive bookings.
            </p>
            <Button 
              onClick={onCompleteProfile}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Complete Profile Setup
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Admin Header */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Profile Administration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Profile Status</h3>
              <p className="text-gray-400 text-sm">
                {profile.is_active 
                  ? 'Your profile is active and visible to clients' 
                  : 'Your profile is hidden from clients'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {profile.is_active ? (
                <Eye className="w-4 h-4 text-green-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
              <Switch
                checked={profile.is_active}
                onCheckedChange={toggleActive}
                disabled={updating || !isProfileComplete()}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Badge variant={profile.is_verified ? "default" : "outline"}>
              {profile.is_verified ? "Verified" : "Unverified"}
            </Badge>
            <Badge variant={profile.is_active ? "default" : "secondary"}>
              {profile.is_active ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={isProfileComplete() ? "default" : "destructive"}>
              {isProfileComplete() ? "Complete" : "Incomplete"}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setShowEditModal(true)}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile Information
            </Button>
            
            {!isProfileComplete() && onCompleteProfile && (
              <Button 
                onClick={onCompleteProfile}
                variant="outline"
                className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{profile.completed_cuts}</div>
            <div className="text-sm text-gray-400">Completed Cuts</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{profile.rating || 0}</div>
            <div className="text-sm text-gray-400">Average Rating</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">${profile.hourly_rate || 0}</div>
            <div className="text-sm text-gray-400">Hourly Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Services Overview */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Services Offered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.services?.map(service => (
              <Badge key={service} variant="outline" className="border-red-500 text-red-400">
                {service}
              </Badge>
            )) || <p className="text-gray-400">No services added yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarberAdminPanel;
