
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
  const [error, setError] = useState<string | null>(null);

  // Fetch Apple Maps API key from Supabase secrets
  useEffect(() => {
    console.log('MapProvider: Attempting to fetch Apple Maps API key...');
    
    const fetchAppleApiKey = async () => {
      try {
        console.log('MapProvider: Calling Supabase function...');
        const { data, error } = await supabase.functions.invoke('get-apple-maps-key');
        
        console.log('MapProvider: Supabase response:', { data, error });
        
        if (error) {
          console.error('MapProvider: Supabase function error:', error);
          setError('Failed to fetch API key from Supabase');
        } else if (data?.apiKey) {
          console.log('MapProvider: API key received successfully');
          setAppleApiKey(data.apiKey);
        } else {
          console.error('MapProvider: No API key in response');
          setError('No API key found in response');
        }
      } catch (error) {
        console.error('MapProvider: Error fetching Apple Maps API key:', error);
        setError('Network error fetching API key');
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    fetchAppleApiKey();
  }, []);

  console.log('MapProvider: Current state:', { 
    isLoadingApiKey, 
    hasApiKey: !!appleApiKey, 
    error,
    barbersCount: nearbyBarbers.length 
  });

  if (isLoadingApiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-2"></div>
          <div>Loading Apple Maps API key...</div>
        </div>
      </div>
    );
  }

  if (error || !appleApiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center p-4">
          <div className="text-red-400 mb-2">⚠️ Map Loading Error</div>
          <p className="text-sm mb-4">{error || 'Apple Maps API key not available'}</p>
          <div className="text-xs text-gray-400">
            <p>Debug info:</p>
            <p>API Key: {appleApiKey ? 'Present' : 'Missing'}</p>
            <p>Error: {error || 'None'}</p>
          </div>
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
