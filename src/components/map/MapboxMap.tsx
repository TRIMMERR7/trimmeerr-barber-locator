
import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Leaflet map
    map.current = L.map(mapContainer.current).setView([40.7829, -73.9654], 14);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Create custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="marker-pin"></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    // Add markers for barbers
    nearbyBarbers.forEach((barber) => {
      if (!map.current) return;

      const marker = L.marker([barber.lat, barber.lng], { icon: customIcon })
        .addTo(map.current)
        .bindPopup(
          `<div class="p-2">
            <h3 class="font-bold text-lg">${barber.name}</h3>
            <p class="text-red-600">${barber.specialty}</p>
            <p class="text-gray-600">${barber.price} • ${barber.distance}</p>
            <p class="text-yellow-500">★ ${barber.rating}</p>
          </div>`
        );

      marker.on('click', () => {
        onBarberSelect(barber);
      });

      markers.current.push(marker);
    });

    // Cleanup function
    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [nearbyBarbers, onBarberSelect]);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-marker {
            background: none;
            border: none;
          }
          .marker-pin {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: #dc2626;
            border: 3px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s;
          }
          .marker-pin:hover {
            transform: scale(1.1);
          }
        `
      }} />
    </div>
  );
};

export default MapboxMap;
