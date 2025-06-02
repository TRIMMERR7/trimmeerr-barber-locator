
export const mapStyles = `
  .leaflet-control-zoom {
    border: none !important;
    box-shadow: 0 4px 8px rgba(0,0,0,0.4) !important;
  }
  
  .leaflet-control-zoom a {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border: 1px solid #374151 !important;
    width: 36px !important;
    height: 36px !important;
    line-height: 36px !important;
    font-size: 18px !important;
    font-weight: bold !important;
  }
  
  .leaflet-control-zoom a:hover {
    background: #374151 !important;
    color: white !important;
  }

  .barber-marker, .user-location-marker {
    background: none !important;
    border: none !important;
    z-index: 1000 !important;
  }
  
  .barber-marker-container, .user-marker-container {
    position: relative;
    width: 50px;
    height: 50px;
    z-index: 1000;
    animation: markerBounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
  
  .barber-marker-pin {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%) !important;
    border: 4px solid white;
    box-shadow: 
      0 6px 20px rgba(220, 38, 38, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 1001;
    transform: translateZ(0);
  }
  
  .barber-marker-pin::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    pointer-events: none;
  }
  
  .user-marker-pin {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #1e40af 100%) !important;
    border: 3px solid white;
    box-shadow: 
      0 4px 16px rgba(37, 99, 235, 0.4),
      0 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 1001;
    animation: userMarkerPulse 2s ease-in-out infinite;
  }
  
  .barber-avatar, .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .barber-marker-pulse {
    position: absolute;
    top: -2px;
    left: -2px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, rgba(220, 38, 38, 0.1) 40%, transparent 70%);
    animation: enhancedPulse 2.5s ease-in-out infinite;
    pointer-events: none;
    z-index: 999;
  }
  
  .user-marker-pulse {
    position: absolute;
    top: -1px;
    left: -1px;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 40%, transparent 70%);
    animation: enhancedPulse 2s ease-in-out infinite;
    pointer-events: none;
    z-index: 999;
  }
  
  .barber-marker-pin:hover {
    transform: scale(1.15) translateY(-2px);
    box-shadow: 
      0 8px 25px rgba(220, 38, 38, 0.5),
      0 4px 12px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    border-color: #fbbf24;
  }
  
  .barber-marker-pin:hover .barber-avatar {
    transform: scale(1.05);
  }
  
  .barber-marker-pin:active {
    transform: scale(1.05) translateY(0px);
    transition: all 0.1s ease;
  }
  
  .user-marker-pin:hover {
    transform: scale(1.1);
    box-shadow: 
      0 6px 20px rgba(37, 99, 235, 0.5),
      0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  @keyframes markerBounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3) translateY(-50px);
    }
    50% {
      opacity: 1;
      transform: scale(1.05) translateY(-10px);
    }
    70% {
      transform: scale(0.95) translateY(0px);
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
      transform: scale(1.5);
      opacity: 0.4;
    }
    100% {
      transform: scale(2.2);
      opacity: 0;
    }
  }
  
  @keyframes userMarkerPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.9;
    }
  }
  
  /* Enhanced popup styling */
  .leaflet-popup-content-wrapper {
    border-radius: 16px !important;
    box-shadow: 
      0 20px 40px rgba(0,0,0,0.3),
      0 8px 16px rgba(0,0,0,0.2) !important;
    background: linear-gradient(145deg, #1f2937 0%, #111827 100%) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
    animation: popupSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .leaflet-popup-tip {
    background: #1f2937 !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
  }
  
  .leaflet-popup-content {
    color: white !important;
    margin: 12px 16px !important;
  }
  
  .leaflet-popup-content h3 {
    color: white !important;
    margin: 0 0 8px 0 !important;
  }
  
  .leaflet-popup-close-button {
    color: #9ca3af !important;
    font-size: 18px !important;
    width: 24px !important;
    height: 24px !important;
    border-radius: 50% !important;
    transition: all 0.2s ease !important;
  }
  
  .leaflet-popup-close-button:hover {
    color: white !important;
    background: rgba(255, 255, 255, 0.1) !important;
    transform: scale(1.1) !important;
  }
  
  @keyframes popupSlideIn {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  /* Add a subtle glow effect for selected markers */
  .barber-marker-selected .barber-marker-pin {
    box-shadow: 
      0 0 20px rgba(220, 38, 38, 0.8),
      0 6px 20px rgba(220, 38, 38, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
    border-color: #fbbf24 !important;
    animation: selectedGlow 2s ease-in-out infinite alternate;
  }
  
  @keyframes selectedGlow {
    0% {
      box-shadow: 
        0 0 20px rgba(220, 38, 38, 0.8),
        0 6px 20px rgba(220, 38, 38, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    100% {
      box-shadow: 
        0 0 30px rgba(220, 38, 38, 1),
        0 8px 25px rgba(220, 38, 38, 0.6),
        0 4px 12px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }
`;
