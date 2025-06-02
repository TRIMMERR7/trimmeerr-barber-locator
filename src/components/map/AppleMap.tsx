
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
      document.head.removeChild(script);
    };
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current) return;

    console.log('AppleMap: Initializing Apple Maps...');

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : new window.mapkit.Coordinate(29.7604, -95.3698); // Houston default

    map.current = new window.mapkit.Map(mapContainer.current, {
      center: center,
      span: new window.mapkit.CoordinateSpan(0.02, 0.02),
      mapType: window.mapkit.Map.MapTypes.Standard,
      showsMapTypeControl: false,
      showsZoomControl: true,
      showsUserLocationControl: true,
      isRotationEnabled: true,
      colorScheme: window.mapkit.Map.ColorSchemes.Dark
    });

    console.log('AppleMap: Map initialized');

    return () => {
      if (map.current) {
        map.current.destroy();
      }
    };
  }, [mapkitLoaded, userLocation]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !userLocation) return;

    console.log('AppleMap: Adding user location marker');

    const userAnnotation = new window.mapkit.MarkerAnnotation(
      new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
      {
        color: '#007AFF',
        title: 'Your Location',
        subtitle: 'Current position'
      }
    );

    map.current.addAnnotation(userAnnotation);
    map.current.setCenterAnimated(new window.mapkit.Coordinate(userLocation[0], userLocation[1]));

    return () => {
      map.current.removeAnnotation(userAnnotation);
    };
  }, [map.current, userLocation]);

  // Add barber markers
  useEffect(() => {
    if (!map.current || !nearbyBarbers.length) return;

    console.log('AppleMap: Adding barber markers...', nearbyBarbers.length, 'barbers');

    const annotations = nearbyBarbers.map((barber) => {
      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          color: '#DC2626',
          title: barber.name,
          subtitle: `${barber.specialty} - ${barber.price}`,
          data: barber
        }
      );

      return annotation;
    });

    map.current.addAnnotations(annotations);

    // Add click listener for barber markers
    map.current.addEventListener('select', (event: any) => {
      const annotation = event.annotation;
      if (annotation.data) {
        console.log('AppleMap: Barber marker clicked:', annotation.data.name);
        onBarberSelect(annotation.data);
      }
    });

    console.log('AppleMap: All barber markers added successfully');

    return () => {
      map.current.removeAnnotations(annotations);
    };
  }, [map.current, nearbyBarbers, onBarberSelect]);

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
