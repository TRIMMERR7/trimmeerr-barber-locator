
import { useState, useEffect } from 'react';

interface UseMapKitInitializationProps {
  apiKey: string;
}

export const useMapKitInitialization = ({ apiKey }: UseMapKitInitializationProps) => {
  const [mapkitLoaded, setMapkitLoaded] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      console.log('MapKit: No API key provided');
      return;
    }

    if (window.mapkit) {
      console.log('MapKit: Already loaded, checking if initialized...');
      if (window.mapkit.isInitialized) {
        console.log('MapKit: Already initialized');
        setMapkitLoaded(true);
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
        } catch (error) {
          console.error('MapKit: Error initializing:', error);
        }
      }
      return;
    }

    console.log('MapKit: Loading script...');
    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
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
      }
    };

    script.onerror = (error) => {
      console.error('MapKit: Error loading script:', error);
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  return { mapkitLoaded };
};
