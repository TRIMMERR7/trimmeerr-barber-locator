
import React from 'react';
import MapboxMap from './MapboxMap';
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
      {/* Mapbox Map */}
      <div className="absolute inset-0">
        <MapboxMap 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Top Barbers Slideshow - Higher z-index and positioned relative to viewport */}
      <div className="absolute top-4 left-4 z-[60] pointer-events-auto">
        <TopBarbersSlider />
      </div>

      {/* Advertising Slideshow - Higher z-index and positioned relative to viewport */}
      <div className="absolute bottom-4 left-4 right-4 z-[60] pointer-events-auto">
        <AdSlider />
      </div>
    </div>
  );
};

export default MapContainer;
