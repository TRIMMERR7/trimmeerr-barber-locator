
import React from 'react';
import ProfileHeader from './barber/ProfileHeader';
import StepsIndicator from './barber/StepsIndicator';
import BarberInfo from './barber/BarberInfo';
import ContactInfo from './barber/ContactInfo';
import Portfolio from './barber/Portfolio';
import Reviews from './barber/Reviews';
import SimpleBookingDialog from './barber/SimpleBookingDialog';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
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

      <div className="flex-1 overflow-y-auto">
        <div className={`p-3 sm:p-4 space-y-4 ${isMobile ? 'pb-safe' : ''}`}>
          <StepsIndicator />
          
          {/* Booking Button - Only show for client users */}
          {userType === 'client' && (
            <div className="w-full">
              <SimpleBookingDialog barber={barber}>
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Now - {barber.price}
                </Button>
              </SimpleBookingDialog>
            </div>
          )}

          {/* Message for barber users */}
          {userType === 'barber' && (
            <div className="w-full p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <p className="text-gray-300 text-center">
                This is how your profile appears to clients. Only clients can book appointments.
              </p>
            </div>
          )}

          <BarberInfo barber={barber} />
          
          <ContactInfo />

          <Portfolio />
          <Reviews />
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;
