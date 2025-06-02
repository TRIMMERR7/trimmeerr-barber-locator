import React from 'react';
import BarberMarker from './BarberMarker';
import AdSlider from '../AdSlider';
import TopBarbersSlider from '../TopBarbersSlider';

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
  const handleBarberClick = (barber: Barber) => {
    console.log('MapContainer handling barber click:', barber.name);
    onBarberSelect(barber);
  };

  return (
    <div className="flex-1 relative">
      {/* Top Barbers Slideshow */}
      <TopBarbersSlider />

      {/* GPS-Style Map Area */}
      <div className="h-full relative overflow-hidden">
        {/* Map Background with realistic GPS styling */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-100 to-green-200">
          {/* Street grid pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#16a34a" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Major roads */}
          <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
          <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-300 opacity-40"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-gray-300 opacity-40"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-400 opacity-60"></div>
          
          {/* Parks/green areas */}
          <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-green-300 rounded-lg opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-20 bg-green-300 rounded-lg opacity-50"></div>
        </div>

        {/* Your Location (Blue Dot with GPS styling) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="w-8 h-8 bg-blue-500 rounded-full shadow-xl border-4 border-white"></div>
            <div className="absolute inset-0 w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-40"></div>
            <div className="absolute inset-2 w-4 h-4 bg-blue-600 rounded-full"></div>
          </div>
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
            Your Location
          </div>
        </div>

        {/* Barber Locations */}
        {nearbyBarbers.map((barber, index) => (
          <BarberMarker
            key={barber.id}
            barber={barber}
            index={index}
            onClick={handleBarberClick}
          />
        ))}
      </div>

      {/* Advertising Slideshow */}
      <AdSlider />
    </div>
  );
};

export default MapContainer;
