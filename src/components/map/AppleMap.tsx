
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

  // Create custom HTML marker element with strong red styling
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

  // Add barber markers with custom HTML elements and strong red styling
  useEffect(() => {
    if (!map.current || !nearbyBarbers.length) return;

    console.log('AppleMap: Adding red custom barber markers...', nearbyBarbers.length, 'barbers');

    if (barberAnnotations.current.length > 0) {
      try {
        map.current.removeAnnotations(barberAnnotations.current);
      } catch (error) {
        console.warn('Error removing previous barber annotations:', error);
      }
    }

    const annotations = nearbyBarbers.map((barber) => {
      console.log('AppleMap: Creating red custom marker for barber:', barber.name);

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
        console.log('AppleMap: Red custom barber marker selected:', barber.name);
        onBarberSelect(barber);
      });

      return annotation;
    });

    barberAnnotations.current = annotations;
    map.current.addAnnotations(annotations);

    console.log('AppleMap: All red custom barber markers added successfully');

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
      
      {/* Enhanced Custom CSS for RED barber markers with profile pictures and prices */}
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
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 40%, #b91c1c 70%, #991b1b 100%) !important;
            border: 4px solid #ffffff !important;
            box-shadow: 
              0 8px 25px rgba(239, 68, 68, 0.6) !important,
              0 4px 12px rgba(220, 38, 38, 0.4) !important,
              0 2px 8px rgba(0, 0, 0, 0.3) !important,
              inset 0 2px 0 rgba(255, 255, 255, 0.3) !important,
              inset 0 -2px 0 rgba(0, 0, 0, 0.1) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translateZ(0);
            filter: saturate(1.2) brightness(1.1);
          }
          
          .marker-pin::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 50%;
            background: linear-gradient(45deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%, rgba(239, 68, 68, 0.2) 100%);
            pointer-events: none;
          }
          
          .barber-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            object-fit: cover;
            transition: transform 0.3s ease;
            border: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          }
          
          .price-badge {
            position: absolute;
            bottom: -10px;
            right: -10px;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%) !important;
            color: #000000 !important;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 7px;
            border-radius: 12px;
            border: 3px solid #ffffff !important;
            box-shadow: 
              0 4px 12px rgba(0, 0, 0, 0.4) !important,
              0 2px 6px rgba(251, 191, 36, 0.3) !important;
            min-width: 28px;
            text-align: center;
            z-index: 1002;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            letter-spacing: 0.5px;
          }
          
          .marker-pulse {
            position: absolute;
            top: 0;
            left: 6px;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(239, 68, 68, 0.6) 0%, rgba(220, 38, 38, 0.3) 40%, rgba(185, 28, 28, 0.1) 70%, transparent 100%) !important;
            animation: enhancedRedPulse 2.5s ease-in-out infinite;
            pointer-events: none;
            z-index: 999;
          }
          
          .marker-pin:hover {
            transform: scale(1.2) translateY(-3px) !important;
            box-shadow: 
              0 12px 30px rgba(239, 68, 68, 0.7) !important,
              0 6px 15px rgba(220, 38, 38, 0.5) !important,
              0 3px 10px rgba(0, 0, 0, 0.4) !important,
              inset 0 2px 0 rgba(255, 255, 255, 0.4) !important;
            border-color: #fbbf24 !important;
            filter: saturate(1.4) brightness(1.2) !important;
          }
          
          .marker-pin:hover .barber-avatar {
            transform: scale(1.08);
            border-color: rgba(255, 255, 255, 1);
          }
          
          .marker-pin:hover .price-badge {
            transform: scale(1.15);
            background: linear-gradient(135deg, #fcd34d 0%, #fbbf24 50%, #f59e0b 100%) !important;
            box-shadow: 
              0 6px 15px rgba(0, 0, 0, 0.5) !important,
              0 3px 8px rgba(251, 191, 36, 0.4) !important;
          }
          
          @keyframes markerBounceIn {
            0% {
              opacity: 0;
              transform: scale(0.2) translateY(-60px);
            }
            50% {
              opacity: 1;
              transform: scale(1.1) translateY(-15px);
            }
            70% {
              transform: scale(0.9) translateY(0px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0px);
            }
          }
          
          @keyframes enhancedRedPulse {
            0% {
              transform: scale(1);
              opacity: 0.9;
            }
            50% {
              transform: scale(1.6);
              opacity: 0.5;
            }
            100% {
              transform: scale(2.4);
              opacity: 0;
            }
          }
        `
      }} />
    </div>
  );
};

export default AppleMap;
