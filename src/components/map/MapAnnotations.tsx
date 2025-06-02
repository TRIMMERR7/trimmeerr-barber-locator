
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
  
  // Helper function to check if map is truly ready for annotations
  const isMapReadyForAnnotations = (mapInstance: any): boolean => {
    if (!mapInstance || !mapInitialized) {
      return false;
    }
    
    try {
      // Check if the map has essential methods and properties
      return (
        typeof mapInstance.addAnnotation === 'function' &&
        typeof mapInstance.removeAnnotation === 'function' &&
        typeof mapInstance.addAnnotations === 'function' &&
        typeof mapInstance.removeAnnotations === 'function' &&
        typeof mapInstance.setRegionAnimated === 'function' &&
        mapInstance._delegate && // Internal property that indicates map is fully ready
        window.mapkit &&
        window.mapkit.MarkerAnnotation &&
        window.mapkit.Annotation &&
        window.mapkit.Coordinate &&
        window.mapkit.CoordinateRegion &&
        window.mapkit.CoordinateSpan
      );
    } catch (error) {
      console.error('Error checking map readiness:', error);
      return false;
    }
  };
  
  // Add user location marker (blue)
  useEffect(() => {
    if (!userLocation) return;
    
    if (!isMapReadyForAnnotations(map)) {
      console.log('Map not ready for user location marker, waiting...');
      return;
    }
    
    console.log('Adding blue client location marker at:', userLocation);

    try {
      // Remove existing user annotation if it exists
      if (userAnnotationRef.current && map) {
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
      if (userAnnotationRef.current && map) {
        try {
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
    if (!nearbyBarbers.length) return;
    
    if (!isMapReadyForAnnotations(map)) {
      console.log('Map not ready for barber annotations, waiting...');
      return;
    }
    
    console.log('Adding clickable red barber markers...', nearbyBarbers.length, 'barbers');

    try {
      // Remove existing barber annotations
      if (barberAnnotationsRef.current.length > 0 && map) {
        map.removeAnnotations(barberAnnotationsRef.current);
        barberAnnotationsRef.current = [];
      }

      const annotations = nearbyBarbers.map((barber) => {
        console.log(`Creating clickable marker for ${barber.name} at ${barber.lat}, ${barber.lng}`);
        
        const markerElement = createCustomBarberMarker(barber);
        
        markerElement.addEventListener('click', (event) => {
          event.stopPropagation();
          console.log('Red barber marker clicked:', barber.name);
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

      console.log('All clickable red barber markers added successfully');

      return () => {
        if (map && barberAnnotationsRef.current.length > 0) {
          try {
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
