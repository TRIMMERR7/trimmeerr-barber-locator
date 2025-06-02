
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
  userType: 'barber' | 'client' | 'guest';
  onLogout: () => void;
}

const MapView = ({ userType, onLogout }: MapViewProps) => {
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

  if (showDashboard && userType === 'barber') {
    return <BarberDashboard onBack={() => setShowDashboard(false)} />;
  }

  if (selectedBarber) {
    return (
      <BarberProfile 
        barber={selectedBarber} 
        onBack={() => setSelectedBarber(null)}
        userType={userType}
      />
    );
  }

  const BarberList = () => (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <input
          type="text"
          placeholder="Search barbers..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
        />
      </div>

      {/* Barber List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-3">
          {nearbyBarbers.map((barber) => (
            <Card 
              key={barber.id} 
              className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 touch-manipulation"
              onClick={() => {
                setSelectedBarber(barber);
                setIsSheetOpen(false);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black text-base">{barber.name}</h3>
                    <p className="text-sm text-gray-600">{barber.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm text-black">{barber.rating}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{barber.distance}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-base font-bold text-red-600">{barber.price}</div>
                    <div className="text-sm text-gray-500">30 min</div>
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
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
              alt="TRIMMERR Logo" 
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-white">TRIMMERR</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden text-white hover:bg-gray-800 touch-manipulation"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <BarberList />
              </SheetContent>
            </Sheet>

            {userType === 'barber' && (
              <Button 
                onClick={() => setShowDashboard(true)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm touch-manipulation"
              >
                <span className="hidden sm:inline">Manage Profile</span>
                <span className="sm:hidden">Profile</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="text-gray-400 hover:text-white text-sm touch-manipulation"
            >
              {userType === 'guest' ? 'Sign In' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Map Section */}
        <div className="flex-1 relative">
          {/* Steps Indicator */}
          <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-3 z-10">
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white text-black rounded-full flex items-center justify-center font-bold text-xs">1</div>
                <span className="text-white hidden sm:inline">Find</span>
              </div>
              <div className="w-4 sm:w-8 h-px bg-gray-600"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 text-gray-400 rounded-full flex items-center justify-center font-bold text-xs">2</div>
                <span className="text-gray-400 hidden sm:inline">Select</span>
              </div>
              <div className="w-4 sm:w-8 h-px bg-gray-600"></div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-600 text-gray-400 rounded-full flex items-center justify-center font-bold text-xs">3</div>
                <span className="text-gray-400 hidden sm:inline">Book</span>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="h-full bg-gray-800 relative">
            {/* Your Location (Blue Dot) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>

            {/* Barber Locations (Red Dots) */}
            {nearbyBarbers.map((barber, index) => (
              <button
                key={barber.id}
                onClick={() => setSelectedBarber(barber)}
                className="absolute group touch-manipulation"
                style={{
                  top: `${45 + index * 15}%`,
                  left: `${40 + index * 20}%`
                }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-red-600 rounded-full group-hover:scale-150 transition-transform"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-red-600 rounded-full animate-ping opacity-40"></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Barber List - Desktop Only */}
        <div className="hidden lg:flex w-80 bg-white border-l border-gray-200 flex-col">
          <BarberList />
        </div>
      </div>
    </div>
  );
};

export default MapView;
