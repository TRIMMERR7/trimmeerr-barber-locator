
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
    <div className="flex-1 relative">
      {/* Top Barbers Slideshow */}
      <TopBarbersSlider />

      {/* Mapbox Map */}
      <MapboxMap 
        nearbyBarbers={nearbyBarbers}
        onBarberSelect={onBarberSelect}
      />

      {/* Advertising Slideshow */}
      <AdSlider />
    </div>
  );
};

export default MapContainer;
