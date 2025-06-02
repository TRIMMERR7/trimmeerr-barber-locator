
import { useRef } from 'react';

export const useMapAnnotations = () => {
  const userAnnotationRef = useRef<any>(null);
  const barberAnnotationsRef = useRef<any[]>([]);

  // Helper function to safely add annotations
  const safeAddAnnotation = (map: any, annotation: any): boolean => {
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
  const safeRemoveAnnotations = (map: any, annotations: any[]): void => {
    try {
      if (map && annotations.length > 0 && typeof map.removeAnnotations === 'function') {
        map.removeAnnotations(annotations);
        console.log('Successfully removed annotations');
      }
    } catch (error) {
      console.warn('Failed to remove annotations:', error);
    }
  };

  return {
    userAnnotationRef,
    barberAnnotationsRef,
    safeAddAnnotation,
    safeRemoveAnnotations
  };
};
