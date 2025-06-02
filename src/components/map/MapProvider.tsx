
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MapboxMap from './MapboxMap';
import AppleMap from './AppleMap';

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

interface MapProviderProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const MapProvider = ({ nearbyBarbers, onBarberSelect }: MapProviderProps) => {
  const [mapType, setMapType] = useState<'leaflet' | 'apple'>('leaflet');
  const [appleApiKey, setAppleApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const handleMapTypeChange = (type: 'leaflet' | 'apple') => {
    if (type === 'apple' && !appleApiKey) {
      setShowApiKeyInput(true);
      return;
    }
    setMapType(type);
    setShowApiKeyInput(false);
  };

  const handleApiKeySubmit = () => {
    if (appleApiKey.trim()) {
      setMapType('apple');
      setShowApiKeyInput(false);
    }
  };

  return (
    <div className="h-full relative">
      {/* Map Type Selector */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          variant={mapType === 'leaflet' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleMapTypeChange('leaflet')}
          className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
        >
          OpenStreetMap
        </Button>
        <Button
          variant={mapType === 'apple' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleMapTypeChange('apple')}
          className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600"
        >
          Apple Maps
        </Button>
      </div>

      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Apple Maps API Key Required</h3>
            <p className="text-sm text-gray-600 mb-4">
              To use Apple Maps, you need to provide your Apple MapKit JS API key.
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="appleApiKey">Apple MapKit JS API Key</Label>
                <Input
                  id="appleApiKey"
                  type="text"
                  value={appleApiKey}
                  onChange={(e) => setAppleApiKey(e.target.value)}
                  placeholder="Enter your Apple Maps API key"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleApiKeySubmit} className="flex-1">
                  Use Apple Maps
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowApiKeyInput(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Get your API key from the{' '}
                <a 
                  href="https://developer.apple.com/maps/mapkitjs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Apple Developer Portal
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Render appropriate map */}
      {mapType === 'leaflet' ? (
        <MapboxMap nearbyBarbers={nearbyBarbers} onBarberSelect={onBarberSelect} />
      ) : (
        <AppleMap 
          nearbyBarbers={nearbyBarbers} 
          onBarberSelect={onBarberSelect}
          apiKey={appleApiKey}
        />
      )}
    </div>
  );
};

export default MapProvider;
