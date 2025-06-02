
import React from 'react';
import MapProvider from './MapProvider';
import MapWidget from './MapWidget';
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
}

interface MapContainerProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const MapContainer = ({ nearbyBarbers, onBarberSelect }: MapContainerProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      {/* Map Provider - Takes remaining space */}
      <div className="flex-1 relative">
        <MapProvider 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Widget Container - Bottom with border */}
      <div className="border-t border-gray-700/50 bg-black/20 backdrop-blur-sm">
        <MapWidget />
      </div>
    </div>
  );
};

export default MapContainer;
