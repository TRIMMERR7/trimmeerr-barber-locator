
import { useRef, useEffect } from 'react';
import { createMapConfig, getDefaultCenter } from '@/utils/appleMapConfig';

interface UseAppleMapInitializationProps {
  mapkitLoaded: boolean;
  mapContainer: React.RefObject<HTMLDivElement>;
  userLocation: [number, number] | null;
}

export const useAppleMapInitialization = ({ 
  mapkitLoaded, 
  mapContainer, 
  userLocation 
}: UseAppleMapInitializationProps) => {
  const map = useRef<any>(null);

  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current || map.current) {
      console.log('AppleMap: Skipping initialization - mapkitLoaded:', mapkitLoaded, 'container:', !!mapContainer.current, 'existing map:', !!map.current);
      return;
    }

    console.log('AppleMap: Initializing Apple Maps...');

    try {
      const center = userLocation 
        ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
        : getDefaultCenter();

      console.log('AppleMap: Using center:', center);

      const mapConfig = createMapConfig(center);
      console.log('AppleMap: Creating map with config:', mapConfig);

      map.current = new window.mapkit.Map(mapContainer.current, mapConfig);

      console.log('AppleMap: Map initialized successfully');

      // Add load event listener to confirm map is ready
      map.current.addEventListener('load', () => {
        console.log('AppleMap: Map load event fired - map is ready');
      });

    } catch (error) {
      console.error('AppleMap: Error initializing map:', error);
      map.current = null;
    }

    return () => {
      if (map.current) {
        try {
          console.log('AppleMap: Cleaning up map...');
          map.current.destroy();
        } catch (error) {
          console.warn('AppleMap: Error cleaning up map:', error);
        } finally {
          map.current = null;
        }
      }
    };
  }, [mapkitLoaded, userLocation]);

  return { map };
};
