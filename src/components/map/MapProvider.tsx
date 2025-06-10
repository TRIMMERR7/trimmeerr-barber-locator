
import React from 'react';
import LeafletMap from './LeafletMap';

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

interface MapProviderProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const MapProvider = ({ nearbyBarbers, onBarberSelect }: MapProviderProps) => {
  console.log('MapProvider: Using Leaflet map with', nearbyBarbers.length, 'barbers');

  return (
    <div className="h-full relative">
      <LeafletMap 
        nearbyBarbers={nearbyBarbers} 
        onBarberSelect={onBarberSelect}
      />
    </div>
  );
};

export default MapProvider;
