
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
  const [mapInitialized, setMapInitialized] = useState(false);

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

  // Initialize map
  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current || mapInitialized) return;

    console.log('AppleMap: Initializing Apple Maps...');

    const center = userLocation 
      ? new window.mapkit.Coordinate(userLocation[0], userLocation[1])
      : new window.mapkit.Coordinate(29.7604, -95.3698); // Houston default

    try {
      map.current = new window.mapkit.Map(mapContainer.current, {
        center: center,
        region: new window.mapkit.CoordinateRegion(
          center,
          new window.mapkit.CoordinateSpan(0.01, 0.01) // Smaller span for more detailed street view
        ),
        mapType: window.mapkit.Map.MapTypes.Standard,
        showsMapTypeControl: true,
        showsZoomControl: true,
        showsUserLocationControl: true,
        showsCompass: window.mapkit.FeatureVisibility.Visible,
        showsScale: window.mapkit.FeatureVisibility.Visible,
        isRotationEnabled: true,
        isScrollEnabled: true,
        isZoomEnabled: true,
        showsPointsOfInterest: true,
        showsBuildings: true,
        colorScheme: window.mapkit.Map.ColorSchemes.Light // Changed to Light for better street visibility
      });

      setMapInitialized(true);
      console.log('AppleMap: Map initialized successfully');
    } catch (error) {
      console.error('AppleMap: Error initializing map:', error);
    }

    return () => {
      if (map.current && typeof map.current.destroy === 'function') {
        try {
          map.current.destroy();
          map.current = null;
          setMapInitialized(false);
        } catch (error) {
          console.error('AppleMap: Error destroying map:', error);
        }
      }
    };
  }, [mapkitLoaded, userLocation]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !userLocation || !mapInitialized) return;

    console.log('AppleMap: Adding user location marker');

    const userAnnotation = new window.mapkit.MarkerAnnotation(
      new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
      {
        color: '#007AFF',
        glyphColor: '#FFFFFF',
        title: 'Your Location',
        subtitle: 'Current position'
      }
    );

    map.current.addAnnotation(userAnnotation);
    
    // Set region to show streets around user location
    const region = new window.mapkit.CoordinateRegion(
      new window.mapkit.Coordinate(userLocation[0], userLocation[1]),
      new window.mapkit.CoordinateSpan(0.01, 0.01)
    );
    map.current.setRegionAnimated(region);

    return () => {
      if (map.current && userAnnotation) {
        try {
          map.current.removeAnnotation(userAnnotation);
        } catch (error) {
          console.error('AppleMap: Error removing user annotation:', error);
        }
      }
    };
  }, [map.current, userLocation, mapInitialized]);

  // Add barber markers
  useEffect(() => {
    if (!map.current || !nearbyBarbers.length || !mapInitialized) return;

    console.log('AppleMap: Adding barber markers...', nearbyBarbers.length, 'barbers');

    const annotations = nearbyBarbers.map((barber) => {
      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          color: '#DC2626',
          glyphColor: '#FFFFFF',
          title: barber.name,
          subtitle: `${barber.specialty} - ${barber.price}`,
          data: barber
        }
      );

      return annotation;
    });

    map.current.addAnnotations(annotations);

    // Add click listener for barber markers
    const handleMarkerSelect = (event: any) => {
      const annotation = event.annotation;
      if (annotation.data) {
        console.log('AppleMap: Barber marker clicked:', annotation.data.name);
        onBarberSelect(annotation.data);
      }
    };

    map.current.addEventListener('select', handleMarkerSelect);

    console.log('AppleMap: All barber markers added successfully');

    return () => {
      if (map.current && annotations.length > 0) {
        try {
          map.current.removeAnnotations(annotations);
          map.current.removeEventListener('select', handleMarkerSelect);
        } catch (error) {
          console.error('AppleMap: Error removing barber annotations:', error);
        }
      }
    };
  }, [map.current, nearbyBarbers, onBarberSelect, mapInitialized]);

  if (!mapkitLoaded) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white">Loading Apple Maps...</div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-lg">
        <div className="text-white text-center">
          <p>Apple Maps API key required</p>
          <p className="text-sm text-gray-400 mt-2">Please configure your Apple Maps API key in Supabase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      {!mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
          <div className="text-white">Initializing map...</div>
        </div>
      )}
    </div>
  );
};

export default AppleMap;
