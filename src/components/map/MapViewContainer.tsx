
import React, { useState, useEffect } from 'react';
import MapHeader from './MapHeader';
import MapLayout from './MapLayout';
import { Barber } from '@/types/barber';
import { nearbyBarbers } from '@/data/barbersData';
import { openInAppleMaps } from '@/utils/mapNavigation';

interface MapViewContainerProps {
  userType: 'barber' | 'client';
  onBarberSelect: (barber: Barber) => void;
  onAIGeminiPageOpen: () => void;
  onDashboardOpen?: () => void;
}

const MapViewContainer = ({ 
  userType, 
  onBarberSelect, 
  onAIGeminiPageOpen, 
  onDashboardOpen 
}: MapViewContainerProps) => {
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    if (filteredBarbers.length === 0) {
      setFilteredBarbers(nearbyBarbers);
    }
  }, []);

  const displayBarbers = filteredBarbers.length > 0 ? filteredBarbers : nearbyBarbers;

  const handleBarberSelect = (barber: Barber) => {
    console.log('MapViewContainer: Barber selected:', barber.name);
    onBarberSelect(barber);
  };

  console.log('MapViewContainer: Rendering map view');
  
  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-hidden">
      <MapHeader 
        userType={userType}
        onAIAssistantClick={onAIGeminiPageOpen}
        onDashboardClick={onDashboardOpen}
      />

      <div className="flex-1 w-full h-full relative overflow-hidden">
        <MapLayout
          displayBarbers={displayBarbers}
          onBarberSelect={handleBarberSelect}
          onNavigate={openInAppleMaps}
        />
      </div>
    </div>
  );
};

export default MapViewContainer;
