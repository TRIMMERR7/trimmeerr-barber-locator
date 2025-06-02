
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
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current || mapInitialized || !apiKey) {
      return;
    }

    console.log('MapInstance: Starting map initialization...');

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : new window.mapkit.Coordinate(29.7604, -95.3698);

    try {
      map.current = new window.mapkit.Map(mapContainer.current, {
        center: center,
        region: new window.mapkit.CoordinateRegion(
          center,
          new window.mapkit.CoordinateSpan(0.01, 0.01)
        ),
        mapType: window.mapkit.Map.MapTypes.Standard,
        showsMapTypeControl: false,
        showsZoomControl: true,
        showsUserLocationControl: false,
        showsCompass: window.mapkit.FeatureVisibility.Hidden,
        showsScale: window.mapkit.FeatureVisibility.Hidden,
        isRotationEnabled: true,
        isScrollEnabled: true,
        isZoomEnabled: true,
        showsPointsOfInterest: false,
        colorScheme: window.mapkit.Map.ColorSchemes.Light
      });

      // Wait for map to be fully loaded before proceeding
      map.current.addEventListener('region-change-end', () => {
        if (!mapReady) {
          console.log('MapInstance: Map is ready for annotations');
          setMapReady(true);
        }
      });

      // Set initial state
      setMapInitialized(true);
      
      // Trigger an initial region change to activate the ready state
      setTimeout(() => {
        if (map.current && !mapReady) {
          setMapReady(true);
        }
      }, 500);

      console.log('MapInstance: Map initialized successfully');

    } catch (error) {
      console.error('MapInstance: Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        try {
          console.log('MapInstance: Cleaning up map...');
          map.current = null;
          setMapInitialized(false);
          setMapReady(false);
        } catch (error) {
          console.error('MapInstance: Error during cleanup:', error);
        }
      }
    };
  }, [mapkitLoaded, apiKey]);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      
      {mapInitialized && mapReady && (
        <MapAnnotations
          map={map.current}
          userLocation={userLocation}
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
          mapReady={mapReady}
        />
      )}
      
      {(!mapInitialized || !mapReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900/90 to-black/90 rounded-lg z-50">
          <div className="text-white text-center">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-red-300/30 mx-auto"></div>
            </div>
            <div className="text-lg font-semibold mb-2">Loading Map</div>
            <div className="text-sm text-gray-300">
              {!mapkitLoaded && "Loading MapKit..."}
              {mapkitLoaded && !mapInitialized && "Initializing map..."}
              {mapInitialized && !mapReady && "Preparing markers..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInstance;
