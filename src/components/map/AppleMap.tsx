
import React, { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';

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

interface AppleMapProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
  apiKey: string;
}

declare global {
  interface Window {
    mapkit: any;
  }
}

const AppleMap = ({ nearbyBarbers, onBarberSelect, apiKey }: AppleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const userAnnotation = useRef<any>(null);
  const barberAnnotations = useRef<any[]>([]);
  const { userLocation, error, loading } = useGeolocation();
  const [mapkitLoaded, setMapkitLoaded] = useState(false);

  // Load MapKit JS script
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

  // Initialize map with dark mode
  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current) return;

    console.log('AppleMap: Initializing Apple Maps with dark mode...');

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : new window.mapkit.Coordinate(29.7604, -95.3698); // Houston default

    map.current = new window.mapkit.Map(mapContainer.current, {
      center: center,
      region: new window.mapkit.CoordinateRegion(
        center,
        new window.mapkit.CoordinateSpan(0.02, 0.02)
      ),
      mapType: window.mapkit.Map.MapTypes.Standard,
      showsMapTypeControl: false,
      showsZoomControl: true,
      showsUserLocationControl: true,
      isRotationEnabled: true,
      colorScheme: window.mapkit.Map.ColorSchemes.Dark
    });

    console.log('AppleMap: Map initialized with dark mode');

    return () => {
      if (map.current) {
        try {
          map.current.destroy();
        } catch (error) {
          console.warn('Error cleaning up map:', error);
        } finally {
          map.current = null;
          userAnnotation.current = null;
          barberAnnotations.current = [];
        }
      }
    };
  }, [mapkitLoaded, userLocation]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return;

    console.log('AppleMap: Adding user location marker');

    if (userAnnotation.current) {
      try {
        map.current.removeAnnotation(userAnnotation.current);
      } catch (error) {
        console.warn('Error removing previous user annotation:', error);
      }
    }

    userAnnotation.current = new window.mapkit.MarkerAnnotation(
      new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
      {
        color: '#007AFF',
        title: 'Your Location',
        subtitle: 'Current position'
      }
    );

    map.current.addAnnotation(userAnnotation.current);
    map.current.setCenterAnimated(new window.mapkit.Coordinate(userLocation[0], userLocation[1]));

    return () => {
      if (userAnnotation.current && map.current) {
        try {
          map.current.removeAnnotation(userAnnotation.current);
        } catch (error) {
          console.warn('Error removing user annotation during cleanup:', error);
        }
      }
    };
  }, [userLocation]);

  // Add barber markers with strong red color and custom styling
  useEffect(() => {
    if (!map.current || !nearbyBarbers.length) return;

    console.log('AppleMap: Adding red barber markers...', nearbyBarbers.length, 'barbers');

    if (barberAnnotations.current.length > 0) {
      try {
        map.current.removeAnnotations(barberAnnotations.current);
      } catch (error) {
        console.warn('Error removing previous barber annotations:', error);
      }
    }

    const annotations = nearbyBarbers.map((barber) => {
      console.log('AppleMap: Creating red marker for barber:', barber.name);

      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          color: '#dc2626', // Strong red color
          title: `${barber.name} - ${barber.price}`,
          subtitle: `${barber.specialty} • ${barber.distance} • ⭐ ${barber.rating}`,
          data: barber,
          glyphColor: '#ffffff',
          selectedGlyphColor: '#ffffff'
        }
      );

      // Add click handler
      annotation.addEventListener('select', () => {
        console.log('AppleMap: Red barber marker selected:', barber.name);
        onBarberSelect(barber);
      });

      return annotation;
    });

    barberAnnotations.current = annotations;
    map.current.addAnnotations(annotations);

    console.log('AppleMap: All red barber markers added successfully');

    return () => {
      if (map.current && barberAnnotations.current.length > 0) {
        try {
          map.current.removeAnnotations(barberAnnotations.current);
        } catch (error) {
          console.warn('Error removing barber annotations during cleanup:', error);
        } finally {
          barberAnnotations.current = [];
        }
      }
    };
  }, [nearbyBarbers, onBarberSelect]);

  if (!mapkitLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white">Loading Apple Maps...</div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default AppleMap;
