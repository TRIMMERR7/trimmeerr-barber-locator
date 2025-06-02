
import React, { useRef } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import MapAnnotations from './MapAnnotations';
import MapZoomControls from './MapZoomControls';
import MapLoadingState from './MapLoadingState';
import { Barber } from '@/types/barber';

interface MapInstanceProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  mapkitLoaded: boolean;
  apiKey: string;
}

const MapInstance = ({ nearbyBarbers, onBarberSelect, mapkitLoaded, apiKey }: MapInstanceProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { userLocation } = useGeolocation();
  
  const { map, mapInitialized, mapReady } = useMapInitialization({
    mapkitLoaded,
    apiKey,
    userLocation,
    mapContainer
  });

  console.log('MapInstance: Current state:', {
    mapkitLoaded,
    hasApiKey: !!apiKey,
    mapInitialized,
    mapReady,
    userLocation: userLocation ? `[${userLocation[0].toFixed(3)}, ${userLocation[1].toFixed(3)}]` : null,
    barbersCount: nearbyBarbers.length,
    hasMap: !!map
  });

  const showLoading = !mapInitialized || !mapReady;

  return (
    <div className="w-full h-full relative bg-gray-100">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full rounded-lg bg-gray-200"
        style={{ minHeight: '400px' }}
      />
      
      {map && mapReady && (
        <>
          <MapZoomControls 
            map={map}
            visible={true}
          />
          
          <MapAnnotations
            map={map}
            userLocation={userLocation}
            nearbyBarbers={nearbyBarbers}
            onBarberSelect={onBarberSelect}
            mapReady={mapReady}
          />
        </>
      )}
      
      <MapLoadingState
        mapkitLoaded={mapkitLoaded}
        mapInitialized={mapInitialized}
        mapReady={mapReady}
        visible={showLoading}
      />
    </div>
  );
};

export default MapInstance;
