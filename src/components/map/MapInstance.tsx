
import React, { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import MapAnnotations from './MapAnnotations';
import { Barber } from '@/types/barber';

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
        showsZoomControl: false,
        showsUserLocationControl: false,
        showsCompass: window.mapkit.FeatureVisibility.Hidden,
        showsScale: window.mapkit.FeatureVisibility.Hidden,
        isRotationEnabled: true,
        isScrollEnabled: true,
        isZoomEnabled: true,
        showsPointsOfInterest: true,
        colorScheme: window.mapkit.Map.ColorSchemes.Light
      });

      // Enhanced map ready detection
      let readyTimeoutId: number;
      const checkMapReady = () => {
        if (map.current && map.current.element) {
          console.log('MapInstance: Map is ready for annotations');
          setMapReady(true);
          clearTimeout(readyTimeoutId);
        }
      };

      // Multiple ways to detect when map is ready
      map.current.addEventListener('region-change-end', checkMapReady);
      map.current.addEventListener('configuration-change', checkMapReady);
      
      // Fallback timeout
      readyTimeoutId = setTimeout(() => {
        console.log('MapInstance: Map ready timeout - forcing ready state');
        setMapReady(true);
      }, 1000);

      setMapInitialized(true);
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
  }, [mapkitLoaded, apiKey, userLocation]);

  const handleZoomIn = () => {
    if (map.current) {
      const currentRegion = map.current.region;
      const newSpan = new window.mapkit.CoordinateSpan(
        currentRegion.span.latitudeDelta * 0.5,
        currentRegion.span.longitudeDelta * 0.5
      );
      const newRegion = new window.mapkit.CoordinateRegion(currentRegion.center, newSpan);
      map.current.setRegionAnimated(newRegion, true);
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      const currentRegion = map.current.region;
      const newSpan = new window.mapkit.CoordinateSpan(
        currentRegion.span.latitudeDelta * 2,
        currentRegion.span.longitudeDelta * 2
      );
      const newRegion = new window.mapkit.CoordinateRegion(currentRegion.center, newSpan);
      map.current.setRegionAnimated(newRegion, true);
    }
  };

  return (
    <div className="h-full relative bg-gray-100">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg bg-gray-200" />
      
      {/* Custom Zoom Controls */}
      {mapInitialized && (
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800"
            aria-label="Zoom in"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800"
            aria-label="Zoom out"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
        </div>
      )}
      
      {mapInitialized && (
        <MapAnnotations
          map={map.current}
          userLocation={userLocation}
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={onBarberSelect}
          mapReady={mapReady}
        />
      )}
      
      {(!mapInitialized || !mapReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100/90 to-gray-200/90 rounded-lg z-50">
          <div className="text-gray-800 text-center">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-red-300/30 mx-auto"></div>
            </div>
            <div className="text-lg font-semibold mb-2">Loading Apple Maps</div>
            <div className="text-sm text-gray-600">
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
