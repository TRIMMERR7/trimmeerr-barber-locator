
import React from 'react';
import MapProvider from './MapProvider';
import MapWidget from './MapWidget';

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

      {/* Combined Widget - Positioned on left side, middle */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-[100] pointer-events-auto">
        <MapWidget />
      </div>
    </div>
  );
};

export default MapContainer;
