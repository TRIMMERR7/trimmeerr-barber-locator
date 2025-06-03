
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
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current) {
      console.log('AppleMap: Skipping initialization - mapkitLoaded:', mapkitLoaded, 'container:', !!mapContainer.current);
      return;
    }

    if (map.current || isInitializing.current) {
      console.log('AppleMap: Map already exists or is initializing, skipping');
      return;
    }

    console.log('AppleMap: Initializing Apple Maps...');
    isInitializing.current = true;

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
        isInitializing.current = false;
      });

      // Fallback in case load event doesn't fire
      setTimeout(() => {
        isInitializing.current = false;
      }, 2000);

    } catch (error) {
      console.error('AppleMap: Error initializing map:', error);
      map.current = null;
      isInitializing.current = false;
    }

    return () => {
      if (map.current) {
        try {
          console.log('AppleMap: Cleaning up map...');
          // Remove all annotations before destroying
          if (map.current.annotations && map.current.annotations.length > 0) {
            map.current.removeAnnotations(map.current.annotations);
          }
          map.current.destroy();
        } catch (error) {
          console.warn('AppleMap: Error cleaning up map:', error);
        } finally {
          map.current = null;
          isInitializing.current = false;
        }
      }
    };
  }, [mapkitLoaded, userLocation]);

  return { map };
};
