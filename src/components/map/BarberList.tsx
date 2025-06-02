
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Navigation, Users, Globe } from "lucide-react";

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

interface BarberListProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  onNavigate: (barber: Barber) => void;
  onSheetClose?: () => void;
}

const BarberList = ({ nearbyBarbers, onBarberSelect, onNavigate, onSheetClose }: BarberListProps) => {
  const handleBarberClick = (barber: Barber) => {
    onBarberSelect(barber);
    if (onSheetClose) {
      onSheetClose();
    }
  };

  return (
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
              onClick={() => handleBarberClick(barber)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={barber.image}
                      alt={barber.name}
                      className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">{barber.name}</h3>
                        <p className="text-red-600 font-medium">{barber.specialty}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-600">{barber.price}</div>
                        <div className="text-sm text-gray-500">30 min</div>
                      </div>
                    </div>
                    
                    {/* Enhanced Info */}
                    <div className="space-y-2">
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
                      
                      {/* Ethnicity and Age */}
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{barber.ethnicity}</span>
                        </div>
                        <span>Age {barber.age}</span>
                      </div>
                      
                      {/* Languages */}
                      {barber.languages.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-600">
                          <Globe className="w-3 h-3" />
                          <span>{barber.languages.join(', ')}</span>
                        </div>
                      )}
                      
                      {/* Personality Traits */}
                      <div className="flex flex-wrap gap-1">
                        {barber.personalityTraits.slice(0, 2).map((trait, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-red-50 text-red-600 rounded-full"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(barber);
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarberList;
