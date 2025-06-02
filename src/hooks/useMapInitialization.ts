
import { useEffect, useRef, useState } from 'react';

interface UseMapInitializationProps {
  mapkitLoaded: boolean;
  apiKey: string;
  userLocation: [number, number] | null;
  mapContainer: React.RefObject<HTMLDivElement>;
}

export const useMapInitialization = ({
  mapkitLoaded,
  apiKey,
  userLocation,
  mapContainer
}: UseMapInitializationProps) => {
  const map = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const initializationAttempted = useRef(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (!mapkitLoaded || !mapContainer.current || !apiKey || initializationAttempted.current) {
      console.log('useMapInitialization: Skipping initialization:', {
        mapkitLoaded,
        hasMapContainer: !!mapContainer.current,
        hasApiKey: !!apiKey,
        alreadyAttempted: initializationAttempted.current
      });
      return;
    }

    console.log('useMapInitialization: Starting map initialization...');
    initializationAttempted.current = true;

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : new window.mapkit.Coordinate(29.7604, -95.3698);

    console.log('useMapInitialization: Creating map with center:', center);

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

      console.log('useMapInitialization: Map object created:', !!map.current);

      // Set map as initialized immediately
      setMapInitialized(true);
      
      // Set map as ready after a short delay to ensure it's fully loaded
      setTimeout(() => {
        console.log('useMapInitialization: Setting map as ready');
        setMapReady(true);
      }, 1000);

      console.log('useMapInitialization: Map initialized successfully');

    } catch (error) {
      console.error('useMapInitialization: Error initializing map:', error);
      initializationAttempted.current = false; // Reset on error to allow retry
    }

    // Cleanup function
    return () => {
      if (map.current) {
        try {
          console.log('useMapInitialization: Cleaning up map...');
          map.current.destroy();
          map.current = null;
        } catch (error) {
          console.error('useMapInitialization: Error during cleanup:', error);
        }
      }
      setMapInitialized(false);
      setMapReady(false);
      initializationAttempted.current = false;
    };
  }, [mapkitLoaded, apiKey]); // Removed mapContainer and userLocation from dependencies to prevent re-initialization

  return {
    map: map.current,
    mapInitialized,
    mapReady
  };
};
