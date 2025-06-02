
import React from 'react';
import ProfileHeader from './barber/ProfileHeader';
import StepsIndicator from './barber/StepsIndicator';
import BarberInfo from './barber/BarberInfo';
import ServicesList from './barber/ServicesList';
import ContactInfo from './barber/ContactInfo';
import Portfolio from './barber/Portfolio';
import Reviews from './barber/Reviews';
import BookingPanel from './barber/BookingPanel';
import { Barber } from '@/types/barber';

interface BarberProfileProps {
  barber: Barber;
  onBack: () => void;
  userType: 'barber' | 'client';
  onNavigate?: () => void;
}

const BarberProfile = ({ barber, onBack, userType, onNavigate }: BarberProfileProps) => {
  return (
    <div className="h-screen bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-black flex flex-col backdrop-blur-sm">
      <ProfileHeader onBack={onBack} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            <StepsIndicator />
            <BarberInfo barber={barber} />
            
            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              <ServicesList />
              <ContactInfo />
            </div>

            <Portfolio />
            <Reviews />
          </div>
        </div>

        <BookingPanel barber={barber} />
      </div>
    </div>
  );
};

export default BarberProfile;
