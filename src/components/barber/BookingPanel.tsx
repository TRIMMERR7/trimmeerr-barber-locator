
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import PriceDisplay from './PriceDisplay';
import BookingDialog from './BookingDialog';

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

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface BookingPanelProps {
  barber: Barber;
}

const BookingPanel = ({ barber }: BookingPanelProps) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="w-full lg:w-96 bg-white/5 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-white/10 p-4 lg:p-6 flex-shrink-0 shadow-2xl">
      {/* Quick Info */}
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-red-500" />
        <div>
          <h3 className="text-lg font-semibold text-white">Book Appointment</h3>
          <p className="text-sm text-white/70">with {barber.name}</p>
        </div>
      </div>
      
      {/* Price Display */}
      <PriceDisplay selectedService={selectedService} barber={barber} />

      {/* Book Now Button with Dialog */}
      <BookingDialog barber={barber}>
        <Button 
          className="w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/90 hover:to-red-800/90 text-white h-12 text-lg font-semibold rounded-xl shadow-lg backdrop-blur-sm border border-white/20"
        >
          Book Now
        </Button>
      </BookingDialog>
    </div>
  );
};

export default BookingPanel;
