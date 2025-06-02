
export const mapStyles = `
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
    background: none !important;
    border: none !important;
    z-index: 1000 !important;
  }
  
  .barber-marker-container, .user-marker-container {
    position: relative;
    width: 40px;
    height: 40px;
    z-index: 1000;
  }
  
  .barber-marker-pin {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #dc2626 !important;
    border: 3px solid white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 1001;
  }
  
  .user-marker-pin {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #2563eb !important;
    border: 3px solid white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    z-index: 1001;
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
    z-index: 999;
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
`;
