
import React, { useEffect, useRef } from 'react';
import { createCustomBarberMarker } from './utils/markerUtils';

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

interface MapAnnotationsProps {
  map: any;
  userLocation: [number, number] | null;
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  mapInitialized: boolean;
}

const MapAnnotations = ({ 
  map, 
  userLocation, 
  nearbyBarbers, 
  onBarberSelect, 
  mapInitialized 
}: MapAnnotationsProps) => {
  const userAnnotationRef = useRef<any>(null);
  const barberAnnotationsRef = useRef<any[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enhanced helper function to check if map is ready for annotations
  const isMapReadyForAnnotations = (mapInstance: any): boolean => {
    if (!mapInstance || !mapInitialized) {
      return false;
    }
    
    if (typeof window === 'undefined' || !window.mapkit) {
      return false;
    }
    
    try {
      // Check if map has essential methods and is not in a destroyed state
      const hasRequiredMethods = (
        typeof mapInstance.addAnnotation === 'function' &&
        typeof mapInstance.removeAnnotation === 'function' &&
        typeof mapInstance.addAnnotations === 'function' &&
        typeof mapInstance.removeAnnotations === 'function' &&
        typeof mapInstance.setRegionAnimated === 'function'
      );

      // Check if map is properly initialized (not destroyed)
      const isMapValid = mapInstance._map !== null && mapInstance._map !== undefined;

      return hasRequiredMethods && isMapValid;
    } catch (error) {
      console.error('Error checking map readiness:', error);
      return false;
    }
  };
  
  // Add user location marker (blue) with delay
  useEffect(() => {
    if (!userLocation) {
      return;
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Add a delay to ensure map is fully ready
    timeoutRef.current = setTimeout(() => {
      if (!isMapReadyForAnnotations(map)) {
        console.log('Map not ready for user location marker after delay, skipping...');
        return;
      }
      
      console.log('Adding user location marker at:', userLocation);

      try {
        // Remove existing user annotation if it exists
        if (userAnnotationRef.current && map) {
          console.log('Removing existing user annotation');
          map.removeAnnotation(userAnnotationRef.current);
          userAnnotationRef.current = null;
        }

        const userAnnotation = new window.mapkit.MarkerAnnotation(
          new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
          {
            color: '#007AFF',
            glyphColor: '#FFFFFF',
            title: 'Your Location',
            subtitle: 'Client position',
            displayPriority: 1000
          }
        );

        map.addAnnotation(userAnnotation);
        userAnnotationRef.current = userAnnotation;
        
        const region = new window.mapkit.CoordinateRegion(
          new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
          new window.mapkit.CoordinateSpan(0.005, 0.005)
        );
        map.setRegionAnimated(region, true);

        console.log('User location marker added successfully');
      } catch (error) {
        console.error('Error adding user location marker:', error);
      }
    }, 1000); // 1 second delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (userAnnotationRef.current && map && isMapReadyForAnnotations(map)) {
        try {
          console.log('Cleaning up user annotation');
          map.removeAnnotation(userAnnotationRef.current);
          userAnnotationRef.current = null;
        } catch (error) {
          console.error('Error removing user annotation:', error);
        }
      }
    };
  }, [map, userLocation, mapInitialized]);

  // Add barber markers (red, clickable) with delay
  useEffect(() => {
    if (!nearbyBarbers.length) {
      return;
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Add a delay to ensure map is fully ready
    timeoutRef.current = setTimeout(() => {
      if (!isMapReadyForAnnotations(map)) {
        console.log('Map not ready for barber annotations after delay, skipping...');
        return;
      }
      
      console.log('Adding barber markers for', nearbyBarbers.length, 'barbers');

      try {
        // Remove existing barber annotations
        if (barberAnnotationsRef.current.length > 0 && map) {
          console.log('Removing existing barber annotations');
          map.removeAnnotations(barberAnnotationsRef.current);
          barberAnnotationsRef.current = [];
        }

        const annotations = nearbyBarbers.map((barber) => {
          console.log(`Creating marker for ${barber.name} at ${barber.lat}, ${barber.lng}`);
          
          const markerElement = createCustomBarberMarker(barber);
          
          markerElement.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log('Barber marker clicked:', barber.name);
            onBarberSelect(barber);
          });

          const annotation = new window.mapkit.Annotation(
            new window.mapkit.Coordinate(barber.lat, barber.lng),
            () => markerElement,
            {
              animates: true,
              title: barber.name,
              subtitle: `${barber.specialty} - ${barber.price}`,
              data: barber,
              displayPriority: 500
            }
          );

          return annotation;
        });

        map.addAnnotations(annotations);
        barberAnnotationsRef.current = annotations;

        const handleMapSelect = (event: any) => {
          const annotation = event.annotation;
          if (annotation.data) {
            console.log('Map select event - barber marker:', annotation.data.name);
            onBarberSelect(annotation.data);
          }
        };

        map.addEventListener('select', handleMapSelect);

        console.log('All barber markers added successfully');

        return () => {
          if (map && barberAnnotationsRef.current.length > 0 && isMapReadyForAnnotations(map)) {
            try {
              console.log('Cleaning up barber annotations');
              map.removeAnnotations(barberAnnotationsRef.current);
              map.removeEventListener('select', handleMapSelect);
              barberAnnotationsRef.current = [];
            } catch (error) {
              console.error('Error removing barber annotations:', error);
            }
          }
        };
      } catch (error) {
        console.error('Error adding barber markers:', error);
      }
    }, 1500); // 1.5 second delay for barbers

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (map && barberAnnotationsRef.current.length > 0 && isMapReadyForAnnotations(map)) {
        try {
          console.log('Cleaning up barber annotations');
          map.removeAnnotations(barberAnnotationsRef.current);
          barberAnnotationsRef.current = [];
        } catch (error) {
          console.error('Error removing barber annotations:', error);
        }
      }
    };
  }, [map, nearbyBarbers, onBarberSelect, mapInitialized]);

  return null;
};

export default MapAnnotations;
