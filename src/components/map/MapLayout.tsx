
import React from 'react';
import MapContainer from './MapContainer';
import BarberList from './BarberList';

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
  return (
    <div className="flex-1 flex">
      <MapContainer 
        nearbyBarbers={displayBarbers}
        onBarberSelect={onBarberSelect}
      />

      <div className="hidden lg:flex w-96 border-l border-gray-200 flex-col shadow-xl">
        <BarberList 
          nearbyBarbers={displayBarbers}
          onBarberSelect={onBarberSelect}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default MapLayout;
