
import { useRef, useEffect } from 'react';

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

interface UseBarberMarkersProps {
  map: React.MutableRefObject<any>;
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

export const useBarberMarkers = ({ map, nearbyBarbers, onBarberSelect }: UseBarberMarkersProps) => {
  const barberAnnotations = useRef<any[]>([]);

  useEffect(() => {
    if (!map.current || !nearbyBarbers.length) return;

    console.log('AppleMap: Adding red barber markers...', nearbyBarbers.length, 'barbers');

    if (barberAnnotations.current.length > 0) {
      try {
        map.current.removeAnnotations(barberAnnotations.current);
      } catch (error) {
        console.warn('Error removing previous barber annotations:', error);
      }
    }

    const annotations = nearbyBarbers.map((barber) => {
      console.log('AppleMap: Creating red marker for barber:', barber.name);

      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          color: '#dc2626', // Strong red color
          title: `${barber.name} - ${barber.price}`,
          subtitle: `${barber.specialty} • ${barber.distance} • ⭐ ${barber.rating}`,
          data: barber,
          glyphColor: '#ffffff',
          selectedGlyphColor: '#ffffff'
        }
      );

      // Add click handler
      annotation.addEventListener('select', () => {
        console.log('AppleMap: Red barber marker selected:', barber.name);
        onBarberSelect(barber);
      });

      return annotation;
    });

    barberAnnotations.current = annotations;
    map.current.addAnnotations(annotations);

    console.log('AppleMap: All red barber markers added successfully');

    return () => {
      if (map.current && barberAnnotations.current.length > 0) {
        try {
          map.current.removeAnnotations(barberAnnotations.current);
        } catch (error) {
          console.warn('Error removing barber annotations during cleanup:', error);
        } finally {
          barberAnnotations.current = [];
        }
      }
    };
  }, [nearbyBarbers, onBarberSelect]);

  return { barberAnnotations };
};
