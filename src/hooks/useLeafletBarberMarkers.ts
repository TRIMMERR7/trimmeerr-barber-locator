
import { useRef, useEffect } from 'react';
import L from 'leaflet';
import { createBarberMarker } from '@/utils/mapMarkers';

interface Barber {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string;
  price: string;
  distance: string;
  experience: string;
  lat: number;
  lng: number;
}

interface UseLeafletBarberMarkersProps {
  map: React.MutableRefObject<L.Map | null>;
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

export const useLeafletBarberMarkers = ({ map, nearbyBarbers, onBarberSelect }: UseLeafletBarberMarkersProps) => {
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!map.current) {
      console.log('useLeafletBarberMarkers: No map available');
      return;
    }

    if (!nearbyBarbers || nearbyBarbers.length === 0) {
      console.log('useLeafletBarberMarkers: No barbers available');
      return;
    }

    console.log('useLeafletBarberMarkers: Adding', nearbyBarbers.length, 'barber markers');

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (map.current) {
        map.current.removeLayer(marker);
      }
    });
    markersRef.current = [];

    // Add new markers
    const newMarkers = nearbyBarbers.map(barber => {
      const marker = createBarberMarker(barber, onBarberSelect);
      if (map.current) {
        marker.addTo(map.current);
      }
      return marker;
    });

    markersRef.current = newMarkers;

    // Fit map to show all markers if we have barbers
    if (nearbyBarbers.length > 0 && map.current) {
      const group = new L.FeatureGroup(newMarkers);
      const bounds = group.getBounds();
      if (bounds.isValid()) {
        map.current.fitBounds(bounds.pad(0.1));
      }
    }

    return () => {
      markersRef.current.forEach(marker => {
        if (map.current) {
          map.current.removeLayer(marker);
        }
      });
      markersRef.current = [];
    };
  }, [map, nearbyBarbers, onBarberSelect]);

  return { markers: markersRef };
};
