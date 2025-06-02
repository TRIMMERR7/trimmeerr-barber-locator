
import React from 'react';
import ProfileHeader from './barber/ProfileHeader';
import StepsIndicator from './barber/StepsIndicator';
import BarberInfo from './barber/BarberInfo';
import ServicesList from './barber/ServicesList';
import ContactInfo from './barber/ContactInfo';
import Portfolio from './barber/Portfolio';
import Reviews from './barber/Reviews';
import BookingPanel from './barber/BookingPanel';
import AIChat from './AIChat';

interface Barber {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string;
  price: string;
  distance: string;
  experience: string;
  lat: number;
  lng: number;
  videoUrl?: string;
}

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
            
            {/* AI Chat for specific barber */}
            <AIChat 
              barberName={barber.name}
              className="lg:hidden" // Only show on mobile/tablet, hidden on desktop
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <BookingPanel barber={barber} />
          
          {/* AI Chat on desktop */}
          <div className="hidden lg:block w-96">
            <AIChat barberName={barber.name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;
