
import React from 'react';
import { Barber } from '@/types/barber';

interface BarberAnnotationsProps {
  barbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

// This component is no longer needed with Leaflet implementation
// The markers are handled directly in MapboxMap.tsx
const BarberAnnotations = ({ barbers, onBarberSelect }: BarberAnnotationsProps) => {
  console.log('BarberAnnotations: Rendered for', barbers.length, 'barbers');
  return null;
};

export default BarberAnnotations;
