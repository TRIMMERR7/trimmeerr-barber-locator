
import React from 'react';
import MapContainer from './MapContainer';
import BarberList from './BarberList';
import AdSlider from '../AdSlider';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface MapLayoutProps {
  displayBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  onNavigate: (barber: Barber) => void;
}

const MapLayout = ({ displayBarbers, onBarberSelect, onNavigate }: MapLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full min-h-0 overflow-hidden">
      {/* Map Container - Takes 70% width on desktop, full width on mobile */}
      <div className={`${isMobile ? 'flex-1' : 'flex-[0.7]'} h-full min-h-0 relative`}>
        <MapContainer 
          nearbyBarbers={displayBarbers}
          onBarberSelect={onBarberSelect}
        />
      </div>

      {/* Desktop Ads Panel - 30% width on desktop, hidden on mobile */}
      {!isMobile && (
        <div className="flex-[0.3] h-full border-l border-gray-700/30 flex flex-col shadow-xl bg-gradient-to-b from-gray-900 to-black overflow-hidden">
          <div className="p-4 border-b border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-2">Partner Offers</h3>
            <p className="text-gray-400 text-sm">Discover amazing deals from our partners</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <AdSlider />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapLayout;
