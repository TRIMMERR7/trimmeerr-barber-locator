
import React from 'react';
import { useMapKit } from '@/hooks/useMapKit';
import MapInstance from './MapInstance';
import { Barber } from '@/types/barber';

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
  console.log('AppleMap: Rendering with:', { 
    barbersCount: nearbyBarbers.length, 
    hasApiKey: !!apiKey,
    apiKeyPreview: apiKey ? `${apiKey.substring(0, 10)}...` : 'none'
  });

  const { mapkitLoaded } = useMapKit({ apiKey });

  console.log('AppleMap: MapKit loaded:', mapkitLoaded);

  if (!mapkitLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
          <div>Loading Apple Maps...</div>
        </div>
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
