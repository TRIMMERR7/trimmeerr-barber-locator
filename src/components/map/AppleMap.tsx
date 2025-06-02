
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

  // Initialize map
  useEffect(() => {
    if (!mapkitLoaded || !mapContainer.current) return;

    console.log('AppleMap: Initializing Apple Maps...');

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

    console.log('AppleMap: Map initialized');

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

  // Add barber markers with enhanced styling
  useEffect(() => {
    if (!map.current || !nearbyBarbers.length) return;

    console.log('AppleMap: Adding enhanced barber markers...', nearbyBarbers.length, 'barbers');

    if (barberAnnotations.current.length > 0) {
      try {
        map.current.removeAnnotations(barberAnnotations.current);
      } catch (error) {
        console.warn('Error removing previous barber annotations:', error);
      }
    }

    const annotations = nearbyBarbers.map((barber) => {
      // Create custom HTML marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'barber-marker-enhanced';
      markerElement.innerHTML = `
        <div class="barber-marker-container-enhanced">
          <div class="barber-marker-pin-enhanced">
            <img src="${barber.image}" alt="${barber.name}" class="barber-avatar-enhanced" />
            <div class="barber-price-badge">${barber.price}</div>
          </div>
          <div class="barber-marker-pulse-enhanced"></div>
        </div>
      `;

      // Add styles for the enhanced marker
      const style = document.createElement('style');
      style.textContent = `
        .barber-marker-enhanced {
          position: relative;
          z-index: 1000;
        }
        
        .barber-marker-container-enhanced {
          position: relative;
          width: 60px;
          height: 60px;
          animation: markerBounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .barber-marker-pin-enhanced {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
          border: 3px solid white;
          box-shadow: 
            0 8px 25px rgba(220, 38, 38, 0.4),
            0 4px 12px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
          transform: translateZ(0);
        }
        
        .barber-marker-pin-enhanced:hover {
          transform: scale(1.2) translateY(-3px);
          box-shadow: 
            0 12px 35px rgba(220, 38, 38, 0.6),
            0 6px 16px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          border-color: #fbbf24;
        }
        
        .barber-avatar-enhanced {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .barber-price-badge {
          position: absolute;
          bottom: -8px;
          right: -8px;
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          font-size: 10px;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 8px;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }
        
        .barber-marker-pulse-enhanced {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, rgba(220, 38, 38, 0.1) 40%, transparent 70%);
          animation: enhancedPulse 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 999;
        }
        
        @keyframes markerBounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-60px);
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
        
        @keyframes enhancedPulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }
      `;
      
      if (!document.head.querySelector('style[data-barber-markers]')) {
        style.setAttribute('data-barber-markers', 'true');
        document.head.appendChild(style);
      }

      const annotation = new window.mapkit.MarkerAnnotation(
        new window.mapkit.Coordinate(barber.lat, barber.lng),
        {
          color: '#DC2626',
          title: barber.name,
          subtitle: `${barber.specialty} - ${barber.price}`,
          data: barber,
          element: markerElement
        }
      );

      // Add click handler to the marker element
      markerElement.addEventListener('click', () => {
        console.log('AppleMap: Enhanced barber marker clicked:', barber.name);
        onBarberSelect(barber);
      });

      return annotation;
    });

    barberAnnotations.current = annotations;
    map.current.addAnnotations(annotations);

    console.log('AppleMap: All enhanced barber markers added successfully');

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
