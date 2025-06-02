
import React from 'react';
import { useMapAnnotations } from '@/hooks/useMapAnnotations';
import UserLocationAnnotation from './annotations/UserLocationAnnotation';
import BarberAnnotations from './annotations/BarberAnnotations';
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
  const {
    userAnnotationRef,
    barberAnnotationsRef,
    safeAddAnnotation,
    safeRemoveAnnotations
  } = useMapAnnotations();

  return (
    <>
      <UserLocationAnnotation
        map={map}
        userLocation={userLocation}
        mapReady={mapReady}
        userAnnotationRef={userAnnotationRef}
        safeAddAnnotation={safeAddAnnotation}
      />
      
      <BarberAnnotations
        map={map}
        nearbyBarbers={nearbyBarbers}
        onBarberSelect={onBarberSelect}
        mapReady={mapReady}
        barberAnnotationsRef={barberAnnotationsRef}
        safeAddAnnotation={safeAddAnnotation}
        safeRemoveAnnotations={safeRemoveAnnotations}
      />
    </>
  );
};

export default MapAnnotations;
