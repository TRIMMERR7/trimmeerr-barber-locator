
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import BarberProfile from './BarberProfile';
import BarberDashboard from './BarberDashboard';
import BarberList from './map/BarberList';
import MapContainer from './map/MapContainer';
import FilterPage from './FilterPage';

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
}

interface MapViewProps {
  userType: 'barber' | 'client';
}

const MapView = ({ userType }: MapViewProps) => {
  const { signOut } = useAuth();
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  
  // Enhanced barber data with ethnicity, age, languages, and personality traits
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
      lat: 29.7720,
      lng: -95.3850,
      ethnicity: 'African American',
      age: 32,
      languages: ['English', 'Spanish'],
      personalityTraits: ['Friendly', 'Creative', 'Experienced']
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
      lat: 29.7750,
      lng: -95.3800,
      ethnicity: 'Latino/Hispanic',
      age: 45,
      languages: ['Spanish', 'English'],
      personalityTraits: ['Professional', 'Traditional', 'Experienced']
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
      lat: 29.7690,
      lng: -95.3900,
      ethnicity: 'Middle Eastern',
      age: 28,
      languages: ['Arabic', 'English', 'French'],
      personalityTraits: ['Creative', 'Young & Trendy', 'Professional']
    },
    {
      id: '4',
      name: 'David Kim',
      rating: 4.6,
      specialty: 'Modern Styles',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      price: '$45',
      distance: '1.2 mi',
      experience: '5 years',
      lat: 29.7800,
      lng: -95.3700,
      ethnicity: 'Asian',
      age: 26,
      languages: ['English', 'Mandarin'],
      personalityTraits: ['Young & Trendy', 'Creative', 'Friendly']
    },
    {
      id: '5',
      name: 'Michael Thompson',
      rating: 4.5,
      specialty: 'Traditional Cuts',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      price: '$25',
      distance: '1.5 mi',
      experience: '15 years',
      lat: 29.7650,
      lng: -95.3950,
      ethnicity: 'Caucasian',
      age: 52,
      languages: ['English'],
      personalityTraits: ['Traditional', 'Professional', 'Experienced']
    }
  ];

  // Initialize filtered barbers
  React.useEffect(() => {
    if (filteredBarbers.length === 0) {
      setFilteredBarbers(nearbyBarbers);
    }
  }, []);

  const displayBarbers = filteredBarbers.length > 0 ? filteredBarbers : nearbyBarbers;

  const handleBarberSelect = (barber: Barber) => {
    console.log('MapView: Barber selected:', barber.name);
    setSelectedBarber(barber);
  };

  const openInAppleMaps = (barber: Barber) => {
    const appleMapsUrl = `https://maps.apple.com/?daddr=${barber.lat},${barber.lng}&dirflg=d&t=m`;
    window.open(appleMapsUrl, '_blank');
  };

  const handleMenuClick = () => {
    setShowFilterPage(true);
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
            {/* Find Your Barber Button */}
            <Button 
              variant="ghost" 
              onClick={handleMenuClick}
              className="text-red-500 hover:text-red-400 hover:bg-gray-800 rounded-xl touch-manipulation h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm font-semibold"
            >
              Find Your Barber
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
          nearbyBarbers={displayBarbers}
          onBarberSelect={handleBarberSelect}
        />

        {/* Barber List - Desktop Only */}
        <div className="hidden lg:flex w-96 border-l border-gray-200 flex-col shadow-xl">
          <BarberList 
            nearbyBarbers={displayBarbers}
            onBarberSelect={handleBarberSelect}
            onNavigate={openInAppleMaps}
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;
