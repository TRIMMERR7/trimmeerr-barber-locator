
import React, { useEffect, useRef, useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { createUserLocationMarker, createBarberMarker } from '@/utils/mapMarkers';
import { mapStyles } from '@/utils/mapStyles';
import { ensureStylesLoaded } from '@/utils/markerStyles';
import L from 'leaflet';

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
  const markers = useRef<L.Marker[]>([]);
  const map = useMapInitialization(mapContainer);
  const { userLocation, error, loading } = useGeolocation();

  // Ensure enhanced marker styles are loaded
  useEffect(() => {
    ensureStylesLoaded();
  }, []);

  // Handle user location marker
  useEffect(() => {
    if (!map || !userLocation) return;

    console.log('MapboxMap: Adding user location marker to map');
    const userMarker = createUserLocationMarker(userLocation[0], userLocation[1]);
    userMarker.addTo(map);
    
    console.log('MapboxMap: User location marker added successfully');
    
    // Center map on user location
    map.setView([userLocation[0], userLocation[1]], 14);
    console.log('MapboxMap: Map centered on user location');

    return () => {
      userMarker.remove();
    };
  }, [map, userLocation]);

  // Handle barber markers
  useEffect(() => {
    if (!map) return;

    console.log('MapboxMap: Adding barber markers...', nearbyBarbers.length, 'barbers');
    
    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    nearbyBarbers.forEach((barber) => {
      const marker = createBarberMarker(barber, onBarberSelect);
      marker.addTo(map);
      markers.current.push(marker);
    });

    console.log('MapboxMap: All barber markers added successfully');

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
    };
  }, [map, nearbyBarbers, onBarberSelect]);

  return (
    <div className="h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
    </div>
  );
};

export default MapboxMap;
