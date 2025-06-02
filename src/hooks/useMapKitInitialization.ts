
import { useState, useEffect } from 'react';

interface UseMapKitInitializationProps {
  apiKey: string;
}

export const useMapKitInitialization = ({ apiKey }: UseMapKitInitializationProps) => {
  const [mapkitLoaded, setMapkitLoaded] = useState(false);

  useEffect(() => {
    if (window.mapkit) {
      setMapkitLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
    script.onload = () => {
      window.mapkit.init({
        authorizationCallback: (done: (token: string) => void) => {
          done(apiKey);
        }
      });
      setMapkitLoaded(true);
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
