
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
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
      lat: 40.7829,
      lng: -73.9654
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
      lat: 40.7831,
      lng: -73.9665
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
      lat: 40.7825,
      lng: -73.9640
    }
  ];

  const openInAppleMaps = (barber: Barber) => {
    const appleMapsUrl = `https://maps.apple.com/?daddr=${barber.lat},${barber.lng}&dirflg=d&t=m`;
    window.open(appleMapsUrl, '_blank');
  };

  if (showDashboard && userType === 'barber') {
    return <BarberDashboard onBack={() => setShowDashboard(false)} />;
  }

  if (selectedBarber) {
    return (
      <BarberProfile 
        barber={selectedBarber} 
        onBack={() => setSelectedBarber(null)}
        userType={userType}
        onNavigate={() => openInAppleMaps(selectedBarber)}
      />
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
              alt="TRIMMERR Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              TRIMMERR
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden text-white hover:bg-gray-800 rounded-xl touch-manipulation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 p-0">
                <BarberList 
                  nearbyBarbers={nearbyBarbers}
                  onBarberSelect={setSelectedBarber}
                  onNavigate={openInAppleMaps}
                  onSheetClose={() => setIsSheetOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {userType === 'barber' && (
              <Button 
                onClick={() => setShowDashboard(true)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl touch-manipulation shadow-lg"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Profile</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={signOut}
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl touch-manipulation"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <MapContainer 
          nearbyBarbers={nearbyBarbers}
          onBarberSelect={setSelectedBarber}
        />

        {/* Barber List - Desktop Only */}
        <div className="hidden lg:flex w-96 border-l border-gray-200 flex-col shadow-xl">
          <BarberList 
            nearbyBarbers={nearbyBarbers}
            onBarberSelect={setSelectedBarber}
            onNavigate={openInAppleMaps}
          />
        </div>
      </div>
    </div>
  );
};

export default MapView;
