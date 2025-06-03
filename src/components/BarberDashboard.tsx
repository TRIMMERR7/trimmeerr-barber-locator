
import React, { useState } from 'react';
import DashboardHeader from './barber/dashboard/DashboardHeader';
import DashboardNavigation from './barber/dashboard/DashboardNavigation';
import DashboardContent from './barber/dashboard/DashboardContent';
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
      <DashboardHeader onBack={onBack} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <DashboardNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DashboardContent 
          activeTab={activeTab}
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onMessageCustomer={handleMessageCustomer}
        />
      </div>
    </div>
  );
};

export default BarberDashboard;
