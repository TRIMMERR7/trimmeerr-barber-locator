
import React, { useState } from 'react';
import BarberProfile from './BarberProfile';
import BarberDashboard from './BarberDashboard';
import FilterPage from './FilterPage';
import AIGeminiPage from './AIGeminiPage';
import MapViewContainer from './map/MapViewContainer';
import { Barber } from '@/types/barber';
import { nearbyBarbers } from '@/data/barbersData';
import { openInAppleMaps } from '@/utils/mapNavigation';

interface MapViewProps {
  userType: 'barber' | 'client';
}

const MapView = ({ userType }: MapViewProps) => {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showAIGeminiPage, setShowAIGeminiPage] = useState(false);

  const handleBarberSelect = (barber: Barber) => {
    console.log('MapView: Barber selected:', barber.name);
    setSelectedBarber(barber);
  };

  const handleMenuClick = () => {
    setShowAIGeminiPage(true);
  };

  if (showDashboard && userType === 'barber') {
    return <BarberDashboard onBack={() => setShowDashboard(false)} />;
  }

  if (showFilterPage) {
    return (
      <FilterPage
        barbers={nearbyBarbers}
        onBack={() => setShowFilterPage(false)}
        onBarberSelect={handleBarberSelect}
        onNavigate={openInAppleMaps}
      />
    );
  }

  if (showAIGeminiPage) {
    return (
      <AIGeminiPage
        onBack={() => setShowAIGeminiPage(false)}
      />
    );
  }

  if (selectedBarber) {
    console.log('MapView: Rendering BarberProfile for:', selectedBarber.name);
    return (
      <div className="relative">
        <BarberProfile 
          barber={selectedBarber} 
          onBack={() => {
            console.log('MapView: Going back to map');
            setSelectedBarber(null);
          }}
          userType={userType}
          onNavigate={() => openInAppleMaps(selectedBarber)}
        />
      </div>
    );
  }

  return (
    <MapViewContainer
      userType={userType}
      onBarberSelect={handleBarberSelect}
      onAIGeminiPageOpen={handleMenuClick}
      onDashboardOpen={userType === 'barber' ? () => setShowDashboard(true) : undefined}
    />
  );
};

export default MapView;
