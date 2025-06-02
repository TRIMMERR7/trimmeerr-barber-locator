
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
  
  // Add user location marker
  useEffect(() => {
    if (!map || !userLocation || !mapInitialized) return;

    console.log('Adding user location marker at:', userLocation);

    const userAnnotation = new window.mapkit.MarkerAnnotation(
      new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
      {
        color: '#007AFF',
        glyphColor: '#FFFFFF',
        title: 'Your Location',
        subtitle: 'Current position'
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
  }, [map, userLocation, mapInitialized]);

  // Add barber markers
  useEffect(() => {
    if (!map || !nearbyBarbers.length || !mapInitialized) return;

    console.log('Adding custom barber markers...', nearbyBarbers.length, 'barbers');

    const annotations = nearbyBarbers.map((barber) => {
      console.log(`Creating custom marker for ${barber.name} at ${barber.lat}, ${barber.lng}`);
      
      const markerElement = createCustomBarberMarker(barber);

      const annotation = new window.mapkit.Annotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        () => markerElement,
        {
          animates: true,
          title: barber.name,
          subtitle: `${barber.specialty} - ${barber.price}`,
          data: barber
        }
      );

      return annotation;
    });

    map.addAnnotations(annotations);

    const handleMarkerSelect = (event: any) => {
      const annotation = event.annotation;
      if (annotation.data) {
        console.log('Custom barber marker clicked:', annotation.data.name);
        onBarberSelect(annotation.data);
      }
    };

    map.addEventListener('select', handleMarkerSelect);

    console.log('All custom barber markers added successfully');

    return () => {
      if (map && annotations.length > 0) {
        try {
          map.removeAnnotations(annotations);
          map.removeEventListener('select', handleMarkerSelect);
        } catch (error) {
          console.error('Error removing barber annotations:', error);
        }
      }
    };
  }, [map, nearbyBarbers, onBarberSelect, mapInitialized]);

  return null;
};

export default MapAnnotations;
