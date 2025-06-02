
import React, { useEffect } from 'react';
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
  
  // Add user location marker (blue)
  useEffect(() => {
    if (!map || !userLocation || !mapInitialized) return;
    
    // Wait for map to be fully ready with a small delay
    const addUserMarker = () => {
      if (!map._map || typeof map.addAnnotation !== 'function') {
        console.log('Map not ready for user annotations, retrying...');
        setTimeout(addUserMarker, 100);
        return;
      }

      console.log('Adding blue client location marker at:', userLocation);

      try {
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
        
        const region = new window.mapkit.CoordinateRegion(
          new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
          new window.mapkit.CoordinateSpan(0.005, 0.005)
        );
        map.setRegionAnimated(region, true);

        return () => {
          if (map && userAnnotation) {
            try {
              map.removeAnnotation(userAnnotation);
            } catch (error) {
              console.error('Error removing user annotation:', error);
            }
          }
        };
      } catch (error) {
        console.error('Error adding user location marker:', error);
      }
    };

    // Start with a small delay to ensure map is ready
    const timeout = setTimeout(addUserMarker, 200);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [map, userLocation, mapInitialized]);

  // Add barber markers (red, clickable)
  useEffect(() => {
    if (!map || !nearbyBarbers.length || !mapInitialized) return;
    
    // Wait for map to be fully ready with a small delay
    const addBarberMarkers = () => {
      if (!map._map || typeof map.addAnnotations !== 'function') {
        console.log('Map not ready for barber annotations, retrying...');
        setTimeout(addBarberMarkers, 100);
        return;
      }

      console.log('Adding clickable red barber markers...', nearbyBarbers.length, 'barbers');

      try {
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
          if (map && annotations.length > 0) {
            try {
              map.removeAnnotations(annotations);
              map.removeEventListener('select', handleMapSelect);
            } catch (error) {
              console.error('Error removing barber annotations:', error);
            }
          }
        };
      } catch (error) {
        console.error('Error adding barber markers:', error);
      }
    };

    // Start with a small delay to ensure map is ready
    const timeout = setTimeout(addBarberMarkers, 300);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [map, nearbyBarbers, onBarberSelect, mapInitialized]);

  return null;
};

export default MapAnnotations;
