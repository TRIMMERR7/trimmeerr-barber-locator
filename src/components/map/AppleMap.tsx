
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
  const { userLocation, error: geoError, loading: geoLoading } = useGeolocation();
  
  console.log('AppleMap: Rendering with API key:', !!apiKey);
  console.log('AppleMap: Barbers count:', nearbyBarbers.length);
  console.log('AppleMap: User location:', userLocation);
  console.log('AppleMap: Geolocation error:', geoError);
  
  // Initialize MapKit
  const { mapkitLoaded, error: mapkitError } = useMapKitInitialization({ apiKey });
  console.log('AppleMap: MapKit loaded:', mapkitLoaded, 'error:', mapkitError);
  
  // Initialize the map
  const { map } = useAppleMapInitialization({
    mapkitLoaded,
    mapContainer,
    userLocation
  });
  
  // Add user location marker
  useUserLocationMarker({ map, userLocation });
  
  // Add barber markers with click handler
  useBarberMarkers({ 
    map, 
    nearbyBarbers, 
    onBarberSelect: (barber) => {
      console.log('AppleMap: Barber selected from marker:', barber.name);
      onBarberSelect(barber);
    }
  });

  if (!apiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <p>No Apple Maps API key available</p>
          <p className="text-sm text-gray-400 mt-2">Please check your configuration</p>
        </div>
      </div>
    );
  }

  if (mapkitError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <p>Failed to load Apple Maps</p>
          <p className="text-sm text-gray-400 mt-2">{mapkitError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!mapkitLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading Apple Maps...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg overflow-hidden" 
        style={{ 
          touchAction: 'manipulation',
          minHeight: '400px',
          width: '100%',
          height: '100%'
        }}
      />
      {geoError && (
        <div className="absolute top-4 left-4 right-4 bg-red-600/90 text-white p-3 rounded-lg text-sm z-10">
          Location access denied. Showing default location.
        </div>
      )}
      {geoLoading && (
        <div className="absolute top-4 left-4 right-4 bg-blue-600/90 text-white p-3 rounded-lg text-sm z-10">
          Getting your location...
        </div>
      )}
    </div>
  );
};

export default AppleMap;
