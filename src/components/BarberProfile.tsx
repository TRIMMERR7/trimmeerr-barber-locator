
import React from 'react';
import ProfileHeader from './barber/ProfileHeader';
import StepsIndicator from './barber/StepsIndicator';
import BarberInfo from './barber/BarberInfo';
import ServicesList from './barber/ServicesList';
import ContactInfo from './barber/ContactInfo';
import Portfolio from './barber/Portfolio';
import Reviews from './barber/Reviews';
import BookingPanel from './barber/BookingPanel';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/80 flex flex-col backdrop-blur-sm overflow-hidden">
      <ProfileHeader onBack={onBack} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className={`p-3 sm:p-4 space-y-4 ${isMobile ? 'pb-safe' : ''}`}>
            <StepsIndicator />
            <BarberInfo barber={barber} />
            
            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
              <ServicesList />
              <ContactInfo />
            </div>

            <Portfolio />
            <Reviews />
            
            {/* On mobile, show booking panel inline */}
            {isMobile && (
              <div className="mt-6">
                <BookingPanel barber={barber} />
              </div>
            )}
          </div>
        </div>

        {/* Desktop booking panel */}
        {!isMobile && <BookingPanel barber={barber} />}
      </div>
    </div>
  );
};

export default BarberProfile;
