
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
    if (!mapkitLoaded || !mapContainer.current) return;

    console.log('AppleMap: Initializing Apple Maps with dark mode...');

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : getDefaultCenter();

    const mapConfig = createMapConfig(center);
    map.current = new window.mapkit.Map(mapContainer.current, mapConfig);

    console.log('AppleMap: Map initialized with dark mode');

    return () => {
      if (map.current) {
        try {
          map.current.destroy();
        } catch (error) {
          console.warn('Error cleaning up map:', error);
        } finally {
          map.current = null;
        }
      }
    };
  }, [mapkitLoaded, userLocation]);

  return { map };
};
