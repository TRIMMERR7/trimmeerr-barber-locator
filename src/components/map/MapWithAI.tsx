
import React from 'react';
import MapLayout from './MapLayout';
import AIBookingAssistant from '../AIBookingAssistant';

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
  ethnicity: string;
  age: number;
  languages: string[];
  personalityTraits: string[];
  videoUrl?: string;
}

interface MapWithAIProps {
  displayBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  onNavigate: (barber: Barber) => void;
}

const MapWithAI = ({ displayBarbers, onBarberSelect, onNavigate }: MapWithAIProps) => {
  return (
    <div className="relative">
      <MapLayout
        displayBarbers={displayBarbers}
        onBarberSelect={onBarberSelect}
        onNavigate={onNavigate}
      />
      
      <AIBookingAssistant
        currentStep="find"
        nearbyBarbers={displayBarbers}
        onBarberSelect={onBarberSelect}
      />
    </div>
  );
};

export default MapWithAI;
