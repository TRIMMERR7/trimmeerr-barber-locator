
import React from 'react';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

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

interface PriceDisplayProps {
  selectedService: Service | null;
  barber: Barber;
}

const PriceDisplay = ({ selectedService, barber }: PriceDisplayProps) => {
  const currentPrice = selectedService ? selectedService.price : parseInt(barber.price.replace('$', ''));

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/20">
      <div className="flex justify-between items-center">
        <span className="text-white/70 text-sm">
          {selectedService ? selectedService.name : 'Service Price'}
        </span>
        <span className="font-bold text-lg text-red-400">
          ${currentPrice}
        </span>
      </div>
    </div>
  );
};

export default PriceDisplay;
