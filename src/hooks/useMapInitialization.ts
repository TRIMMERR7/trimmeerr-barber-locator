
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
    // Reset states when dependencies change
    if (!mapkitLoaded || !apiKey) {
      console.log('useMapInitialization: Prerequisites not met');
      setMapInitialized(false);
      setMapReady(false);
      initializationAttempted.current = false;
      return;
    }

    // Don't initialize if already attempted or no container
    if (initializationAttempted.current || !mapContainer.current) {
      console.log('useMapInitialization: Skipping - already attempted or no container');
      return;
    }

    console.log('useMapInitialization: Starting initialization...');
    initializationAttempted.current = true;

    try {
      // Determine center location
      const centerLat = userLocation ? userLocation[0] : 29.7604;
      const centerLng = userLocation ? userLocation[1] : -95.3698;
      
      const center = new window.mapkit.Coordinate(centerLat, centerLng);

      console.log('useMapInitialization: Creating map with center:', { centerLat, centerLng });

      // Create the map
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

      console.log('useMapInitialization: Map created successfully');
      
      // Set states
      setMapInitialized(true);
      
      // Small delay before marking as ready
      const readyTimer = setTimeout(() => {
        console.log('useMapInitialization: Map is ready');
        setMapReady(true);
      }, 500);

      // Cleanup function
      return () => {
        clearTimeout(readyTimer);
        if (map.current) {
          try {
            console.log('useMapInitialization: Destroying map');
            map.current.destroy();
          } catch (error) {
            console.warn('useMapInitialization: Error destroying map:', error);
          }
          map.current = null;
        }
        setMapInitialized(false);
        setMapReady(false);
        initializationAttempted.current = false;
      };
    } catch (error) {
      console.error('useMapInitialization: Error creating map:', error);
      setMapInitialized(false);
      setMapReady(false);
      initializationAttempted.current = false;
    }
  }, [mapkitLoaded, apiKey, mapContainer]); // Removed userLocation from deps to prevent re-init

  return {
    map: map.current,
    mapInitialized,
    mapReady
  };
};
