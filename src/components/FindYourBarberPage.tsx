
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MapPin, Users, Calendar, Heart, Globe, Star, Filter } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import BarberList from './map/BarberList';

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

interface FindYourBarberPageProps {
  barbers: Barber[];
  onBack: () => void;
  onBarberSelect: (barber: Barber) => void;
  onNavigate: (barber: Barber) => void;
}

const FindYourBarberPage = ({ barbers, onBack, onBarberSelect, onNavigate }: FindYourBarberPageProps) => {
  const { signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>(barbers);

  // Filter barbers based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = barbers.filter(barber => 
      barber.name.toLowerCase().includes(query.toLowerCase()) ||
      barber.specialty.toLowerCase().includes(query.toLowerCase()) ||
      barber.ethnicity.toLowerCase().includes(query.toLowerCase()) ||
      barber.languages.some(lang => lang.toLowerCase().includes(query.toLowerCase())) ||
      barber.personalityTraits.some(trait => trait.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredBarbers(filtered);
  };

  const quickFilters = [
    { label: 'Nearby', action: () => setFilteredBarbers(barbers.slice(0, 3)) },
    { label: 'Top Rated', action: () => setFilteredBarbers([...barbers].sort((a, b) => b.rating - a.rating)) },
    { label: 'Affordable', action: () => setFilteredBarbers([...barbers].sort((a, b) => parseInt(a.price.replace('$', '')) - parseInt(b.price.replace('$', '')))) },
    { label: 'Experienced', action: () => setFilteredBarbers([...barbers].sort((a, b) => parseInt(b.experience) - parseInt(a.experience))) }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 sm:h-10 sm:w-10 touch-manipulation">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Button>
            <div className="flex items-center gap-1 sm:gap-2 min-w-0">
              <img 
                src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
                alt="TRIMMERR Logo" 
                className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
              />
              <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent truncate">
                Find Your Barber
              </h1>
            </div>
          </div>
          <Button variant="ghost" onClick={signOut} className="text-gray-400 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 touch-manipulation">
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, specialty, language, or style..."
              className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-red-600 hover:text-white transition-colors border-white/20 text-gray-300"
                onClick={filter.action}
              >
                {filter.label}
              </Badge>
            ))}
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-red-600 hover:text-white transition-colors border-white/20 text-gray-300"
              onClick={() => setFilteredBarbers(barbers)}
            >
              Show All
            </Badge>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 bg-white">
        <div className="p-3 sm:p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {searchQuery ? `Results for "${searchQuery}"` : 'Available Barbers'}
            </h2>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-xs sm:text-sm text-gray-600">{filteredBarbers.length} barbers found</span>
            </div>
          </div>
        </div>
        <BarberList 
          nearbyBarbers={filteredBarbers}
          onBarberSelect={onBarberSelect}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

export default FindYourBarberPage;
