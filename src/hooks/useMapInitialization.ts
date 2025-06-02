
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
    console.log('useMapInitialization: Effect triggered with:', {
      mapkitLoaded,
      hasApiKey: !!apiKey,
      hasContainer: !!mapContainer.current,
      alreadyInitialized: initialized.current,
      hasExistingMap: !!map.current
    });

    // Only initialize once when all prerequisites are met
    if (!mapkitLoaded || !apiKey || !mapContainer.current || initialized.current) {
      console.log('useMapInitialization: Skipping initialization - missing prerequisites or already initialized');
      return;
    }

    console.log('useMapInitialization: Starting one-time initialization...');
    initialized.current = true;

    try {
      // Verify MapKit is available
      if (!window.mapkit) {
        throw new Error('MapKit not available on window object');
      }

      // Determine center location
      const centerLat = userLocation ? userLocation[0] : 29.7604;
      const centerLng = userLocation ? userLocation[1] : -95.3698;
      
      const center = new window.mapkit.Coordinate(centerLat, centerLng);

      console.log('useMapInitialization: Creating map with center:', { centerLat, centerLng });
      console.log('useMapInitialization: Container element:', mapContainer.current);

      // Create the map with explicit configuration
      const mapInstance = new window.mapkit.Map(mapContainer.current, {
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

      if (!mapInstance) {
        throw new Error('Failed to create map instance');
      }

      map.current = mapInstance;
      console.log('useMapInitialization: Map created successfully:', mapInstance);
      
      // Set states
      setMapInitialized(true);
      
      // Mark as ready after a brief delay to ensure map is fully rendered
      setTimeout(() => {
        console.log('useMapInitialization: Map is ready');
        setMapReady(true);
      }, 500);

    } catch (error) {
      console.error('useMapInitialization: Error creating map:', error);
      console.error('useMapInitialization: Error details:', {
        message: error.message,
        stack: error.stack,
        windowMapkit: !!window.mapkit,
        container: mapContainer.current
      });
      initialized.current = false;
      setMapInitialized(false);
      setMapReady(false);
    }

    // Cleanup function
    return () => {
      console.log('useMapInitialization: Cleanup triggered');
      if (map.current) {
        try {
          console.log('useMapInitialization: Destroying map instance');
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
      console.log('useMapInitialization: Updating map center to user location:', userLocation);
      try {
        const center = new window.mapkit.Coordinate(userLocation[0], userLocation[1]);
        const region = new window.mapkit.CoordinateRegion(
          center,
          new window.mapkit.CoordinateSpan(0.01, 0.01)
        );
        map.current.setRegionAnimated(region, true);
        console.log('useMapInitialization: Map center updated successfully');
      } catch (error) {
        console.warn('useMapInitialization: Error updating map center:', error);
      }
    }
  }, [userLocation, mapReady]);

  console.log('useMapInitialization: Returning state:', {
    hasMap: !!map.current,
    mapInitialized,
    mapReady
  });

  return {
    map: map.current,
    mapInitialized,
    mapReady
  };
};
