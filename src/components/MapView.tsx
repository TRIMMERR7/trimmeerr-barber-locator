
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BarberProfile from './BarberProfile';
import AdSlider from './AdSlider';

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
  
  // Mock barber data - in real app, this would come from API
  const nearbyBarbers: Barber[] = [
    {
      id: '1',
      name: 'Marcus Johnson',
      rating: 4.9,
      specialty: 'Fades & Braids',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      price: '$25-45',
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
      price: '$20-35',
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
      price: '$30-50',
      distance: '0.7 mi',
      experience: '6 years',
      lat: 40.7825,
      lng: -73.9640
    }
  ];

  if (selectedBarber) {
    return (
      <BarberProfile 
        barber={selectedBarber} 
        onBack={() => setSelectedBarber(null)}
        userType={userType}
      />
    );
  }

  return (
    <div className="min-h-screen bg-trimmer-dark">
      {/* Header */}
      <div className="bg-trimmer-slate border-b border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold gradient-text">TRIMMERR</h1>
            <p className="text-slate-400 text-sm">
              {userType === 'guest' ? 'Browse as Guest' : `Welcome, ${userType}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-trimmer-blue text-trimmer-blue">
              {nearbyBarbers.length} nearby
            </Badge>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="text-slate-400 hover:text-white"
            >
              {userType === 'guest' ? 'Sign In' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Map Area Placeholder with Ads */}
      <div className="relative">
        {/* Simulated Map */}
        <div className="h-96 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
          {/* Your Location (Blue Dot) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-trimmer-blue rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-trimmer-blue rounded-full animate-ping opacity-30"></div>
            </div>
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-trimmer-blue font-medium">
              You
            </span>
          </div>

          {/* Barber Locations (Red Dots) */}
          {nearbyBarbers.map((barber, index) => (
            <button
              key={barber.id}
              onClick={() => setSelectedBarber(barber)}
              className="absolute group"
              style={{
                top: `${45 + index * 15}%`,
                left: `${40 + index * 20}%`
              }}
            >
              <div className="relative">
                <div className="w-3 h-3 bg-trimmer-red rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="absolute inset-0 w-3 h-3 bg-trimmer-red rounded-full animate-ping opacity-40"></div>
              </div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {barber.name}
              </div>
            </button>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="secondary" className="bg-white/90 text-black">
              📍
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/90 text-black">
              +
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/90 text-black">
              -
            </Button>
          </div>
        </div>

        {/* Advertisement Slider */}
        <AdSlider />
      </div>

      {/* Barber List */}
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-4">Nearby Barbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyBarbers.map((barber) => (
            <Card 
              key={barber.id} 
              className="glass-card hover:bg-white/20 transition-all cursor-pointer group"
              onClick={() => setSelectedBarber(barber)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-trimmer-red"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-trimmer-blue transition-colors">
                      {barber.name}
                    </h3>
                    <p className="text-sm text-slate-400">{barber.specialty}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm text-white">{barber.rating}</span>
                      </div>
                      <span className="text-slate-500">•</span>
                      <span className="text-sm text-slate-400">{barber.distance}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-sm text-trimmer-blue">{barber.price}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
