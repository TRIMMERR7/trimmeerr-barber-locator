
import React, { useEffect } from 'react';
import { createCustomBarberMarker } from '../utils/markerFactory';
import { Barber } from '@/types/barber';

interface BarberAnnotationsProps {
  map: any;
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  mapReady: boolean;
  barberAnnotationsRef: React.MutableRefObject<any[]>;
  safeAddAnnotation: (map: any, annotation: any) => boolean;
  safeRemoveAnnotations: (map: any, annotations: any[]) => void;
}

const BarberAnnotations = ({ 
  map, 
  nearbyBarbers, 
  onBarberSelect, 
  mapReady,
  barberAnnotationsRef,
  safeAddAnnotation,
  safeRemoveAnnotations
}: BarberAnnotationsProps) => {

  useEffect(() => {
    if (!nearbyBarbers.length || !map || !mapReady) {
      console.log('Skipping barber markers - missing requirements:', { 
        barbersCount: nearbyBarbers.length, 
        hasMap: !!map, 
        mapReady 
      });
      return;
    }
    
    console.log('Adding barber markers for', nearbyBarbers.length, 'barbers');

    try {
      // Remove existing barber annotations
      if (barberAnnotationsRef.current.length > 0) {
        console.log('Removing existing barber annotations:', barberAnnotationsRef.current.length);
        safeRemoveAnnotations(map, barberAnnotationsRef.current);
        barberAnnotationsRef.current = [];
      }

      const annotations = nearbyBarbers.map((barber, index) => {
        console.log(`Creating enhanced marker for ${barber.name} at ${barber.lat}, ${barber.lng}`);
        
        const markerElement = createCustomBarberMarker(barber);
        
        // Add click handler with better event handling
        markerElement.addEventListener('click', (event) => {
          event.stopPropagation();
          event.preventDefault();
          console.log('Enhanced barber marker clicked:', barber.name);
          onBarberSelect(barber);
        });

        // Add touch handler for mobile
        markerElement.addEventListener('touchend', (event) => {
          event.stopPropagation();
          event.preventDefault();
          console.log('Enhanced barber marker touched:', barber.name);
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
            displayPriority: 750 - index // Higher priority for earlier barbers
          }
        );

        console.log(`Annotation created for ${barber.name}`);
        return annotation;
      });

      // Add annotations one by one and track successful additions
      const successfulAnnotations: any[] = [];
      annotations.forEach((annotation, index) => {
        console.log(`Adding annotation ${index + 1}/${annotations.length}`);
        if (safeAddAnnotation(map, annotation)) {
          successfulAnnotations.push(annotation);
        }
      });

      barberAnnotationsRef.current = successfulAnnotations;

      // Add map selection event listener with improved handling
      const handleMapSelect = (event: any) => {
        console.log('Map select event triggered');
        const annotation = event.annotation;
        if (annotation && annotation.data) {
          console.log('Map select event - barber marker:', annotation.data.name);
          onBarberSelect(annotation.data);
        }
      };

      try {
        map.addEventListener('select', handleMapSelect);
        console.log('Select event listener added');
      } catch (error) {
        console.warn('Failed to add select event listener:', error);
      }

      console.log(`Successfully added ${successfulAnnotations.length}/${annotations.length} barber markers`);

      // Force a map refresh to ensure markers are visible
      setTimeout(() => {
        if (map && typeof map.redraw === 'function') {
          map.redraw();
        }
      }, 200);

      return () => {
        try {
          if (barberAnnotationsRef.current.length > 0) {
            console.log('Cleaning up barber annotations');
            safeRemoveAnnotations(map, barberAnnotationsRef.current);
            barberAnnotationsRef.current = [];
          }
          map.removeEventListener('select', handleMapSelect);
        } catch (error) {
          console.warn('Error during barber markers cleanup:', error);
        }
      };
    } catch (error) {
      console.error('Error adding barber markers:', error);
    }
  }, [map, nearbyBarbers, onBarberSelect, mapReady, barberAnnotationsRef, safeAddAnnotation, safeRemoveAnnotations]);

  return null;
};

export default BarberAnnotations;
