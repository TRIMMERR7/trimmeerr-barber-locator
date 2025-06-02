
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
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize once when all prerequisites are met
    if (!mapkitLoaded || !apiKey || !mapContainer.current || initialized.current) {
      return;
    }

    console.log('useMapInitialization: Starting one-time initialization...');
    initialized.current = true;

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
      
      // Mark as ready after a brief delay
      setTimeout(() => {
        console.log('useMapInitialization: Map is ready');
        setMapReady(true);
      }, 300);

    } catch (error) {
      console.error('useMapInitialization: Error creating map:', error);
      initialized.current = false;
      setMapInitialized(false);
      setMapReady(false);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        try {
          console.log('useMapInitialization: Cleaning up map');
          map.current.destroy();
        } catch (error) {
          console.warn('useMapInitialization: Error destroying map:', error);
        }
        map.current = null;
      }
      setMapInitialized(false);
      setMapReady(false);
      initialized.current = false;
    };
  }, [mapkitLoaded, apiKey]); // Only depend on essential props

  // Update map center when user location changes (without re-initializing)
  useEffect(() => {
    if (map.current && userLocation && mapReady) {
      console.log('useMapInitialization: Updating map center to user location');
      try {
        const center = new window.mapkit.Coordinate(userLocation[0], userLocation[1]);
        const region = new window.mapkit.CoordinateRegion(
          center,
          new window.mapkit.CoordinateSpan(0.01, 0.01)
        );
        map.current.setRegionAnimated(region, true);
      } catch (error) {
        console.warn('useMapInitialization: Error updating map center:', error);
      }
    }
  }, [userLocation, mapReady]);

  return {
    map: map.current,
    mapInitialized,
    mapReady
  };
};
