
import React from 'react';

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

interface BarberMarkerProps {
  barber: Barber;
  index: number;
  onClick: (barber: Barber) => void;
}

const BarberMarker = ({ barber, index, onClick }: BarberMarkerProps) => {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('BarberMarker clicked:', barber.name);
    onClick(barber);
  };

  return (
    <button
      onClick={handleClick}
      onTouchEnd={handleClick}
      className="absolute group touch-manipulation transform transition-all duration-200 hover:scale-125 focus:scale-125 focus:outline-none z-20"
      style={{
        top: `${45 + index * 15}%`,
        left: `${40 + index * 20}%`,
        minWidth: '44px',
        minHeight: '44px'
      }}
    >
      <div className="relative">
        <div className="w-8 h-8 bg-red-600 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
          <img
            src={barber.image}
            alt={barber.name}
            className="w-full h-full rounded-full object-cover border-2 border-red-600"
          />
        </div>
        <div className="absolute inset-0 w-8 h-8 bg-red-600 rounded-full animate-ping opacity-40"></div>
      </div>
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
        <div className="font-semibold">{barber.name}</div>
        <div className="text-red-100">{barber.specialty}</div>
        <div className="text-red-100">{barber.price}</div>
      </div>
    </button>
  );
};

export default BarberMarker;
