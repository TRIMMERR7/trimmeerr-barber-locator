
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const useMapInitialization = (mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('useMapInitialization: Initializing map...');

    // Initialize Leaflet map with better default settings
    map.current = L.map(mapContainer.current, {
      zoomControl: false,
      attributionControl: true,
      preferCanvas: true,
      maxZoom: 18,
      minZoom: 3
    }).setView([29.7704, -95.3833], 13); // Houston coordinates as default

    // Add custom zoom control to top-right
    L.control.zoom({
      position: 'topright'
    }).addTo(map.current);

    // Add dark mode tiles using CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map.current);

    console.log('useMapInitialization: Map initialized');

    // Cleanup function
    return () => {
      if (map.current) {
        console.log('useMapInitialization: Cleaning up map...');
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapContainer]);

  return map.current;
};
