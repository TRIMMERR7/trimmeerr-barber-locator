
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

  console.log('MapInstance: Component state:', {
    mapkitLoaded,
    hasApiKey: !!apiKey,
    hasMapContainer: !!mapContainer.current,
    mapInitialized,
    mapReady,
    userLocation,
    barbersCount: nearbyBarbers.length
  });

  // Initialize map
  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current || mapInitialized || !apiKey) {
      console.log('MapInstance: Skipping initialization:', {
        mapkitLoaded,
        hasMapContainer: !!mapContainer.current,
        mapInitialized,
        hasApiKey: !!apiKey
      });
      return;
    }

    console.log('MapInstance: Starting map initialization...');

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : new window.mapkit.Coordinate(29.7604, -95.3698);

    console.log('MapInstance: Creating map with center:', center);

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

      console.log('MapInstance: Map object created:', !!map.current);

      // Enhanced map ready detection
      let readyTimeoutId: NodeJS.Timeout;
      const checkMapReady = () => {
        console.log('MapInstance: Map ready check triggered');
        if (map.current && map.current.element) {
          console.log('MapInstance: Map is ready for annotations');
          setMapReady(true);
          clearTimeout(readyTimeoutId);
        }
      };

      // Multiple ways to detect when map is ready
      map.current.addEventListener('region-change-end', checkMapReady);
      map.current.addEventListener('configuration-change', checkMapReady);
      
      // Immediate check in case map is already ready
      setTimeout(checkMapReady, 100);
      
      // Fallback timeout
      readyTimeoutId = setTimeout(() => {
        console.log('MapInstance: Map ready timeout - forcing ready state');
        setMapReady(true);
      }, 2000);

      setMapInitialized(true);
      console.log('MapInstance: Map initialized successfully');

      // Force a redraw after initialization
      setTimeout(() => {
        if (map.current && typeof map.current.redraw === 'function') {
          console.log('MapInstance: Forcing map redraw');
          map.current.redraw();
        }
      }, 500);

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
      console.log('MapInstance: Zoom in clicked');
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
      console.log('MapInstance: Zoom out clicked');
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
    <div className="w-full h-full relative bg-gray-100">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full rounded-lg bg-gray-200"
      />
      
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
            <div className="text-xs text-gray-500 mt-2">
              Debug: MapKit={mapkitLoaded ? 'OK' : 'Loading'}, 
              Init={mapInitialized ? 'OK' : 'Pending'}, 
              Ready={mapReady ? 'OK' : 'Pending'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapInstance;
