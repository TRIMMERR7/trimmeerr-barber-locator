
import React, { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapAnnotations from './MapAnnotations';

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

interface MapInstanceProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  mapkitLoaded: boolean;
  apiKey: string;
}

const MapInstance = ({ nearbyBarbers, onBarberSelect, mapkitLoaded, apiKey }: MapInstanceProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const { userLocation } = useGeolocation();
  const [mapInitialized, setMapInitialized] = useState(false);

  // Initialize map
  useEffect(() => {
    console.log('MapInstance: useEffect triggered', {
      mapkitLoaded,
      hasContainer: !!mapContainer.current,
      mapInitialized,
      hasApiKey: !!apiKey
    });

    if (!mapkitLoaded || !mapContainer.current || mapInitialized || !apiKey) {
      console.log('MapInstance: Skipping initialization - conditions not met');
      return;
    }

    console.log('MapInstance: Starting map initialization...');

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : new window.mapkit.Coordinate(29.7604, -95.3698);

    try {
      console.log('MapInstance: Creating map with center:', center);
      
      map.current = new window.mapkit.Map(mapContainer.current, {
        center: center,
        region: new window.mapkit.CoordinateRegion(
          center,
          new window.mapkit.CoordinateSpan(0.005, 0.005)
        ),
        mapType: window.mapkit.Map.MapTypes.Standard,
        showsMapTypeControl: true,
        showsZoomControl: true,
        showsUserLocationControl: true,
        showsCompass: window.mapkit.FeatureVisibility.Visible,
        showsScale: window.mapkit.FeatureVisibility.Visible,
        isRotationEnabled: true,
        isScrollEnabled: true,
        isZoomEnabled: true,
        showsPointsOfInterest: true,
        colorScheme: window.mapkit.Map.ColorSchemes.Light
      });

      console.log('MapInstance: Map object created:', !!map.current);
      console.log('MapInstance: Map methods available:', {
        hasAddAnnotation: typeof map.current?.addAnnotation === 'function',
        hasRemoveAnnotation: typeof map.current?.removeAnnotation === 'function'
      });

      // Add a slight delay to ensure map is fully ready
      setTimeout(() => {
        console.log('MapInstance: Setting mapInitialized to true');
        setMapInitialized(true);
      }, 100);

    } catch (error) {
      console.error('MapInstance: Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        try {
          console.log('MapInstance: Cleaning up map...');
          if (typeof map.current.destroy === 'function') {
            map.current.destroy();
          }
          map.current = null;
          setMapInitialized(false);
        } catch (error) {
          console.error('MapInstance: Error during cleanup:', error);
        }
      }
    };
  }, [mapkitLoaded, userLocation, apiKey]);

  console.log('MapInstance: Rendering with mapInitialized:', mapInitialized);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      <MapAnnotations
        map={map.current}
        userLocation={userLocation}
        nearbyBarbers={nearbyBarbers}
        onBarberSelect={onBarberSelect}
        mapInitialized={mapInitialized}
      />
      
      {!mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg z-50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div>Initializing map...</div>
            <div className="text-sm mt-1">
              MapKit: {mapkitLoaded ? '✓' : '✗'} | 
              API Key: {apiKey ? '✓' : '✗'} | 
              Container: {mapContainer.current ? '✓' : '✗'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInstance;
