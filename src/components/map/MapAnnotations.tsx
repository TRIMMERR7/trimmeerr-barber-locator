
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
  
  // Simplified helper function to check if map is ready for annotations
  const isMapReadyForAnnotations = (mapInstance: any): boolean => {
    if (!mapInstance || !mapInitialized) {
      console.log('Map readiness check: map instance or initialization flag missing');
      return false;
    }
    
    if (typeof window === 'undefined' || !window.mapkit) {
      console.log('Map readiness check: MapKit not available');
      return false;
    }
    
    try {
      // Simple check - just verify the map instance has the required methods
      const hasRequiredMethods = (
        typeof mapInstance.addAnnotation === 'function' &&
        typeof mapInstance.removeAnnotation === 'function'
      );

      console.log('Map readiness check:', {
        hasMap: !!mapInstance,
        mapInitialized,
        hasRequiredMethods,
        mapkitAvailable: !!window.mapkit
      });

      return hasRequiredMethods;
    } catch (error) {
      console.error('Error checking map readiness:', error);
      return false;
    }
  };
  
  // Add user location marker (blue)
  useEffect(() => {
    if (!userLocation || !isMapReadyForAnnotations(map)) {
      console.log('Skipping user location marker - not ready');
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

    return () => {
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

  // Add barber markers (red, clickable)
  useEffect(() => {
    if (!nearbyBarbers.length || !isMapReadyForAnnotations(map)) {
      console.log('Skipping barber markers - not ready or no barbers');
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
  }, [map, nearbyBarbers, onBarberSelect, mapInitialized]);

  return null;
};

export default MapAnnotations;
