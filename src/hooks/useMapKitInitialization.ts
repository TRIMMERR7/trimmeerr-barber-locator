
import { useState, useEffect } from 'react';

interface UseMapKitInitializationProps {
  apiKey: string;
}

export const useMapKitInitialization = ({ apiKey }: UseMapKitInitializationProps) => {
  const [mapkitLoaded, setMapkitLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      console.log('MapKit: No API key provided');
      setError('No API key provided');
      return;
    }

    console.log('MapKit: Starting initialization with API key present');

    // Check if MapKit is already available and initialized
    if (window.mapkit && window.mapkit.isInitialized) {
      console.log('MapKit: Already initialized');
      setMapkitLoaded(true);
      setError(null);
      return;
    }

    // If MapKit script exists but not initialized
    if (window.mapkit && !window.mapkit.isInitialized) {
      console.log('MapKit: Script loaded, initializing...');
      try {
        window.mapkit.init({
          authorizationCallback: (done: (token: string) => void) => {
            console.log('MapKit: Authorization callback called');
            done(apiKey);
          }
        });
        console.log('MapKit: Initialization complete');
        setMapkitLoaded(true);
        setError(null);
      } catch (initError) {
        console.error('MapKit: Error initializing:', initError);
        setError('Failed to initialize MapKit');
      }
      return;
    }

    // Load MapKit script
    console.log('MapKit: Loading script...');
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.crossOrigin = 'anonymous';
    
    const timeout = setTimeout(() => {
      console.error('MapKit: Script loading timeout');
      setError('Script loading timeout - please check your internet connection');
    }, 15000); // Increased timeout
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log('MapKit: Script loaded successfully');
      
      if (!window.mapkit) {
        setError('MapKit script loaded but window.mapkit is not available');
        return;
      }
      
      try {
        console.log('MapKit: Initializing after script load...');
        window.mapkit.init({
          authorizationCallback: (done: (token: string) => void) => {
            console.log('MapKit: Authorization callback called with API key');
            done(apiKey);
          }
        });
        console.log('MapKit: Initialization complete');
        setMapkitLoaded(true);
        setError(null);
      } catch (initError) {
        console.error('MapKit: Error during initialization:', initError);
        setError(`Failed to initialize MapKit: ${initError.message}`);
      }
    };

    script.onerror = (scriptError) => {
      clearTimeout(timeout);
      console.error('MapKit: Error loading script:', scriptError);
      setError('Failed to load MapKit script - please check your internet connection');
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeout);
      // Don't remove script as it might be used by other components
    };
  }, [apiKey]);

  return { mapkitLoaded, error };
};
