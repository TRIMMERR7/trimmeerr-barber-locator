
import React, { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { createUserLocationMarker, createBarberMarker } from '@/utils/mapMarkers';
import { mapStyles } from '@/utils/mapStyles';
import { Barber } from '@/types/barber';
import L from 'leaflet';

interface MapboxMapProps {
  nearbyBarbers: Barber[];
  onBarberSelect: (barber: Barber) => void;
}

const MapboxMap = ({ nearbyBarbers, onBarberSelect }: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const markers = useRef<L.Marker[]>([]);
  const userMarker = useRef<L.Marker | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [mapFullyReady, setMapFullyReady] = useState(false);
  const { userLocation, error, loading } = useGeolocation();

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainer.current || map) return;

    console.log('MapboxMap: Initializing Leaflet map');
    
    const leafletMap = L.map(mapContainer.current).setView([29.7604, -95.3698], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(leafletMap);

    // Wait for map to be fully loaded and ensure all components are ready
    leafletMap.whenReady(() => {
      console.log('MapboxMap: Map whenReady triggered');
      // Wait longer and check if map panes exist
      setTimeout(() => {
        if (leafletMap.getPane('markerPane') && leafletMap.getPane('overlayPane')) {
          console.log('MapboxMap: Map panes are ready, setting mapFullyReady to true');
          setMapFullyReady(true);
        } else {
          console.log('MapboxMap: Map panes not ready, retrying...');
          // Retry after another delay
          setTimeout(() => {
            console.log('MapboxMap: Setting mapFullyReady to true (fallback)');
            setMapFullyReady(true);
          }, 500);
        }
      }, 300);
    });

    setMap(leafletMap);
    
    return () => {
      if (leafletMap) {
        leafletMap.remove();
      }
    };
  }, [map]);

  // Handle user location marker
  useEffect(() => {
    if (!map || !mapFullyReady || !userLocation) return;

    console.log('MapboxMap: Adding user location marker to map');
    
    try {
      // Check if map panes are available before adding marker
      if (!map.getPane('markerPane')) {
        console.warn('MapboxMap: Marker pane not available, skipping user marker');
        return;
      }

      // Remove existing user marker if any
      if (userMarker.current) {
        userMarker.current.remove();
      }

      const newUserMarker = createUserLocationMarker(userLocation[0], userLocation[1]);
      newUserMarker.addTo(map);
      userMarker.current = newUserMarker;
      
      console.log('MapboxMap: User location marker added successfully');
      
      // Center map on user location
      map.setView([userLocation[0], userLocation[1]], 14);
      console.log('MapboxMap: Map centered on user location');
    } catch (error) {
      console.error('MapboxMap: Error adding user location marker:', error);
    }

    return () => {
      if (userMarker.current) {
        userMarker.current.remove();
        userMarker.current = null;
      }
    };
  }, [map, mapFullyReady, userLocation]);

  // Handle barber markers
  useEffect(() => {
    if (!map || !mapFullyReady) return;

    console.log('MapboxMap: Adding barber markers...', nearbyBarbers.length, 'barbers');
    
    try {
      // Check if map panes are available before adding markers
      if (!map.getPane('markerPane')) {
        console.warn('MapboxMap: Marker pane not available, skipping barber markers');
        return;
      }

      // Clear existing markers
      markers.current.forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          console.warn('MapboxMap: Error removing marker:', e);
        }
      });
      markers.current = [];

      // Add new markers
      nearbyBarbers.forEach((barber) => {
        try {
          const marker = createBarberMarker(barber, onBarberSelect);
          marker.addTo(map);
          markers.current.push(marker);
          console.log('MapboxMap: Added marker for:', barber.name);
        } catch (error) {
          console.error('MapboxMap: Error adding marker for', barber.name, ':', error);
        }
      });

      console.log('MapboxMap: All barber markers processed');
    } catch (error) {
      console.error('MapboxMap: Error in barber markers effect:', error);
    }

    return () => {
      markers.current.forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          console.warn('MapboxMap: Error removing marker in cleanup:', e);
        }
      });
      markers.current = [];
    };
  }, [map, mapFullyReady, nearbyBarbers, onBarberSelect]);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
      {!mapFullyReady && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center rounded-lg">
          <div className="text-white text-lg">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default MapboxMap;
