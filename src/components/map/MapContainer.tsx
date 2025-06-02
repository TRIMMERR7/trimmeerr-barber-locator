
import React from 'react';
import MapboxMap from './MapboxMap';
import AdSlider from '../AdSlider';
import TopBarbersSlider from '../TopBarbersSlider';
import { Barber } from '@/types/barber';

interface MapContainerProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const MapContainer = ({ nearbyBarbers, onBarberSelect }: MapContainerProps) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Leaflet Map - Full container */}
      <div className="absolute inset-0 w-full h-full">
        <MapboxMap 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Top Barbers Slideshow - Overlay */}
      <div className="absolute top-4 left-4 z-[60] pointer-events-auto">
        <TopBarbersSlider />
      </div>

      {/* Advertising Slideshow - Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-[60] pointer-events-auto">
        <AdSlider />
      </div>
    </div>
  );
};

export default MapContainer;
