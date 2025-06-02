
import React from 'react';
import StepsIndicator from './StepsIndicator';
import BarberMarker from './BarberMarker';

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

interface MapContainerProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const MapContainer = ({ nearbyBarbers, onBarberSelect }: MapContainerProps) => {
  return (
    <div className="flex-1 relative">
      <StepsIndicator currentStep={1} />

      {/* Map Area */}
      <div className="h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden">
        {/* Your Location (Blue Dot) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-6 h-6 bg-blue-500 rounded-full shadow-lg"></div>
            <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-30"></div>
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
            You
          </div>
        </div>

        {/* Barber Locations */}
        {nearbyBarbers.map((barber, index) => (
          <BarberMarker
            key={barber.id}
            barber={barber}
            index={index}
            onClick={onBarberSelect}
          />
        ))}

        {/* Grid overlay for better visual */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:40px_40px]"></div>
      </div>
    </div>
  );
};

export default MapContainer;
