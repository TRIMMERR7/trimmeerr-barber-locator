
import React from 'react';

interface MapLoadingStateProps {
  mapkitLoaded: boolean;
  mapInitialized: boolean;
  mapReady: boolean;
  visible: boolean;
}

const MapLoadingState = ({ 
  mapkitLoaded, 
  mapInitialized, 
  mapReady, 
  visible 
}: MapLoadingStateProps) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100/90 to-gray-200/90 rounded-lg z-50">
      <div className="text-gray-800 text-center">
        <div className="relative mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-red-300/30 mx-auto"></div>
        </div>
        <div className="text-lg font-semibold mb-2">Loading Apple Maps</div>
        <div className="text-sm text-gray-600">
          {!mapkitLoaded && "Loading MapKit..."}
          {mapkitLoaded && !mapInitialized && "Initializing map..."}
          {mapInitialized && !mapReady && "Preparing markers..."}
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Debug: MapKit={mapkitLoaded ? 'OK' : 'Loading'}, 
          Init={mapInitialized ? 'OK' : 'Pending'}, 
          Ready={mapReady ? 'OK' : 'Pending'}
        </div>
      </div>
    </div>
  );
};

export default MapLoadingState;
