
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
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
  const [appleApiKey, setAppleApiKey] = useState('');
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Apple Maps API key from Supabase secrets
  useEffect(() => {
    const fetchAppleApiKey = async () => {
      console.log('MapProvider: Fetching Apple Maps API key...');
      try {
        const { data, error } = await supabase.functions.invoke('get-apple-maps-key');
        console.log('MapProvider: API key response:', { data, error });
        
        if (error) {
          console.error('MapProvider: Error from function:', error);
          setError('Failed to fetch API key');
        } else if (data?.apiKey) {
          setAppleApiKey(data.apiKey);
          console.log('MapProvider: Apple Maps API key loaded successfully');
        } else {
          console.warn('MapProvider: No API key in response');
          setError('No API key available');
        }
      } catch (error) {
        console.error('MapProvider: Error fetching Apple Maps API key:', error);
        setError('Network error while fetching API key');
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    fetchAppleApiKey();
  }, []);

  console.log('MapProvider: Render state - loading:', isLoadingApiKey, 'apiKey:', !!appleApiKey, 'error:', error);

  if (isLoadingApiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Loading Apple Maps API...
        </div>
      </div>
    );
  }

  if (error || !appleApiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <p>Apple Maps unavailable</p>
          <p className="text-sm text-gray-400 mt-2">{error || 'No API key configured'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <AppleMap 
        nearbyBarbers={nearbyBarbers} 
        onBarberSelect={onBarberSelect}
        apiKey={appleApiKey}
      />
    </div>
  );
};

export default MapProvider;
