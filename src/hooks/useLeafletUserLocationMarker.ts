
import { useRef, useEffect } from 'react';
import L from 'leaflet';
import { createUserLocationMarker } from '@/utils/mapMarkers';

interface UseLeafletUserLocationMarkerProps {
  map: React.MutableRefObject<L.Map | null>;
  userLocation: [number, number] | null;
}

export const useLeafletUserLocationMarker = ({ map, userLocation }: UseLeafletUserLocationMarkerProps) => {
  const userMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      map.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    // Add new user marker if location is available
    if (userLocation) {
      console.log('useLeafletUserLocationMarker: Adding user location marker');
      const marker = createUserLocationMarker(userLocation[0], userLocation[1]);
      marker.addTo(map.current);
      userMarkerRef.current = marker;

      // Center map on user location
      map.current.setView([userLocation[0], userLocation[1]], 14);
    }

    return () => {
      if (userMarkerRef.current && map.current) {
        map.current.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
    };
  }, [map, userLocation]);

  return { userMarker: userMarkerRef };
};
