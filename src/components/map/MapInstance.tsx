
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

  console.log('MapInstance: Component state:', {
    mapkitLoaded,
    hasApiKey: !!apiKey,
    hasMapContainer: !!mapContainer.current,
    mapInitialized,
    mapReady,
    userLocation,
    barbersCount: nearbyBarbers.length
  });

  const showLoading = !mapInitialized || !mapReady;

  return (
    <div className="w-full h-full relative bg-gray-100">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full rounded-lg bg-gray-200"
      />
      
      <MapZoomControls 
        map={map}
        visible={mapInitialized}
      />
      
      {mapInitialized && (
        <MapAnnotations
          map={map}
          userLocation={userLocation}
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
          mapReady={mapReady}
        />
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
