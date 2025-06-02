
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

  // Create custom HTML marker element
  const createCustomMarkerElement = (barber: Barber) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-barber-marker';
    markerElement.innerHTML = `
      <div class="marker-container">
        <div class="marker-pin">
          <img src="${barber.image}" alt="${barber.name}" class="barber-avatar" />
          <div class="price-badge">${barber.price}</div>
        </div>
        <div class="marker-pulse"></div>
      </div>
    `;
    return markerElement;
  };

  // Add barber markers with custom HTML elements
  useEffect(() => {
    if (!map.current || !nearbyBarbers.length) return;

    console.log('AppleMap: Adding custom barber markers...', nearbyBarbers.length, 'barbers');

    if (barberAnnotations.current.length > 0) {
      try {
        map.current.removeAnnotations(barberAnnotations.current);
      } catch (error) {
        console.warn('Error removing previous barber annotations:', error);
      }
    }

    const annotations = nearbyBarbers.map((barber) => {
      console.log('AppleMap: Creating custom marker for barber:', barber.name);

      const customElement = createCustomMarkerElement(barber);
      
      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          title: barber.name,
          subtitle: `${barber.specialty} - ${barber.price}`,
          data: barber,
          element: customElement
        }
      );

      // Add click handler
      annotation.addEventListener('select', () => {
        console.log('AppleMap: Custom barber marker selected:', barber.name);
        onBarberSelect(barber);
      });

      return annotation;
    });

    barberAnnotations.current = annotations;
    map.current.addAnnotations(annotations);

    console.log('AppleMap: All custom barber markers added successfully');

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
      
      {/* Custom CSS for barber markers with profile pictures and prices */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-barber-marker {
            position: relative;
            cursor: pointer;
            z-index: 1000;
          }
          
          .marker-container {
            position: relative;
            width: 60px;
            height: 80px;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: markerBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          
          .marker-pin {
            position: relative;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
            border: 3px solid white;
            box-shadow: 
              0 6px 20px rgba(220, 38, 38, 0.4),
              0 2px 8px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .barber-avatar {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }
          
          .price-badge {
            position: absolute;
            bottom: -8px;
            right: -8px;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: #000;
            font-size: 10px;
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 10px;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            min-width: 24px;
            text-align: center;
            z-index: 1001;
          }
          
          .marker-pulse {
            position: absolute;
            top: 0;
            left: 5px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, rgba(220, 38, 38, 0.1) 40%, transparent 70%);
            animation: enhancedPulse 2.5s ease-in-out infinite;
            pointer-events: none;
            z-index: 999;
          }
          
          .marker-pin:hover {
            transform: scale(1.15) translateY(-2px);
            box-shadow: 
              0 8px 25px rgba(220, 38, 38, 0.5),
              0 4px 12px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
            border-color: #fbbf24;
          }
          
          .marker-pin:hover .barber-avatar {
            transform: scale(1.05);
          }
          
          .marker-pin:hover .price-badge {
            transform: scale(1.1);
            background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%);
          }
          
          @keyframes markerBounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3) translateY(-50px);
            }
            50% {
              opacity: 1;
              transform: scale(1.05) translateY(-10px);
            }
            70% {
              transform: scale(0.95) translateY(0px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0px);
            }
          }
          
          @keyframes enhancedPulse {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.5);
              opacity: 0.4;
            }
            100% {
              transform: scale(2.2);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
};

export default AppleMap;
