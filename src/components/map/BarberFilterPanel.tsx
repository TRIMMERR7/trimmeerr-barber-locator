
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Filter, MapPin, Users, Calendar, Heart } from "lucide-react";

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

interface BarberFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  barbers: Barber[];
  onFilteredBarbersChange: (filteredBarbers: Barber[]) => void;
}

const BarberFilterPanel = ({ isOpen, onClose, barbers, onFilteredBarbersChange }: BarberFilterPanelProps) => {
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

    // Distance filter (convert string distance to number)
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

    onFilteredBarbersChange(filtered);
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
    onFilteredBarbersChange(barbers);
  };

  React.useEffect(() => {
    applyFilters();
  }, [filters]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-gray-900">Find Your Perfect Barber</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Ethnicity Filter */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4 text-red-600" />
                Ethnicity Preference
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {ethnicities.map(ethnicity => (
                  <Badge
                    key={ethnicity}
                    variant={filters.ethnicity.includes(ethnicity) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
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

          {/* Age Range Filter */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-4 h-4 text-red-600" />
                Age Range
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Min Age</label>
                    <input
                      type="range"
                      min="18"
                      max="65"
                      value={filters.ageRange.min}
                      onChange={(e) => setFilters({
                        ...filters,
                        ageRange: { ...filters.ageRange, min: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium">{filters.ageRange.min}</span>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-gray-600">Max Age</label>
                    <input
                      type="range"
                      min="18"
                      max="65"
                      value={filters.ageRange.max}
                      onChange={(e) => setFilters({
                        ...filters,
                        ageRange: { ...filters.ageRange, max: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm font-medium">{filters.ageRange.max}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Distance Filter */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4 text-red-600" />
                Maximum Distance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({...filters, maxDistance: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0.5 mi</span>
                  <span className="font-medium">{filters.maxDistance} mi</span>
                  <span>20 mi</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specialty Filter */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Specialties</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {specialties.map(specialty => (
                  <Badge
                    key={specialty}
                    variant={filters.specialties.includes(specialty) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
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

          {/* Languages Filter */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Languages</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {languages.map(language => (
                  <Badge
                    key={language}
                    variant={filters.languages.includes(language) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
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

          {/* Personality Traits Filter */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="w-4 h-4 text-red-600" />
                Personality Match
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {personalityOptions.map(trait => (
                  <Badge
                    key={trait}
                    variant={filters.personalityTraits.includes(trait) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
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
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Reset Filters
            </Button>
            <Button onClick={onClose} className="flex-1 bg-red-600 hover:bg-red-700">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberFilterPanel;
