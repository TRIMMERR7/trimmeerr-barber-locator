
import React, { useState } from 'react';
import DashboardHeader from './barber/dashboard/DashboardHeader';
import DashboardNavigation from './barber/dashboard/DashboardNavigation';
import DashboardContent from './barber/dashboard/DashboardContent';
import MessagingInterface from './barber/MessagingInterface';
import BarberProfileManager from './barber/BarberProfileManager';
import BarberAdminPanel from './barber/BarberAdminPanel';
import BarberProfileSetup from './barber/BarberProfileSetup';
import { useBarberProfile } from '@/hooks/useBarberProfile';

interface BarberDashboardProps {
  onBack: () => void;
}

// Updated type definition to include 'admin'
type DashboardTabType = 'profile' | 'admin' | 'customers' | 'messages' | 'calendar' | 'bank';

const BarberDashboard = ({ onBack }: BarberDashboardProps) => {
  const { profile, loading } = useBarberProfile();
  const [activeTab, setActiveTab] = useState<DashboardTabType>('admin');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  const handleMessageCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setActiveTab('messages');
  };

  const handleBackFromMessages = () => {
    setSelectedCustomerId(null);
    setActiveTab('customers');
  };

  const handleProfileSetupComplete = () => {
    // Refresh the profile data and show admin panel
    setActiveTab('admin');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show profile setup if no profile exists
  if (!profile) {
    return <BarberProfileSetup onComplete={handleProfileSetupComplete} />;
  }

  // Show messaging interface
  if (activeTab === 'messages') {
    return (
      <MessagingInterface 
        onBack={handleBackFromMessages}
        selectedCustomerId={selectedCustomerId || undefined}
      />
    );
  }

  // Show profile editor
  if (showProfileEditor) {
    const handleUpdateProfile = (updatedProfile: any) => {
      // This will be handled by the BarberProfileManager component
      setShowProfileEditor(false);
    };

    return (
      <div className="h-screen bg-black flex flex-col">
        <DashboardHeader onBack={() => setShowProfileEditor(false)} />
        <div className="flex-1 overflow-y-auto p-6">
          <BarberProfileManager 
            profile={{
              id: profile.id,
              name: profile.business_name || 'Unnamed Business',
              bio: profile.bio || '',
              specialty: profile.specialty || '',
              experience: profile.experience || '',
              hourlyRate: profile.hourly_rate || 0,
              location: profile.location || '',
              phone: profile.phone || '',
              services: profile.services || [],
              workingHours: profile.working_hours || {},
              portfolioImages: profile.portfolio_images || [],
              profileImage: profile.profile_image_url || '',
              rating: Number(profile.rating) || 0,
              completedCuts: profile.completed_cuts || 0
            }}
            onUpdateProfile={handleUpdateProfile}
          />
        </div>
      </div>
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

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'admin' && (
            <div className="p-6">
              <BarberAdminPanel onEditProfile={() => setShowProfileEditor(true)} />
            </div>
          )}
          
          {activeTab !== 'admin' && (
            <DashboardContent 
              activeTab={activeTab}
              profile={{
                id: profile.id,
                name: profile.business_name || 'Unnamed Business',
                bio: profile.bio || '',
                specialty: profile.specialty || '',
                experience: profile.experience || '',
                hourlyRate: profile.hourly_rate || 0,
                location: profile.location || '',
                phone: profile.phone || '',
                services: profile.services || [],
                workingHours: profile.working_hours || {},
                portfolioImages: profile.portfolio_images || [],
                profileImage: profile.profile_image_url || '',
                rating: Number(profile.rating) || 0,
                completedCuts: profile.completed_cuts || 0
              }}
              onUpdateProfile={() => {}}
              onMessageCustomer={handleMessageCustomer}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarberDashboard;
