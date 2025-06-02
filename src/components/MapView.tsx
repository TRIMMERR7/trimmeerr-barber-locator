
import React, { useState } from 'react';
import BarberProfile from './BarberProfile';
import BarberDashboard from './BarberDashboard';
import FilterPage from './FilterPage';
import AIGeminiPage from './AIGeminiPage';
import MapHeader from './map/MapHeader';
import MapLayout from './map/MapLayout';

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

interface MapViewProps {
  userType: 'barber' | 'client';
}

const MapView = ({ userType }: MapViewProps) => {
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showFilterPage, setShowFilterPage] = useState(false);
  const [showAIGeminiPage, setShowAIGeminiPage] = useState(false);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  
  // Enhanced barber data with coordinates very close to user's location for visibility
  const nearbyBarbers: Barber[] = [
    {
      id: '1',
      name: 'Marcus Johnson',
      rating: 4.9,
      specialty: 'Fades & Braids',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      price: '$35',
      distance: '0.1 mi',
      experience: '8 years',
      lat: 29.771500, // Very close to user location
      lng: -95.383500,
      ethnicity: 'African American',
      age: 32,
      languages: ['English', 'Spanish'],
      personalityTraits: ['Friendly', 'Creative', 'Experienced'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: '2',
      name: 'Carlos Rivera',
      rating: 4.8,
      specialty: 'Classic Cuts',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      price: '$30',
      distance: '0.2 mi',
      experience: '12 years',
      lat: 29.772000, // Very close to user location
      lng: -95.382000,
      ethnicity: 'Latino/Hispanic',
      age: 45,
      languages: ['Spanish', 'English'],
      personalityTraits: ['Professional', 'Traditional', 'Experienced'],
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: '3',
      name: 'Ahmed Hassan',
      rating: 4.7,
      specialty: 'Beard Styling',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
      price: '$40',
      distance: '0.3 mi',
      experience: '6 years',
      lat: 29.769500, // Very close to user location
      lng: -95.384000,
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
      distance: '0.4 mi',
      experience: '5 years',
      lat: 29.770000, // Very close to user location
      lng: -95.381500,
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
      distance: '0.5 mi',
      experience: '15 years',
      lat: 29.771000, // Very close to user location
      lng: -95.384500,
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
        onAIAssistantClick={handleMenuClick}
        onDashboardClick={userType === 'barber' ? () => setShowDashboard(true) : undefined}
      />

      <MapLayout
        displayBarbers={displayBarbers}
        onBarberSelect={handleBarberSelect}
        onNavigate={openInAppleMaps}
      />
    </div>
  );
};

export default MapView;
