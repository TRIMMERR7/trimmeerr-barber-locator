
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import AppleMap from './AppleMap';
import { Barber } from '@/types/barber';

interface MapProviderProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const MapProvider = ({ nearbyBarbers, onBarberSelect }: MapProviderProps) => {
  const [appleApiKey, setAppleApiKey] = useState('');
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(true);

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
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    fetchAppleApiKey();
  }, []);

  if (isLoadingApiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white">Loading Apple Maps...</div>
      </div>
    );
  }

  if (!appleApiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <p>Apple Maps API key not available</p>
          <p className="text-sm text-gray-400 mt-2">Please configure your Apple Maps API key</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <AppleMap 
        nearbyBarbers={nearbyBarbers} 
        onBarberSelect={onBarberSelect}
        apiKey={appleApiKey}
      />
    </div>
  );
};

export default MapProvider;
