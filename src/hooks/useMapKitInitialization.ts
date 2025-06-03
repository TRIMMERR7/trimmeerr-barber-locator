
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

    console.log('MapKit: Starting initialization with API key:', !!apiKey);

    if (window.mapkit) {
      console.log('MapKit: Already loaded, checking if initialized...');
      if (window.mapkit.isInitialized) {
        console.log('MapKit: Already initialized');
        setMapkitLoaded(true);
        return;
      } else {
        console.log('MapKit: Initializing existing mapkit...');
        try {
          window.mapkit.init({
            authorizationCallback: (done: (token: string) => void) => {
              console.log('MapKit: Authorization callback called');
              done(apiKey);
            }
          });
          setMapkitLoaded(true);
          console.log('MapKit: Initialization complete');
        } catch (error) {
          console.error('MapKit: Error initializing:', error);
          setError('Failed to initialize MapKit');
        }
      }
      return;
    }

    console.log('MapKit: Loading script...');
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.crossOrigin = 'anonymous';
    
    const timeout = setTimeout(() => {
      console.error('MapKit: Script loading timeout');
      setError('Script loading timeout');
    }, 10000);
    
    script.onload = () => {
      clearTimeout(timeout);
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
      } catch (error) {
        console.error('MapKit: Error during initialization:', error);
        setError('Failed to initialize MapKit');
      }
    };

    script.onerror = (error) => {
      clearTimeout(timeout);
      console.error('MapKit: Error loading script:', error);
      setError('Failed to load MapKit script');
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeout);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  return { mapkitLoaded, error };
};
