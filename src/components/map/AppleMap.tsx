
import React, { useRef } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapKitInitialization } from '@/hooks/useMapKitInitialization';
import { useAppleMapInitialization } from '@/hooks/useAppleMapInitialization';
import { useUserLocationMarker } from '@/hooks/useUserLocationMarker';
import { useBarberMarkers } from '@/hooks/useBarberMarkers';

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

interface AppleMapProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  apiKey: string;
}

declare global {
  interface Window {
    mapkit: any;
  }
}

const AppleMap = ({ nearbyBarbers, onBarberSelect, apiKey }: AppleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { userLocation, error, loading } = useGeolocation();
  
  console.log('AppleMap: Rendering with', nearbyBarbers.length, 'barbers');
  console.log('AppleMap: nearbyBarbers data:', nearbyBarbers);
  
  // Initialize MapKit
  const { mapkitLoaded } = useMapKitInitialization({ apiKey });
  
  // Initialize the map
  const { map } = useAppleMapInitialization({
    mapkitLoaded,
    mapContainer,
    userLocation
  });
  
  // Add user location marker
  useUserLocationMarker({ map, userLocation });
  
  // Add barber markers
  useBarberMarkers({ map, nearbyBarbers, onBarberSelect });

  if (!mapkitLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white">Loading Apple Maps...</div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default AppleMap;
