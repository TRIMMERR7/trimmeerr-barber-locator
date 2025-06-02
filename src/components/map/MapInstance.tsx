
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
    if (!mapkitLoaded || !mapContainer.current || mapInitialized || !apiKey) return;

    console.log('Initializing Apple Maps...');

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : new window.mapkit.Coordinate(29.7604, -95.3698);

    try {
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

      setMapInitialized(true);
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        try {
          console.log('Cleaning up map...');
          if (typeof map.current.destroy === 'function') {
            map.current.destroy();
          }
          map.current = null;
          setMapInitialized(false);
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }, [mapkitLoaded, userLocation, apiKey]);

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
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
          <div className="text-white">Initializing map...</div>
        </div>
      )}
    </div>
  );
};

export default MapInstance;
