
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const useMapInitialization = (mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    console.log('useMapInitialization: Initializing map...');

    // Initialize Leaflet map
    map.current = L.map(mapContainer.current, {
      zoomControl: false // Disable default zoom control
    }).setView([40.7829, -73.9654], 14);

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
      console.log('useMapInitialization: Cleaning up map...');
      map.current?.remove();
    };
  }, [mapContainer]);

  return map.current;
};
