
import React from 'react';
import { useMapKit } from '@/hooks/useMapKit';
import MapInstance from './MapInstance';

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
  const { mapkitLoaded } = useMapKit({ apiKey });

  if (!mapkitLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white">Loading Apple Maps...</div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <p>Apple Maps API key required</p>
          <p className="text-sm text-gray-400 mt-2">Please configure your Apple Maps API key in Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <MapInstance
      nearbyBarbers={nearbyBarbers}
      onBarberSelect={onBarberSelect}
      mapkitLoaded={mapkitLoaded}
      apiKey={apiKey}
    />
  );
};

export default AppleMap;
