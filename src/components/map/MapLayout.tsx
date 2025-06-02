
import React from 'react';
import MapContainer from './MapContainer';
import BarberList from './BarberList';
import { Barber } from '@/types/barber';

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
