
import React, { useEffect } from 'react';

interface UserLocationAnnotationProps {
  map: any;
  userLocation: [number, number] | null;
  mapReady: boolean;
  userAnnotationRef: React.MutableRefObject<any>;
  safeAddAnnotation: (map: any, annotation: any) => boolean;
}

const UserLocationAnnotation = ({ 
  map, 
  userLocation, 
  mapReady, 
  userAnnotationRef,
  safeAddAnnotation 
}: UserLocationAnnotationProps) => {
  
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

      if (safeAddAnnotation(map, userAnnotation)) {
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
  }, [map, userLocation, mapReady, userAnnotationRef, safeAddAnnotation]);

  return null;
};

export default UserLocationAnnotation;
