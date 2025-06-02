
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import BarberProfile from './BarberProfile';
import BarberDashboard from './BarberDashboard';
import BarberList from './map/BarberList';
import MapContainer from './map/MapContainer';

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

interface MapViewProps {
  userType: 'barber' | 'client';
}

const MapView = ({ userType }: MapViewProps) => {
  const { signOut } = useAuth();
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Updated barber locations to be near Houston, Texas instead of New York
  const nearbyBarbers: Barber[] = [
    {
      id: '1',
      name: 'Marcus Johnson',
      rating: 4.9,
      specialty: 'Fades & Braids',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      price: '$35',
      distance: '0.3 mi',
      experience: '8 years',
      lat: 29.7720, // Houston area coordinates
      lng: -95.3850
    },
    {
      id: '2',
      name: 'Carlos Rivera',
      rating: 4.8,
      specialty: 'Classic Cuts',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      price: '$30',
      distance: '0.5 mi',
      experience: '12 years',
      lat: 29.7750, // Houston area coordinates
      lng: -95.3800
    },
    {
      id: '3',
      name: 'Ahmed Hassan',
      rating: 4.7,
      specialty: 'Beard Styling',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      price: '$40',
      distance: '0.7 mi',
      experience: '6 years',
      lat: 29.7690, // Houston area coordinates
      lng: -95.3900
    }
  ];

  const handleBarberSelect = (barber: Barber) => {
    console.log('MapView: Barber selected:', barber.name);
    setSelectedBarber(barber);
  };

  const openInAppleMaps = (barber: Barber) => {
    const appleMapsUrl = `https://maps.apple.com/?daddr=${barber.lat},${barber.lng}&dirflg=d&t=m`;
    window.open(appleMapsUrl, '_blank');
  };

  if (showDashboard && userType === 'barber') {
    return <BarberDashboard onBack={() => setShowDashboard(false)} />;
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
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800 p-2 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <img 
              src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
              alt="TRIMMERR Logo" 
              className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
            />
            <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent truncate">
              TRIMMERR
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Menu Button - No functionality now */}
            <Button 
              variant="ghost" 
              size="icon"
              className="lg:hidden text-white hover:bg-gray-800 rounded-xl touch-manipulation h-8 w-8 sm:h-9 sm:w-9"
            >
              <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {userType === 'barber' && (
              <Button 
                onClick={() => setShowDashboard(true)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl touch-manipulation shadow-lg h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Profile</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={signOut}
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl touch-manipulation h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <MapContainer 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={handleBarberSelect}
        />

        {/* Barber List - Desktop Only */}
        <div className="hidden lg:flex w-96 border-l border-gray-200 flex-col shadow-xl">
          <BarberList 
            nearbyBarbers={nearbyBarbers}
            onBarberSelect={handleBarberSelect}
            onNavigate={openInAppleMaps}
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;
