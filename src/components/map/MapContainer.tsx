
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
    <div className="flex-1 relative overflow-hidden">
      {/* Map Provider with switching capability - Lower z-index */}
      <div className="absolute inset-0 z-10">
        <MapProvider 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Top Barbers Slideshow - Positioned on left side, middle */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-[100] pointer-events-auto">
        <TopBarbersSlider />
      </div>

      {/* Advertising Slideshow - Positioned on left side, bottom */}
      <div className="absolute bottom-20 left-4 z-[100] pointer-events-auto">
        <AdSlider />
      </div>
    </div>
  );
};

export default MapContainer;
