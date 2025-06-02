
import { useState, useEffect } from 'react';

interface GeolocationState {
  userLocation: [number, number] | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    userLocation: null,
    error: null,
    loading: true
  });

  useEffect(() => {
    console.log('useGeolocation: Starting geolocation...');

    if (!navigator.geolocation) {
      console.log('useGeolocation: Geolocation is not supported by this browser.');
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    console.log('useGeolocation: Geolocation is available, requesting position...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('useGeolocation: Got user location:', { latitude, longitude });
        setState({
          userLocation: [latitude, longitude],
          error: null,
          loading: false
        });
      },
      (error) => {
        console.error('useGeolocation: Geolocation error:', error);
        console.log('useGeolocation: Error code:', error.code);
        console.log('useGeolocation: Error message:', error.message);
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            console.log('useGeolocation: User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.log('useGeolocation: Location information is unavailable.');
            break;
          case error.TIMEOUT:
            console.log('useGeolocation: The request to get user location timed out.');
            break;
          default:
            console.log('useGeolocation: An unknown error occurred.');
            break;
        }
        
        setState({
          userLocation: null,
          error,
          loading: false
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  return state;
};
