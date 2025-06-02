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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-lg font-medium text-white">Step 2</h1>
            <p className="text-white text-sm">Search for the Perfect Barber</p>
          </div>
          <Button 
            variant="ghost" 
            onClick={onLogout}
            className="text-gray-400 hover:text-white"
          >
            {userType === 'guest' ? 'Sign In' : 'Sign Out'}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Find a Barber Near You"
              className="w-full h-12 pl-12 pr-4 bg-gray-100 border border-gray-300 rounded-lg text-black placeholder-gray-500"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Filter tabs */}
          <div className="flex gap-4 mt-4">
            <Button variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              Haircut
            </Button>
            <Button variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              Rating
            </Button>
            <Button variant="outline" className="bg-white border-gray-300 text-black hover:bg-gray-50">
              Price
            </Button>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="relative">
        <div className="h-96 bg-gray-200 relative overflow-hidden">
          {/* Your Location (Blue Dot) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-30"></div>
            </div>
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
                <div className="w-3 h-3 bg-red-600 rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="absolute inset-0 w-3 h-3 bg-red-600 rounded-full animate-ping opacity-40"></div>
              </div>
            </button>
          ))}

          {/* Map marker at bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        </div>

        <AdSlider />
      </div>

      {/* Services and Reviews Section */}
      <div className="p-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-4">Services</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-black">Haircut</h4>
                  <p className="text-sm text-gray-600">40 min • $60</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-black">Beard Trim</h4>
                  <p className="text-sm text-gray-600">30 min • $20</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-black mb-4">Reviews</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://images.unsplash.com/photo-${1472099645785 + i}?w=100&h=100&fit=crop&crop=face`}
                  alt={`Review ${i}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
