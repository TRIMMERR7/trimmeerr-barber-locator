
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

  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current || mapInitialized || !apiKey) {
      console.log('useMapInitialization: Skipping initialization:', {
        mapkitLoaded,
        hasMapContainer: !!mapContainer.current,
        mapInitialized,
        hasApiKey: !!apiKey
      });
      return;
    }

    console.log('useMapInitialization: Starting map initialization...');

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

      // Enhanced map ready detection
      let readyTimeoutId: NodeJS.Timeout;
      const checkMapReady = () => {
        console.log('useMapInitialization: Map ready check triggered');
        if (map.current && map.current.element) {
          console.log('useMapInitialization: Map is ready for annotations');
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
        console.log('useMapInitialization: Map ready timeout - forcing ready state');
        setMapReady(true);
      }, 2000);

      setMapInitialized(true);
      console.log('useMapInitialization: Map initialized successfully');

      // Force a redraw after initialization
      setTimeout(() => {
        if (map.current && typeof map.current.redraw === 'function') {
          console.log('useMapInitialization: Forcing map redraw');
          map.current.redraw();
        }
      }, 500);

    } catch (error) {
      console.error('useMapInitialization: Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        try {
          console.log('useMapInitialization: Cleaning up map...');
          map.current = null;
          setMapInitialized(false);
          setMapReady(false);
        } catch (error) {
          console.error('useMapInitialization: Error during cleanup:', error);
        }
      }
    };
  }, [mapkitLoaded, apiKey, userLocation, mapContainer, mapInitialized]);

  return {
    map: map.current,
    mapInitialized,
    mapReady
  };
};
