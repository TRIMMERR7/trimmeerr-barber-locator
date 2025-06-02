
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, MapPin, Users, Calendar, Heart, Globe, Star } from "lucide-react";
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

interface FilterCriteria {
  ethnicity: string[];
  ageRange: { min: number; max: number };
  maxDistance: number;
  priceRange: { min: number; max: number };
  specialties: string[];
  languages: string[];
  personalityTraits: string[];
}

interface FilterPageProps {
  barbers: Barber[];
  onBack: () => void;
  onBarberSelect: (barber: Barber) => void;
  onNavigate: (barber: Barber) => void;
}

const FilterPage = ({ barbers, onBack, onBarberSelect, onNavigate }: FilterPageProps) => {
  const { signOut } = useAuth();
  const [showResults, setShowResults] = useState(false);
  const [filteredBarbers, setFilteredBarbers] = useState<Barber[]>([]);
  const [filters, setFilters] = useState<FilterCriteria>({
    ethnicity: [],
    ageRange: { min: 18, max: 65 },
    maxDistance: 10,
    priceRange: { min: 20, max: 100 },
    specialties: [],
    languages: [],
    personalityTraits: []
  });

  const ethnicities = ['African American', 'Latino/Hispanic', 'Caucasian', 'Asian', 'Middle Eastern', 'Mixed'];
  const specialties = ['Fades & Braids', 'Classic Cuts', 'Beard Styling', 'Modern Styles', 'Traditional Cuts', 'Ethnic Hair'];
  const languages = ['English', 'Spanish', 'Arabic', 'Mandarin', 'French', 'Portuguese'];
  const personalityOptions = ['Friendly', 'Professional', 'Creative', 'Experienced', 'Young & Trendy', 'Traditional'];

  const toggleArrayFilter = (array: string[], value: string, setter: (newArray: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  const applyFilters = () => {
    let filtered = [...barbers];

    // Ethnicity filter
    if (filters.ethnicity.length > 0) {
      filtered = filtered.filter(barber => filters.ethnicity.includes(barber.ethnicity));
    }

    // Age filter
    filtered = filtered.filter(barber => 
      barber.age >= filters.ageRange.min && barber.age <= filters.ageRange.max
    );

    // Distance filter
    filtered = filtered.filter(barber => {
      const distance = parseFloat(barber.distance.replace(' mi', ''));
      return distance <= filters.maxDistance;
    });

    // Price filter
    filtered = filtered.filter(barber => {
      const price = parseInt(barber.price.replace('$', ''));
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });

    // Specialty filter
    if (filters.specialties.length > 0) {
      filtered = filtered.filter(barber => filters.specialties.includes(barber.specialty));
    }

    // Language filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter(barber => 
        filters.languages.some(lang => barber.languages.includes(lang))
      );
    }

    // Personality traits filter
    if (filters.personalityTraits.length > 0) {
      filtered = filtered.filter(barber => 
        filters.personalityTraits.some(trait => barber.personalityTraits.includes(trait))
      );
    }

    setFilteredBarbers(filtered);
    setShowResults(true);
  };

  const resetFilters = () => {
    setFilters({
      ethnicity: [],
      ageRange: { min: 18, max: 65 },
      maxDistance: 10,
      priceRange: { min: 20, max: 100 },
      specialties: [],
      languages: [],
      personalityTraits: []
    });
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
        {/* Header */}
        <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800 p-3 sm:p-4 flex-shrink-0">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Button variant="ghost" size="icon" onClick={() => setShowResults(false)} className="h-8 w-8 sm:h-10 sm:w-10 touch-manipulation">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </Button>
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
            </div>
            <Button variant="ghost" onClick={signOut} className="text-gray-400 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 touch-manipulation">
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Out</span>
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 bg-white">
          <div className="p-3 sm:p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Perfect Matches</h2>
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
  }

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
                TRIMMERR
              </h1>
            </div>
          </div>
          <Button variant="ghost" onClick={signOut} className="text-gray-400 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 touch-manipulation">
            <span className="hidden sm:inline">Sign Out</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Hero Section */}
          <div className="text-center py-4 sm:py-8">
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Filter className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Find Your Perfect Barber</h1>
            </div>
            <p className="text-sm sm:text-lg text-gray-600 px-2">Tell us what you're looking for and we'll match you with the ideal barber</p>
          </div>

          {/* Ethnicity Preference */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Ethnicity Preference
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {ethnicities.map(ethnicity => (
                  <Badge
                    key={ethnicity}
                    variant={filters.ethnicity.includes(ethnicity) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors p-3 sm:p-4 justify-center text-center touch-manipulation text-sm sm:text-base min-h-[44px] ${
                      filters.ethnicity.includes(ethnicity) ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleArrayFilter(
                      filters.ethnicity, 
                      ethnicity, 
                      (newArray) => setFilters({...filters, ethnicity: newArray})
                    )}
                  >
                    {ethnicity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Age Range */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Age Range
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Min Age: {filters.ageRange.min}</label>
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={filters.ageRange.min}
                    onChange={(e) => setFilters({
                      ...filters,
                      ageRange: { ...filters.ageRange, min: parseInt(e.target.value) }
                    })}
                    className="w-full h-3 sm:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Max Age: {filters.ageRange.max}</label>
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={filters.ageRange.max}
                    onChange={(e) => setFilters({
                      ...filters,
                      ageRange: { ...filters.ageRange, max: parseInt(e.target.value) }
                    })}
                    className="w-full h-3 sm:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Distance */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Maximum Distance: {filters.maxDistance} miles
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={filters.maxDistance}
                onChange={(e) => setFilters({...filters, maxDistance: parseFloat(e.target.value)})}
                className="w-full h-3 sm:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
              />
              <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-2">
                <span>0.5 mi</span>
                <span>20 mi</span>
              </div>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Specialties</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {specialties.map(specialty => (
                  <Badge
                    key={specialty}
                    variant={filters.specialties.includes(specialty) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors p-3 sm:p-4 justify-center text-center touch-manipulation text-sm sm:text-base min-h-[44px] ${
                      filters.specialties.includes(specialty) ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleArrayFilter(
                      filters.specialties, 
                      specialty, 
                      (newArray) => setFilters({...filters, specialties: newArray})
                    )}
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {languages.map(language => (
                  <Badge
                    key={language}
                    variant={filters.languages.includes(language) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors p-3 sm:p-4 justify-center text-center touch-manipulation text-sm sm:text-base min-h-[44px] ${
                      filters.languages.includes(language) ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleArrayFilter(
                      filters.languages, 
                      language, 
                      (newArray) => setFilters({...filters, languages: newArray})
                    )}
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Personality Match */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Personality Match
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {personalityOptions.map(trait => (
                  <Badge
                    key={trait}
                    variant={filters.personalityTraits.includes(trait) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors p-3 sm:p-4 justify-center text-center touch-manipulation text-sm sm:text-base min-h-[44px] ${
                      filters.personalityTraits.includes(trait) ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleArrayFilter(
                      filters.personalityTraits, 
                      trait, 
                      (newArray) => setFilters({...filters, personalityTraits: newArray})
                    )}
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 py-4 sm:py-6 px-2">
            <Button variant="outline" onClick={resetFilters} className="flex-1 py-4 sm:py-6 text-base sm:text-lg touch-manipulation min-h-[50px]">
              Reset All Filters
            </Button>
            <Button onClick={applyFilters} className="flex-1 bg-red-600 hover:bg-red-700 py-4 sm:py-6 text-base sm:text-lg touch-manipulation min-h-[50px]">
              Find My Perfect Barber
            </Button>
          </div>

          {/* Bottom padding for safe area */}
          <div className="h-6 sm:h-0"></div>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
