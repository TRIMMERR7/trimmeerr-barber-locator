
import React from 'react';
import BarberProfileManager from '../BarberProfileManager';
import CustomerDiscovery from '../CustomerDiscovery';

type TabType = 'profile' | 'customers' | 'messages';

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

interface DashboardContentProps {
  activeTab: TabType;
  profile: BarberProfileData;
  onUpdateProfile: (profile: BarberProfileData) => void;
  onMessageCustomer: (customerId: string) => void;
}

const DashboardContent = ({ 
  activeTab, 
  profile, 
  onUpdateProfile, 
  onMessageCustomer 
}: DashboardContentProps) => {
  return (
    <div className="flex-1 p-2 sm:p-4 lg:p-6 overflow-y-auto">
      {activeTab === 'profile' && (
        <BarberProfileManager 
          profile={profile}
          onUpdateProfile={onUpdateProfile}
        />
      )}

      {activeTab === 'customers' && (
        <CustomerDiscovery 
          onMessageCustomer={onMessageCustomer}
        />
      )}
    </div>
  );
};

export default DashboardContent;
