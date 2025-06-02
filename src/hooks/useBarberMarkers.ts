
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
    console.log('useBarberMarkers: Effect triggered');
    console.log('useBarberMarkers: map.current exists?', !!map.current);
    console.log('useBarberMarkers: nearbyBarbers length:', nearbyBarbers.length);

    if (!map.current) {
      console.log('useBarberMarkers: No map available, exiting');
      return;
    }

    if (!nearbyBarbers.length) {
      console.log('useBarberMarkers: No barbers available, exiting');
      return;
    }

    console.log('useBarberMarkers: Adding red barber markers...', nearbyBarbers.length, 'barbers');

    // Clear existing markers
    if (barberAnnotations.current.length > 0) {
      try {
        console.log('useBarberMarkers: Removing', barberAnnotations.current.length, 'existing markers');
        map.current.removeAnnotations(barberAnnotations.current);
      } catch (error) {
        console.warn('Error removing previous barber annotations:', error);
      }
    }

    const annotations = nearbyBarbers.map((barber) => {
      console.log('useBarberMarkers: Creating red marker for barber:', barber.name, 'at', barber.lat, barber.lng);

      // Create a simple red marker without custom styling first
      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          color: '#ff0000', // Pure red
          title: barber.name,
          subtitle: `${barber.specialty} • ${barber.price} • ⭐ ${barber.rating}`,
          data: barber
        }
      );

      // Add click handler
      annotation.addEventListener('select', () => {
        console.log('useBarberMarkers: Red barber marker selected:', barber.name);
        onBarberSelect(barber);
      });

      return annotation;
    });

    barberAnnotations.current = annotations;
    console.log('useBarberMarkers: Created', annotations.length, 'annotations');
    
    try {
      map.current.addAnnotations(annotations);
      console.log('useBarberMarkers: All red barber markers added successfully to map');
      
      // Force a refresh of the map view
      if (annotations.length > 0) {
        const firstBarber = nearbyBarbers[0];
        map.current.setCenterAnimated(
          new window.mapkit.Coordinate(firstBarber.lat, firstBarber.lng),
          true
        );
      }
    } catch (error) {
      console.error('useBarberMarkers: Error adding annotations to map:', error);
    }

    return () => {
      if (map.current && barberAnnotations.current.length > 0) {
        try {
          console.log('useBarberMarkers: Cleanup - removing', barberAnnotations.current.length, 'markers');
          map.current.removeAnnotations(barberAnnotations.current);
        } catch (error) {
          console.warn('Error removing barber annotations during cleanup:', error);
        } finally {
          barberAnnotations.current = [];
        }
      }
    };
  }, [map, nearbyBarbers, onBarberSelect]);

  return { barberAnnotations };
};
