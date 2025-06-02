
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
        
        // Get the current session with fresh token
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('MapProvider: Session check:', { 
          hasSession: !!session, 
          sessionError: sessionError?.message,
          hasAccessToken: !!session?.access_token
        });
        
        if (sessionError || !session?.access_token) {
          console.log('MapProvider: No valid session found, user needs to login');
          setError('Please log in to access the map');
          setIsLoadingApiKey(false);
          return;
        }
        
        // Call the edge function with proper authorization
        const { data, error } = await supabase.functions.invoke('get-apple-maps-key', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          }
        });
        
        console.log('MapProvider: Supabase response:', { 
          data, 
          error: error?.message,
          hasApiKey: !!data?.apiKey 
        });
        
        if (error) {
          console.error('MapProvider: Supabase function error:', error);
          setError('Failed to fetch API key from Supabase: ' + (error.message || 'Unknown error'));
        } else if (data?.apiKey) {
          console.log('MapProvider: API key received successfully');
          setAppleApiKey(data.apiKey);
          setError(null);
        } else {
          console.error('MapProvider: No API key in response');
          setError('No API key found in response');
        }
      } catch (error) {
        console.error('MapProvider: Error fetching Apple Maps API key:', error);
        setError('Network error fetching API key: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setIsLoadingApiKey(false);
      }
    };

    fetchAppleApiKey();
  }, []); // Empty dependency array to prevent re-fetching

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
          {error?.includes('log in') && (
            <div className="mt-4">
              <p className="text-sm text-blue-400">Please sign in to access the map features</p>
            </div>
          )}
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
