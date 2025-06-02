
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface BarberProfileData {
  name: string;
  specialty: string;
  experience: string;
  bio: string;
  price: string;
  phone: string;
  location: string;
  services: string[];
  workingHours: { [key: string]: string };
  profileImage: string;
  portfolioImages: string[];
}

interface BarberDashboardProps {
  onBack: () => void;
}

const BarberDashboard = ({ onBack }: BarberDashboardProps) => {
  const [profile, setProfile] = useState<BarberProfileData>({
    name: 'Marcus Johnson',
    specialty: 'Fades & Braids',
    experience: '8 years',
    bio: 'Professional barber specializing in modern cuts and classic styles. Passionate about making every client look and feel their best.',
    price: '$35',
    phone: '(555) 123-4567',
    location: 'Downtown Barbershop, 123 Main St',
    services: ['Haircut', 'Beard Trim', 'Hot Towel Shave', 'Hair Wash'],
    workingHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 7:00 PM',
      saturday: '8:00 AM - 5:00 PM',
      sunday: 'Closed'
    },
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    portfolioImages: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503951458645-643d911bc19c?w=400&h=400&fit=crop'
    ]
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'portfolio' | 'schedule'>('profile');
  const [newService, setNewService] = useState('');

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    alert('Profile updated successfully!');
  };

  const addService = () => {
    if (newService.trim() && !profile.services.includes(newService.trim())) {
      setProfile({
        ...profile,
        services: [...profile.services, newService.trim()]
      });
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setProfile({
      ...profile,
      services: profile.services.filter(s => s !== service)
    });
  };

  const addPortfolioImage = () => {
    const imageUrl = prompt('Enter image URL:');
    if (imageUrl) {
      setProfile({
        ...profile,
        portfolioImages: [...profile.portfolioImages, imageUrl]
      });
    }
  };

  const removePortfolioImage = (index: number) => {
    setProfile({
      ...profile,
      portfolioImages: profile.portfolioImages.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </Button>
            <h1 className="text-xl font-semibold text-white">Barber Dashboard</h1>
          </div>
          <Button 
            onClick={handleSaveProfile}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Tabs */}
        <div className="w-64 bg-gray-900 border-r border-gray-800 p-4">
          <div className="space-y-2">
            {[
              { id: 'profile', label: 'Profile Info', icon: '👤' },
              { id: 'portfolio', label: 'Portfolio', icon: '📸' },
              { id: 'schedule', label: 'Schedule', icon: '📅' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full p-3 text-left rounded-lg transition-colors flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Name</label>
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Specialty</label>
                      <Input
                        value={profile.specialty}
                        onChange={(e) => setProfile({...profile, specialty: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Experience</label>
                      <Input
                        value={profile.experience}
                        onChange={(e) => setProfile({...profile, experience: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Base Price</label>
                      <Input
                        value={profile.price}
                        onChange={(e) => setProfile({...profile, price: e.target.value})}
                        placeholder="e.g. $35"
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Bio</label>
                    <Textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="bg-gray-800 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Phone</label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Location</label>
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map(service => (
                      <Badge 
                        key={service}
                        variant="outline" 
                        className="border-gray-600 text-white bg-gray-800 cursor-pointer hover:bg-red-600"
                        onClick={() => removeService(service)}
                      >
                        {service} ✕
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="max-w-4xl space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Portfolio Images</CardTitle>
                  <Button onClick={addPortfolioImage} className="bg-red-600 hover:bg-red-700">
                    Add Image
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {profile.portfolioImages.map((image, index) => (
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
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="max-w-2xl space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Working Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(profile.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-24 text-gray-300 capitalize">{day}</div>
                      <Input
                        value={hours}
                        onChange={(e) => setProfile({
                          ...profile,
                          workingHours: { ...profile.workingHours, [day]: e.target.value }
                        })}
                        className="bg-gray-800 border-gray-600 text-white"
                        placeholder="e.g. 9:00 AM - 6:00 PM or Closed"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
