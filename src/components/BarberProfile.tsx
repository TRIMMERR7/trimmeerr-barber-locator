
import React from 'react';
import ProfileHeader from './barber/ProfileHeader';
import StepsIndicator from './barber/StepsIndicator';
import BarberInfo from './barber/BarberInfo';
import ServicesList from './barber/ServicesList';
import ContactInfo from './barber/ContactInfo';
import Portfolio from './barber/Portfolio';
import BookingPanel from './barber/BookingPanel';

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
}

interface BarberProfileProps {
  barber: Barber;
  onBack: () => void;
  userType: 'barber' | 'client';
  onNavigate?: () => void;
}

const BarberProfile = ({ barber, onBack, userType, onNavigate }: BarberProfileProps) => {
  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      <ProfileHeader onBack={onBack} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <StepsIndicator />
          <BarberInfo barber={barber} />
          
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <ServicesList />
            <ContactInfo />
          </div>

          <Portfolio />
        </div>

        <BookingPanel barber={barber} />
      </div>
    </div>
  );
};

export default BarberProfile;
