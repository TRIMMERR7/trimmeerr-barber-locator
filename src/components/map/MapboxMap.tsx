
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface MapboxMapProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const MapboxMap = ({ nearbyBarbers, onBarberSelect }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    console.log('MapboxMap: Initializing map...');

    // Initialize Leaflet map
    map.current = L.map(mapContainer.current, {
      zoomControl: false // Disable default zoom control
    }).setView([40.7829, -73.9654], 14);

    // Add custom zoom control to top-right
    L.control.zoom({
      position: 'topright'
    }).addTo(map.current);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    console.log('MapboxMap: Map initialized, checking for geolocation...');

    // Get user's current location
    if (navigator.geolocation) {
      console.log('MapboxMap: Geolocation is available, requesting position...');
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('MapboxMap: Got user location:', { latitude, longitude });
          setUserLocation([latitude, longitude]);
          
          // Create user location marker with profile picture
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div class="user-marker-container">
                <div class="user-marker-pin">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
                       alt="Your location" class="user-avatar" />
                </div>
                <div class="user-marker-pulse"></div>
              </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          if (map.current) {
            console.log('MapboxMap: Adding user location marker to map');
            const userMarker = L.marker([latitude, longitude], { icon: userIcon })
              .addTo(map.current)
              .bindPopup('<div class="p-2"><strong>Your Location</strong></div>');
            
            console.log('MapboxMap: User location marker added successfully');
            
            // Center map on user location
            map.current.setView([latitude, longitude], 14);
            console.log('MapboxMap: Map centered on user location');
          }
        },
        (error) => {
          console.error('MapboxMap: Geolocation error:', error);
          console.log('MapboxMap: Error code:', error.code);
          console.log('MapboxMap: Error message:', error.message);
          
          // Provide more detailed error information
          switch(error.code) {
            case error.PERMISSION_DENIED:
              console.log('MapboxMap: User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.log('MapboxMap: Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.log('MapboxMap: The request to get user location timed out.');
              break;
            default:
              console.log('MapboxMap: An unknown error occurred.');
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.log('MapboxMap: Geolocation is not supported by this browser.');
    }

    // Add markers for barbers with profile pictures
    console.log('MapboxMap: Adding barber markers...', nearbyBarbers.length, 'barbers');
    nearbyBarbers.forEach((barber) => {
      if (!map.current) return;

      console.log('MapboxMap: Adding marker for barber:', barber.name);

      const barberIcon = L.divIcon({
        className: 'barber-marker',
        html: `
          <div class="barber-marker-container">
            <div class="barber-marker-pin">
              <img src="${barber.image}" alt="${barber.name}" class="barber-avatar" />
            </div>
            <div class="barber-marker-pulse"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([barber.lat, barber.lng], { icon: barberIcon })
        .addTo(map.current)
        .bindPopup(
          `<div class="p-3 min-w-[200px]">
            <div class="flex items-center gap-3 mb-2">
              <img src="${barber.image}" alt="${barber.name}" class="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 class="font-bold text-lg text-gray-900">${barber.name}</h3>
                <p class="text-red-600 font-medium">${barber.specialty}</p>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-2xl font-bold text-green-600">${barber.price}</p>
              <div class="text-right">
                <p class="text-gray-600">${barber.distance}</p>
                <p class="text-yellow-500 font-medium">⭐ ${barber.rating}</p>
              </div>
            </div>
          </div>`
        );

      marker.on('click', () => {
        onBarberSelect(barber);
      });

      markers.current.push(marker);
    });

    console.log('MapboxMap: All markers added successfully');

    // Cleanup function
    return () => {
      console.log('MapboxMap: Cleaning up...');
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [nearbyBarbers, onBarberSelect]);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <style dangerouslySetInnerHTML={{
        __html: `
          .leaflet-control-zoom {
            border: none !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
          }
          
          .leaflet-control-zoom a {
            background: white !important;
            color: #333 !important;
            border: none !important;
            width: 36px !important;
            height: 36px !important;
            line-height: 36px !important;
            font-size: 18px !important;
            font-weight: bold !important;
          }
          
          .leaflet-control-zoom a:hover {
            background: #f0f0f0 !important;
          }

          .barber-marker, .user-location-marker {
            background: none;
            border: none;
          }
          
          .barber-marker-container, .user-marker-container {
            position: relative;
            width: 40px;
            height: 40px;
          }
          
          .barber-marker-pin {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #dc2626;
            border: 3px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .user-marker-pin {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #2563eb;
            border: 3px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          
          .barber-avatar, .user-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
          }
          
          .barber-marker-pulse, .user-marker-pulse {
            position: absolute;
            top: 0;
            left: 0;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(220, 38, 38, 0.3);
            animation: pulse 2s infinite;
            pointer-events: none;
          }
          
          .user-marker-pulse {
            background: rgba(37, 99, 235, 0.3);
          }
          
          .barber-marker-pin:hover, .user-marker-pin:hover {
            transform: scale(1.1);
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            70% {
              transform: scale(2);
              opacity: 0;
            }
            100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          
          .leaflet-popup-content-wrapper {
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;
          }
          
          .leaflet-popup-tip {
            background: white !important;
          }
        `
      }} />
    </div>
  );
};

export default MapboxMap;
