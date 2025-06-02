
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, MapPin, Navigation } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import BarberProfile from './BarberProfile';
import BarberDashboard from './BarberDashboard';

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

  const BarberList = () => (
    <div className="h-full flex flex-col bg-white">
      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search barbers, services..."
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base bg-gray-50"
          />
        </div>
      </div>

      {/* Barber List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Nearby Barbers</h3>
            <span className="text-sm text-gray-500">{nearbyBarbers.length} found</span>
          </div>
          
          {nearbyBarbers.map((barber) => (
            <Card 
              key={barber.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-gray-100 touch-manipulation transform hover:scale-[1.02]"
              onClick={() => {
                setSelectedBarber(barber);
                setIsSheetOpen(false);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{barber.name}</h3>
                    <p className="text-red-600 font-medium mb-2">{barber.specialty}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-gray-900">{barber.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{barber.distance}</span>
                      </div>
                      <span className="text-gray-500">{barber.experience}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-600">{barber.price}</div>
                      <div className="text-sm text-gray-500">30 min</div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInAppleMaps(barber);
                      }}
                      size="sm"
                      variant="outline"
                      className="touch-manipulation"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Navigate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

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
                <BarberList />
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
        {/* Map Section */}
        <div className="flex-1 relative">
          {/* Steps Indicator */}
          <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-sm rounded-2xl p-4 z-10 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <span className="text-white font-medium hidden sm:inline">Find</span>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-600 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <span className="text-gray-400 hidden sm:inline">Select</span>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-600 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <span className="text-gray-400 hidden sm:inline">Book</span>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden">
            {/* Your Location (Blue Dot) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-6 h-6 bg-blue-500 rounded-full shadow-lg"></div>
                <div className="absolute inset-0 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                You
              </div>
            </div>

            {/* Barber Locations (Red Dots) - Now Clickable */}
            {nearbyBarbers.map((barber, index) => (
              <button
                key={barber.id}
                onClick={() => setSelectedBarber(barber)}
                className="absolute group touch-manipulation transform transition-all duration-200 hover:scale-125 focus:scale-125 focus:outline-none"
                style={{
                  top: `${45 + index * 15}%`,
                  left: `${40 + index * 20}%`
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-red-600 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-full h-full rounded-full object-cover border-2 border-red-600"
                    />
                  </div>
                  <div className="absolute inset-0 w-8 h-8 bg-red-600 rounded-full animate-ping opacity-40"></div>
                </div>
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  <div className="font-semibold">{barber.name}</div>
                  <div className="text-red-100">{barber.specialty}</div>
                  <div className="text-red-100">{barber.price}</div>
                </div>
              </button>
            ))}

            {/* Grid overlay for better visual */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[length:40px_40px]"></div>
          </div>
        </div>

        {/* Barber List - Desktop Only */}
        <div className="hidden lg:flex w-96 border-l border-gray-200 flex-col shadow-xl">
          <BarberList />
        </div>
      </div>
    </div>
  );
};

export default MapView;
