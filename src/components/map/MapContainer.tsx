
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

      {/* Combined Widget - Top Left Corner */}
      <div className={`absolute z-[100] pointer-events-auto ${
        isMobile 
          ? 'top-4 left-4' 
          : 'top-6 left-6'
      }`}>
        <MapWidget />
      </div>
    </div>
  );
};

export default MapContainer;
