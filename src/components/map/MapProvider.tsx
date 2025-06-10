
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
  const [retryCount, setRetryCount] = useState(0);

  const fetchAppleApiKey = async () => {
    console.log('MapProvider: Fetching Apple Maps API key... (attempt', retryCount + 1, ')');
    
    try {
      setError(null);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('MapProvider: No active session found');
        setError('Please log in to use the map feature');
        setIsLoadingApiKey(false);
        return;
      }

      console.log('MapProvider: Session found, calling function...');
      
      const { data, error } = await supabase.functions.invoke('get-apple-maps-key');
      
      console.log('MapProvider: API key response:', { 
        hasData: !!data, 
        hasApiKey: !!(data?.apiKey),
        error: error?.message 
      });
      
      if (error) {
        console.error('MapProvider: Error from function:', error);
        setError(`Failed to fetch API key: ${error.message}`);
      } else if (data?.apiKey) {
        setAppleApiKey(data.apiKey);
        console.log('MapProvider: Apple Maps API key loaded successfully');
        setError(null);
      } else {
        console.warn('MapProvider: No API key in response');
        setError('No API key available in response');
      }
    } catch (networkError: any) {
      console.error('MapProvider: Network error fetching Apple Maps API key:', networkError);
      setError(`Network error: ${networkError.message}`);
    } finally {
      setIsLoadingApiKey(false);
    }
  };

  // Fetch Apple Maps API key from Supabase secrets
  useEffect(() => {
    fetchAppleApiKey();
  }, [retryCount]);

  const handleRetry = () => {
    setIsLoadingApiKey(true);
    setRetryCount(prev => prev + 1);
  };

  console.log('MapProvider: Render state - loading:', isLoadingApiKey, 'apiKey:', !!appleApiKey, 'error:', error);

  if (isLoadingApiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Loading Apple Maps API...</span>
          </div>
          {retryCount > 0 && (
            <p className="text-sm text-gray-400">Attempt {retryCount + 1}</p>
          )}
        </div>
      </div>
    );
  }

  if (error || !appleApiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center max-w-md p-4">
          <p className="text-red-400 font-semibold mb-2">Apple Maps unavailable</p>
          <p className="text-sm text-gray-400 mb-4">
            {error || 'No API key configured'}
          </p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
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
