
import React, { useRef, useEffect } from 'react';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useLeafletBarberMarkers } from '@/hooks/useLeafletBarberMarkers';
import { useLeafletUserLocationMarker } from '@/hooks/useLeafletUserLocationMarker';

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

interface LeafletMapProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const LeafletMap = ({ nearbyBarbers, onBarberSelect }: LeafletMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { userLocation } = useGeolocation();
  
  console.log('LeafletMap: Rendering with', nearbyBarbers.length, 'barbers');
  console.log('LeafletMap: User location:', userLocation);

  // Initialize the map
  const map = useMapInitialization(mapContainer);

  // Add barber markers
  useLeafletBarberMarkers({ map: { current: map }, nearbyBarbers, onBarberSelect });

  // Add user location marker
  useLeafletUserLocationMarker({ map: { current: map }, userLocation });

  return (
    <div className="h-full w-full relative overflow-hidden rounded-lg">
      <div 
        ref={mapContainer} 
        className="h-full w-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};

export default LeafletMap;
