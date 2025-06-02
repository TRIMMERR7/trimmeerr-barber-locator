
import { useState, useEffect } from 'react';

interface UseMapKitProps {
  apiKey: string;
}

export const useMapKit = ({ apiKey }: UseMapKitProps) => {
  const [mapkitLoaded, setMapkitLoaded] = useState(false);

  useEffect(() => {
    if (window.mapkit) {
      setMapkitLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.onload = () => {
      if (window.mapkit) {
        window.mapkit.init({
          authorizationCallback: (done: (token: string) => void) => {
            done(apiKey);
          }
        });
        setMapkitLoaded(true);
        console.log('MapKit loaded and initialized');
      }
    };
    script.onerror = () => {
      console.error('Failed to load MapKit script');
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
