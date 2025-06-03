
import React, { useRef, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapKitInitialization } from '@/hooks/useMapKitInitialization';

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
  const map = useRef<any>(null);
  const { userLocation, error: geoError, loading: geoLoading } = useGeolocation();
  
  console.log('AppleMap: Rendering with props:', {
    hasApiKey: !!apiKey,
    barbersCount: nearbyBarbers.length,
    userLocation,
    geoError: geoError?.message
  });
  
  // Initialize MapKit
  const { mapkitLoaded, error: mapkitError } = useMapKitInitialization({ apiKey });
  console.log('AppleMap: MapKit state:', { mapkitLoaded, mapkitError });

  // Initialize the actual map when MapKit is ready
  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current || map.current) {
      console.log('AppleMap: Skipping map creation:', {
        mapkitLoaded,
        hasContainer: !!mapContainer.current,
        hasMap: !!map.current
      });
      return;
    }

    console.log('AppleMap: Creating map instance...');

    try {
      // Default to Houston if no user location
      const defaultLat = 29.7604;
      const defaultLng = -95.3698;
      
      const centerLat = userLocation ? userLocation[0] : defaultLat;
      const centerLng = userLocation ? userLocation[1] : defaultLng;
      
      const center = new window.mapkit.Coordinate(centerLat, centerLng);
      console.log('AppleMap: Using center coordinates:', { centerLat, centerLng });

      const mapConfig = {
        center: center,
        region: new window.mapkit.CoordinateRegion(
          center,
          new window.mapkit.CoordinateSpan(0.05, 0.05)
        ),
        mapType: window.mapkit.Map.MapTypes.Standard,
        showsMapTypeControl: false,
        showsZoomControl: true,
        showsUserLocationControl: true,
        isRotationEnabled: true,
        colorScheme: window.mapkit.Map.ColorSchemes.Light,
        showsCompass: window.mapkit.FeatureVisibility.Visible,
        isScrollEnabled: true,
        isZoomEnabled: true
      };

      map.current = new window.mapkit.Map(mapContainer.current, mapConfig);
      console.log('AppleMap: Map created successfully');

      // Add barber markers
      if (nearbyBarbers.length > 0) {
        console.log('AppleMap: Adding barber markers...');
        const annotations = nearbyBarbers.map((barber) => {
          const annotation = new window.mapkit.MarkerAnnotation(
            new window.mapkit.Coordinate(barber.lat, barber.lng),
            {
              color: '#EF4444',
              glyphColor: '#FFFFFF',
              title: barber.name,
              subtitle: `${barber.specialty} • ${barber.price}`
            }
          );

          annotation.addEventListener('select', () => {
            console.log('Barber marker selected:', barber.name);
            onBarberSelect(barber);
          });

          return annotation;
        });

        map.current.addAnnotations(annotations);
        console.log('AppleMap: Added', annotations.length, 'barber markers');
      }

      // Add user location marker if available
      if (userLocation) {
        const userAnnotation = new window.mapkit.MarkerAnnotation(
          new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
          {
            color: '#007AFF',
            title: 'Your Location'
          }
        );
        map.current.addAnnotation(userAnnotation);
        console.log('AppleMap: Added user location marker');
      }

    } catch (mapError) {
      console.error('AppleMap: Error creating map:', mapError);
    }

    return () => {
      if (map.current) {
        try {
          console.log('AppleMap: Cleaning up map...');
          map.current.destroy();
          map.current = null;
        } catch (error) {
          console.warn('AppleMap: Error during cleanup:', error);
        }
      }
    };
  }, [mapkitLoaded, userLocation, nearbyBarbers, onBarberSelect]);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <p>No Apple Maps API key available</p>
          <p className="text-sm text-gray-400 mt-2">Please check your configuration</p>
        </div>
      </div>
    );
  }

  if (mapkitError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center max-w-md p-4">
          <p className="text-red-400 font-semibold">Failed to load Apple Maps</p>
          <p className="text-sm text-gray-400 mt-2">{mapkitError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!mapkitLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Loading Apple Maps...</span>
          </div>
          <p className="text-sm text-gray-400 text-center">
            This may take a few seconds on first load
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full rounded-lg overflow-hidden bg-gray-100" 
        style={{ 
          minHeight: '300px',
          width: '100%',
          height: '100%'
        }}
      />
      {geoError && (
        <div className="absolute top-4 left-4 right-4 bg-red-600/90 text-white p-3 rounded-lg text-sm z-10">
          Location access denied. Showing default location (Houston, TX).
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
