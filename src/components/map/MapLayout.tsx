
import React from 'react';
import MapContainer from './MapContainer';
import BarberList from './BarberList';
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
  ethnicity: string;
  age: number;
  languages: string[];
  personalityTraits: string[];
  videoUrl?: string;
}

interface MapLayoutProps {
  displayBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  onNavigate: (barber: Barber) => void;
}

const MapLayout = ({ displayBarbers, onBarberSelect, onNavigate }: MapLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full min-h-0">
      {/* Map Container - Full height on mobile, left side on desktop */}
      <div className="flex-1 h-full min-h-0">
        <MapContainer 
          nearbyBarbers={displayBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Barber List - Only show on desktop in sidebar */}
      {!isMobile && (
        <div className="w-96 h-full border-l border-gray-200 flex flex-col shadow-xl bg-white">
          <BarberList 
            nearbyBarbers={displayBarbers}
            onBarberSelect={onBarberSelect}
            onNavigate={onNavigate}
          />
        </div>
      )}
    </div>
  );
};

export default MapLayout;
