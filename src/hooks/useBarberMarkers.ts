
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

    console.log('useBarberMarkers: Adding barber markers...', nearbyBarbers.length, 'barbers');

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
      console.log('useBarberMarkers: Creating marker for barber:', barber.name, 'at', barber.lat, barber.lng);

      // Create marker annotation with correct Apple MapKit API
      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          color: '#EF4444', // Red color
          glyphColor: '#FFFFFF', // White glyph
          title: barber.name,
          subtitle: `${barber.specialty} • ${barber.price}`,
          data: { barber }
        }
      );

      // Add selection event listener
      annotation.addEventListener('select', (event) => {
        console.log('useBarberMarkers: Barber marker selected:', barber.name);
        onBarberSelect(barber);
      });

      // Add deselect event for debugging
      annotation.addEventListener('deselect', () => {
        console.log('useBarberMarkers: Barber marker deselected:', barber.name);
      });

      return annotation;
    });

    barberAnnotations.current = annotations;
    console.log('useBarberMarkers: Created', annotations.length, 'annotations');
    
    try {
      map.current.addAnnotations(annotations);
      console.log('useBarberMarkers: All barber markers added successfully to map');
      
      // Set initial region to show the barbers
      if (annotations.length > 0) {
        const coordinates = nearbyBarbers.map(barber => 
          new window.mapkit.Coordinate(barber.lat, barber.lng)
        );
        
        // Create a region that includes all barber locations
        const region = window.mapkit.CoordinateRegion.regionFittingCoordinates(coordinates);
        map.current.setRegionAnimated(region, true);
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
