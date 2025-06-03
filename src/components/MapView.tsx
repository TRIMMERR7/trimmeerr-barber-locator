
import React from 'react';
import BarberProfile from './BarberProfile';
import BarberDashboard from './BarberDashboard';
import FilterPage from './FilterPage';
import AIGeminiPage from './AIGeminiPage';
import AboutUsPage from './AboutUsPage';
import MapHeader from './map/MapHeader';
import MapLayout from './map/MapLayout';
import MenuDialog from './map/MenuDialog';
import { nearbyBarbers } from '@/data/barberData';
import { useMapViewState } from '@/hooks/useMapViewState';

interface MapViewProps {
  userType: 'barber' | 'client';
}

const MapView = ({ userType }: MapViewProps) => {
  const {
    selectedBarber,
    setSelectedBarber,
    showDashboard,
    setShowDashboard,
    showFilterPage,
    setShowFilterPage,
    showAIGeminiPage,
    setShowAIGeminiPage,
    showAboutUsPage,
    setShowAboutUsPage,
    showMenuDialog,
    setShowMenuDialog,
    filteredBarbers,
    setFilteredBarbers,
    handleBarberSelect,
    openInAppleMaps,
    handleMenuClick,
    handleAIAssistantClick,
    handleAboutUsClick
  } = useMapViewState();

  // Initialize filtered barbers
  React.useEffect(() => {
    if (filteredBarbers.length === 0) {
      setFilteredBarbers(nearbyBarbers);
    }
  }, [filteredBarbers.length, setFilteredBarbers]);

  const displayBarbers = filteredBarbers.length > 0 ? filteredBarbers : nearbyBarbers;

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

  if (showAboutUsPage) {
    return (
      <AboutUsPage
        onBack={() => setShowAboutUsPage(false)}
      />
    );
  }

  if (selectedBarber) {
    console.log('MapView: Rendering BarberProfile for:', selectedBarber.name);
    return (
      <BarberProfile 
        barber={selectedBarber} 
        onBack={() => {
          console.log('MapView: Going back to map');
          setSelectedBarber(null);
        }}
        userType={userType}
        onNavigate={() => openInAppleMaps(selectedBarber)}
      />
    );
  }

  console.log('MapView: Rendering map view');
  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      <MapHeader 
        userType={userType}
        onAIAssistantClick={handleAIAssistantClick}
        onDashboardClick={userType === 'barber' ? () => setShowDashboard(true) : undefined}
        onMenuClick={handleMenuClick}
      />

      <MapLayout
        displayBarbers={displayBarbers}
        onBarberSelect={handleBarberSelect}
        onNavigate={openInAppleMaps}
      />

      <MenuDialog
        isOpen={showMenuDialog}
        onClose={() => setShowMenuDialog(false)}
        onAIAssistantClick={handleAIAssistantClick}
        onAboutUsClick={handleAboutUsClick}
      />
    </div>
  );
};

export default MapView;
