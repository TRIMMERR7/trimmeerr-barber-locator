
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
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
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);

  // Fetch Apple Maps API key from Supabase secrets
  useEffect(() => {
    const fetchAppleApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-apple-maps-key');
        if (data?.apiKey) {
          setAppleApiKey(data.apiKey);
          console.log('Apple Maps API key loaded successfully');
        }
      } catch (error) {
        console.error('Error fetching Apple Maps API key:', error);
      }
    };

    fetchAppleApiKey();
  }, []);

  const handleMapTypeChange = (type: 'leaflet' | 'apple') => {
    if (type === 'apple' && !appleApiKey) {
      console.log('Apple Maps API key not available');
      return;
    }
    setMapType(type);
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
          disabled={!appleApiKey}
          className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 disabled:opacity-50"
        >
          Apple Maps
        </Button>
      </div>

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
