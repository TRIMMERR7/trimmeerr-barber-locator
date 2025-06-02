
import { useState, useEffect } from 'react';

interface UseMapKitProps {
  apiKey: string;
}

export const useMapKit = ({ apiKey }: UseMapKitProps) => {
  const [mapkitLoaded, setMapkitLoaded] = useState(false);

  useEffect(() => {
    console.log('useMapKit: Starting with API key:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      console.log('useMapKit: No API key provided');
      return;
    }

    if (window.mapkit && window.mapkit.init) {
      console.log('useMapKit: MapKit already exists, checking if initialized');
      try {
        // Try to initialize with new key if not already done
        window.mapkit.init({
          authorizationCallback: (done: (token: string) => void) => {
            console.log('useMapKit: Authorization callback triggered');
            done(apiKey);
          }
        });
        setMapkitLoaded(true);
        console.log('useMapKit: MapKit re-initialized with new key');
      } catch (error) {
        console.log('useMapKit: MapKit already initialized, setting loaded state');
        setMapkitLoaded(true);
      }
      return;
    }

    console.log('useMapKit: Loading MapKit script...');
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.onload = () => {
      console.log('useMapKit: MapKit script loaded');
      if (window.mapkit) {
        try {
          window.mapkit.init({
            authorizationCallback: (done: (token: string) => void) => {
              console.log('useMapKit: Authorization callback triggered with key');
              done(apiKey);
            }
          });
          setMapkitLoaded(true);
          console.log('useMapKit: MapKit initialized successfully');
        } catch (error) {
          console.error('useMapKit: Error initializing MapKit:', error);
        }
      } else {
        console.error('useMapKit: MapKit not available after script load');
      }
    };
    script.onerror = () => {
      console.error('useMapKit: Failed to load MapKit script');
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

  console.log('useMapKit: Current state - loaded:', mapkitLoaded);
  return { mapkitLoaded };
};
