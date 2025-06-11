import React, { useState, useEffect } from 'react';
import BarberProfile from './BarberProfile';
import BarberDashboard from './BarberDashboard';
import FilterPage from './FilterPage';
import AIGeminiPage from './AIGeminiPage';
import AboutUsPage from './AboutUsPage';
import BarbersOfTheYearPage from './BarbersOfTheYearPage';
import MapHeader from './map/MapHeader';
import MapLayout from './map/MapLayout';
import MenuDialog from './map/MenuDialog';
import { nearbyBarbers } from '@/data/barberData';
import { useMapViewState } from '@/hooks/useMapViewState';
import { useBarberMapData } from '@/hooks/useBarberMapData';

interface MapViewProps {
  userType: 'barber' | 'client';
}

const MapView = ({ userType }: MapViewProps) => {
  console.log('MapView: Rendering for user type:', userType);
  
  const [isMapViewLoading, setIsMapViewLoading] = useState(true);
  const [showBarbersOfTheYearPage, setShowBarbersOfTheYearPage] = useState(false);
  
  // Fetch real barber data from database with real-time updates
  const { barbers: databaseBarbers, loading: barbersLoading } = useBarberMapData();
  
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

  const handleBarbersOfTheYearClick = () => {
    setShowBarbersOfTheYearPage(true);
  };

  // Update filtered barbers when database barbers change (real-time updates)
  useEffect(() => {
    console.log('MapView: Database barbers updated, count:', databaseBarbers.length);
    console.log('MapView: Current database barbers:', databaseBarbers.map(b => ({ id: b.id, name: b.name, lat: b.lat, lng: b.lng })));
    
    if (!barbersLoading) {
      console.log('MapView: Updating filtered barbers with real-time data');
      // Always update filtered barbers when database barbers change
      setFilteredBarbers(databaseBarbers.length > 0 ? databaseBarbers : nearbyBarbers);
    }
  }, [databaseBarbers, barbersLoading, setFilteredBarbers]);

  // Initialize filtered barbers and mark as loaded
  useEffect(() => {
    console.log('MapView: Initializing...');
    
    if (!barbersLoading) {
      // Prioritize database barbers, fallback to static data if needed
      const allBarbers = databaseBarbers.length > 0 ? databaseBarbers : nearbyBarbers;
      
      console.log('MapView: Setting up barbers for map display:', allBarbers.length);
      console.log('MapView: Using barbers:', allBarbers.map(b => ({ id: b.id, name: b.name })));
      
      // Small delay to ensure everything is initialized
      const timer = setTimeout(() => {
        console.log('MapView: Initialization complete');
        setIsMapViewLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [barbersLoading, databaseBarbers]);

  const displayBarbers = filteredBarbers.length > 0 ? filteredBarbers : (databaseBarbers.length > 0 ? databaseBarbers : nearbyBarbers);

  console.log('MapView: Final display barbers count:', displayBarbers.length);
  console.log('MapView: Display barbers:', displayBarbers.map(b => ({ id: b.id, name: b.name, lat: b.lat, lng: b.lng })));

  // Show loading state for MapView initialization
  if (isMapViewLoading || barbersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="glass-morphism-dark rounded-2xl p-8 flex flex-col items-center space-y-6">
          <img 
            src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
            alt="TRIMMERR Logo" 
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-xl"
          />
          
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              TRIMMERR
            </h2>
            <p className="text-gray-300 text-lg animate-pulse">Loading barbers on map...</p>
          </div>
          
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show barber dashboard for barber users
  if (showDashboard && userType === 'barber') {
    return <BarberDashboard onBack={() => setShowDashboard(false)} />;
  }

  // Filter page - for clients only, barbers don't need this
  if (showFilterPage && userType === 'client') {
    return (
      <FilterPage
        barbers={nearbyBarbers}
        onBack={() => setShowFilterPage(false)}
        onBarberSelect={handleBarberSelect}
        onNavigate={openInAppleMaps}
      />
    );
  }

  // AI Assistant - available for both user types
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

  if (showBarbersOfTheYearPage) {
    return (
      <BarbersOfTheYearPage
        onBack={() => setShowBarbersOfTheYearPage(false)}
      />
    );
  }

  // Barber profile - clients can book, barbers can view but not book
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

  console.log('MapView: Rendering main map view with', displayBarbers.length, 'barbers for user type:', userType);
  return (
    <div className="h-screen w-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-hidden">
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
        onBarbersOfTheYearClick={handleBarbersOfTheYearClick}
      />
    </div>
  );
};

export default MapView;
