
import React from 'react';
import MapProvider from './MapProvider';
import AdSlider from '../AdSlider';
import TopBarbersSlider from '../TopBarbersSlider';

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
  return (
    <div className="w-full h-full relative">
      {/* Map Provider - Full container */}
      <div className="absolute inset-0">
        <MapProvider 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Top Barbers Slideshow - Overlay */}
      <div className="absolute top-4 left-4 z-50 pointer-events-auto">
        <TopBarbersSlider />
      </div>

      {/* Advertising Slideshow - Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-50 pointer-events-auto">
        <AdSlider />
      </div>
    </div>
  );
};

export default MapContainer;
