
import { useRef, useEffect } from 'react';
import { createBarberAnnotation, setMapRegionForBarbers } from '@/utils/mapAnnotations';

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
      console.log('useBarberMarkers: No barbers available, clearing existing markers');
      // Clear existing markers if no barbers
      if (barberAnnotations.current.length > 0) {
        try {
          console.log('useBarberMarkers: Removing existing markers');
          // Only remove annotations that are actually on the map
          const attachedAnnotations = barberAnnotations.current.filter(annotation => {
            try {
              return map.current.annotations.includes(annotation);
            } catch (e) {
              return false;
            }
          });
          if (attachedAnnotations.length > 0) {
            map.current.removeAnnotations(attachedAnnotations);
          }
          barberAnnotations.current = [];
        } catch (error) {
          console.warn('Error removing barber annotations:', error);
          barberAnnotations.current = [];
        }
      }
      return;
    }

    console.log('useBarberMarkers: Adding barber markers...', nearbyBarbers.length, 'barbers');

    // Clear existing markers safely
    if (barberAnnotations.current.length > 0) {
      try {
        console.log('useBarberMarkers: Removing', barberAnnotations.current.length, 'existing markers');
        // Only remove annotations that are actually attached to the map
        const attachedAnnotations = barberAnnotations.current.filter(annotation => {
          try {
            return map.current.annotations && map.current.annotations.includes(annotation);
          } catch (e) {
            return false;
          }
        });
        
        if (attachedAnnotations.length > 0) {
          map.current.removeAnnotations(attachedAnnotations);
        }
      } catch (error) {
        console.warn('Error removing previous barber annotations:', error);
      }
    }

    // Create new annotations
    const annotations = nearbyBarbers.map((barber) => {
      console.log('useBarberMarkers: Creating marker for barber:', barber.name, 'at', barber.lat, barber.lng);
      return createBarberAnnotation(barber, onBarberSelect);
    });

    barberAnnotations.current = annotations;
    console.log('useBarberMarkers: Created', annotations.length, 'annotations');
    
    try {
      map.current.addAnnotations(annotations);
      console.log('useBarberMarkers: All barber markers added successfully to map');
      
      // Set the map region to show all barbers with a slight delay to ensure map is ready
      setTimeout(() => {
        if (map.current && nearbyBarbers.length > 0) {
          setMapRegionForBarbers(map.current, nearbyBarbers);
        }
      }, 500);
    } catch (error) {
      console.error('useBarberMarkers: Error adding annotations to map:', error);
    }

    return () => {
      if (map.current && barberAnnotations.current.length > 0) {
        try {
          console.log('useBarberMarkers: Cleanup - removing', barberAnnotations.current.length, 'markers');
          // Only remove annotations that are actually attached
          const attachedAnnotations = barberAnnotations.current.filter(annotation => {
            try {
              return map.current.annotations && map.current.annotations.includes(annotation);
            } catch (e) {
              return false;
            }
          });
          
          if (attachedAnnotations.length > 0) {
            map.current.removeAnnotations(attachedAnnotations);
          }
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
