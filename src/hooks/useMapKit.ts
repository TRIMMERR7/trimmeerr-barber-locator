
import { useState, useEffect } from 'react';

interface UseMapKitProps {
  apiKey: string;
}

export const useMapKit = ({ apiKey }: UseMapKitProps) => {
  const [mapkitLoaded, setMapkitLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useMapKit: Starting with API key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'Missing');
    
    if (!apiKey) {
      console.log('useMapKit: No API key provided');
      setError('No API key provided');
      return;
    }

    // Check if MapKit is already loaded and initialized
    if (window.mapkit && window.mapkit.init) {
      console.log('useMapKit: MapKit already exists, checking initialization state');
      
      // Try to check if it's already initialized
      try {
        // If MapKit is already initialized, we should be able to access it
        if (window.mapkit.Map) {
          console.log('useMapKit: MapKit already initialized');
          setMapkitLoaded(true);
          setError(null);
          return;
        }
      } catch (initError) {
        console.log('useMapKit: MapKit exists but not initialized, initializing...');
      }
      
      // Try to initialize with new key
      try {
        window.mapkit.init({
          authorizationCallback: (done: (token: string) => void) => {
            console.log('useMapKit: Authorization callback triggered');
            done(apiKey);
          }
        });
        setMapkitLoaded(true);
        setError(null);
        console.log('useMapKit: MapKit re-initialized with new key');
      } catch (error) {
        console.error('useMapKit: Error during re-initialization:', error);
        setError(`Initialization error: ${error.message}`);
      }
      return;
    }

    console.log('useMapKit: Loading MapKit script...');
    setError(null);
    
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.async = true;
    
    script.onload = () => {
      console.log('useMapKit: MapKit script loaded successfully');
      if (window.mapkit) {
        try {
          console.log('useMapKit: Initializing MapKit with API key');
          window.mapkit.init({
            authorizationCallback: (done: (token: string) => void) => {
              console.log('useMapKit: Authorization callback triggered with key');
              done(apiKey);
            }
          });
          setMapkitLoaded(true);
          setError(null);
          console.log('useMapKit: MapKit initialized successfully');
        } catch (error) {
          console.error('useMapKit: Error initializing MapKit:', error);
          setError(`MapKit initialization failed: ${error.message}`);
        }
      } else {
        console.error('useMapKit: MapKit not available after script load');
        setError('MapKit not available after script load');
      }
    };
    
    script.onerror = (error) => {
      console.error('useMapKit: Failed to load MapKit script:', error);
      setError('Failed to load MapKit script');
    };
    
    document.head.appendChild(script);
    console.log('useMapKit: MapKit script added to document');

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
        console.log('useMapKit: MapKit script removed from document');
      }
    };
  }, [apiKey]);

  console.log('useMapKit: Current state - loaded:', mapkitLoaded, 'error:', error);
  return { mapkitLoaded, error };
};
