
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
    <div className="h-full w-full flex flex-col relative mobile-full-height">
      {/* Map Provider - Takes most of the space */}
      <div className="flex-1 min-h-0 w-full relative overflow-hidden rounded-lg">
        <MapProvider 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Widget Container - Bottom section, only on mobile with safe area */}
      {isMobile && (
        <div className="shrink-0 border-t border-gray-700/50 bg-black/20 backdrop-blur-sm pb-safe">
          <MapWidget />
        </div>
      )}
    </div>
  );
};

export default MapContainer;
