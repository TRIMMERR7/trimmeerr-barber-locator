
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
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
  const [zoom, setZoom] = useState(1);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleBarberClick = (barber: Barber) => {
    console.log('MapContainer handling barber click:', barber.name);
    onBarberSelect(barber);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    };

    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener('wheel', handleWheel, { passive: false });
      return () => mapElement.removeEventListener('wheel', handleWheel);
    }
  }, []);

  return (
    <div className="flex-1 relative">
      {/* Top Barbers Slideshow */}
      <TopBarbersSlider />

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
        <Button
          onClick={handleZoomIn}
          size="icon"
          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleZoomOut}
          size="icon"
          className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-800 text-center">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* GPS-Style Map Area */}
      <div 
        ref={mapRef}
        className="h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ 
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out'
        }}
      >
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
