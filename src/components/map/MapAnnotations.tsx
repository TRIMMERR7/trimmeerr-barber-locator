
import React, { useEffect, useRef } from 'react';
import { createCustomBarberMarker } from './utils/markerUtils';
import { Barber } from '@/types/barber';

interface MapAnnotationsProps {
  map: any;
  userLocation: [number, number] | null;
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  mapReady: boolean;
}

const MapAnnotations = ({ 
  map, 
  userLocation, 
  nearbyBarbers, 
  onBarberSelect, 
  mapReady 
}: MapAnnotationsProps) => {
  const userAnnotationRef = useRef<any>(null);
  const barberAnnotationsRef = useRef<any[]>([]);
  
  // Helper function to safely add annotations
  const safeAddAnnotation = (annotation: any): boolean => {
    try {
      if (map && typeof map.addAnnotation === 'function') {
        map.addAnnotation(annotation);
        console.log('Successfully added annotation');
        return true;
      }
    } catch (error) {
      console.warn('Failed to add annotation:', error);
    }
    return false;
  };

  // Helper function to safely remove annotations
  const safeRemoveAnnotations = (annotations: any[]): void => {
    try {
      if (map && annotations.length > 0 && typeof map.removeAnnotations === 'function') {
        map.removeAnnotations(annotations);
        console.log('Successfully removed annotations');
      }
    } catch (error) {
      console.warn('Failed to remove annotations:', error);
    }
  };
  
  // Add user location marker (blue)
  useEffect(() => {
    if (!userLocation || !map || !mapReady) {
      return;
    }
    
    console.log('Adding user location marker at:', userLocation);

    try {
      // Remove existing user annotation if it exists
      if (userAnnotationRef.current) {
        try {
          map.removeAnnotation(userAnnotationRef.current);
        } catch (error) {
          console.warn('Failed to remove existing user annotation:', error);
        }
        userAnnotationRef.current = null;
      }

      const userAnnotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
        {
          color: '#007AFF',
          glyphColor: '#FFFFFF',
          title: 'Your Location',
          subtitle: 'Current position',
          displayPriority: 1000,
          animates: true
        }
      );

      if (safeAddAnnotation(userAnnotation)) {
        userAnnotationRef.current = userAnnotation;
        
        // Center map on user location with a slight delay to ensure visibility
        setTimeout(() => {
          const region = new window.mapkit.CoordinateRegion(
            new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
            new window.mapkit.CoordinateSpan(0.01, 0.01)
          );
          
          try {
            map.setRegionAnimated(region, true);
            console.log('Map centered on user location');
          } catch (error) {
            console.warn('Failed to set region:', error);
          }
        }, 100);

        console.log('User location marker added successfully');
      }
    } catch (error) {
      console.error('Error adding user location marker:', error);
    }

    return () => {
      if (userAnnotationRef.current) {
        try {
          map.removeAnnotation(userAnnotationRef.current);
          userAnnotationRef.current = null;
        } catch (error) {
          console.warn('Error removing user annotation:', error);
        }
      }
    };
  }, [map, userLocation, mapReady]);

  // Add barber markers (red, clickable)
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
        safeRemoveAnnotations(barberAnnotationsRef.current);
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
        if (safeAddAnnotation(annotation)) {
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
            safeRemoveAnnotations(barberAnnotationsRef.current);
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
  }, [map, nearbyBarbers, onBarberSelect, mapReady]);

  return null;
};

export default MapAnnotations;
