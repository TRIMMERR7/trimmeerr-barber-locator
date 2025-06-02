
import React from 'react';

interface MapZoomControlsProps {
  map: any;
  visible: boolean;
}

const MapZoomControls = ({ map, visible }: MapZoomControlsProps) => {
  const handleZoomIn = () => {
    if (map) {
      console.log('MapZoomControls: Zoom in clicked');
      const currentRegion = map.region;
      const newSpan = new window.mapkit.CoordinateSpan(
        currentRegion.span.latitudeDelta * 0.5,
        currentRegion.span.longitudeDelta * 0.5
      );
      const newRegion = new window.mapkit.CoordinateRegion(currentRegion.center, newSpan);
      map.setRegionAnimated(newRegion, true);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      console.log('MapZoomControls: Zoom out clicked');
      const currentRegion = map.region;
      const newSpan = new window.mapkit.CoordinateSpan(
        currentRegion.span.latitudeDelta * 2,
        currentRegion.span.longitudeDelta * 2
      );
      const newRegion = new window.mapkit.CoordinateRegion(currentRegion.center, newSpan);
      map.setRegionAnimated(newRegion, true);
    }
  };

  if (!visible) return null;

  return (
    <div className="absolute top-4 right-4 z-50 flex flex-col gap-1">
      <button
        onClick={handleZoomIn}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800"
        aria-label="Zoom in"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
        </svg>
      </button>
      <button
        onClick={handleZoomOut}
        className="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800"
        aria-label="Zoom out"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
    </div>
  );
};

export default MapZoomControls;
