
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import BarberProfileManager from './barber/BarberProfileManager';
import CustomerDiscovery from './barber/CustomerDiscovery';
import MessagingInterface from './barber/MessagingInterface';

interface BarberProfileData {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  bio: string;
  hourlyRate: number;
  phone: string;
  location: string;
  services: string[];
  workingHours: { [key: string]: string };
  profileImage: string;
  portfolioImages: string[];
  rating: number;
  completedCuts: number;
}

interface BarberDashboardProps {
  onBack: () => void;
}

const BarberDashboard = ({ onBack }: BarberDashboardProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'customers' | 'messages'>('profile');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const [profile, setProfile] = useState<BarberProfileData>({
    id: 'barber-1',
    name: 'Marcus Johnson',
    specialty: 'Fades & Braids',
    experience: '8 years',
    bio: 'Professional barber specializing in modern cuts and classic styles. Passionate about making every client look and feel their best.',
    hourlyRate: 35,
    phone: '(555) 123-4567',
    location: 'Downtown Barbershop, 123 Main St',
    services: ['Haircut', 'Beard Trim', 'Hot Towel Shave', 'Hair Wash', 'Styling'],
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
    ],
    rating: 4.8,
    completedCuts: 247
  });

  const handleUpdateProfile = (updatedProfile: BarberProfileData) => {
    setProfile(updatedProfile);
    // In real app, this would save to backend
    console.log('Profile updated:', updatedProfile);
  };

  const handleMessageCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveTab('messages');
  };

  const handleBackFromMessages = () => {
    setSelectedCustomerId(null);
    setActiveTab('customers');
  };

  // If messaging a specific customer, show messaging interface
  if (activeTab === 'messages') {
    return (
      <MessagingInterface 
        onBack={handleBackFromMessages}
        selectedCustomerId={selectedCustomerId || undefined}
      />
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-2 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-gray-400 hover:text-white h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            >
              ← Back
            </Button>
            <h1 className="text-sm sm:text-xl font-semibold text-white">Barber Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Navigation Tabs */}
        <div className="lg:w-64 bg-gray-900 border-b lg:border-r lg:border-b-0 border-gray-800 p-2 lg:p-4 overflow-x-auto lg:overflow-x-visible">
          <div className="flex lg:flex-col gap-1 lg:gap-2 min-w-max lg:min-w-0">
            {[
              { id: 'profile', label: 'My Profile', icon: '👤', description: 'Manage your profile' },
              { id: 'customers', label: 'Discover Customers', icon: '👥', description: 'Find potential clients' },
              { id: 'messages', label: 'Messages', icon: '💬', description: 'Chat with customers' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-shrink-0 lg:w-full p-2 lg:p-3 text-left rounded-lg transition-colors flex items-center gap-2 lg:gap-3 text-xs sm:text-sm lg:text-base ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span className="text-sm lg:text-lg">{tab.icon}</span>
                <div className="flex flex-col">
                  <span className="whitespace-nowrap font-medium">{tab.label}</span>
                  <span className="text-xs opacity-70 hidden lg:block">{tab.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-y-auto">
          {activeTab === 'profile' && (
            <BarberProfileManager 
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerDiscovery 
              onMessageCustomer={handleMessageCustomer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
