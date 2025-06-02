
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
    <div className="flex-1 relative overflow-hidden">
      {/* Map Provider with switching capability - Lower z-index */}
      <div className="absolute inset-0 z-10">
        <MapProvider 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Combined Widget - Responsive positioning */}
      <div className={`absolute z-[100] pointer-events-auto ${
        isMobile 
          ? 'top-auto bottom-0 right-0 left-0 p-4' 
          : 'top-1/2 left-4 transform -translate-y-1/2'
      }`}>
        <MapWidget />
      </div>
    </div>
  );
};

export default MapContainer;
