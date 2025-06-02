
export const createMarkerStyles = () => {
  const style = document.createElement('style');
  style.id = 'enhanced-barber-marker-styles';
  style.textContent = `
    .barber-marker-container {
      position: relative;
      width: 80px;
      height: 80px;
      z-index: 1000;
      cursor: pointer;
      animation: markerDropIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) var(--animation-delay, 0s) both;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
    }
    
    .barber-marker-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .barber-marker-pin {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
      border: 4px solid white;
      box-shadow: 
        0 12px 30px rgba(220, 38, 38, 0.5),
        0 6px 15px rgba(0, 0, 0, 0.4),
        inset 0 2px 0 rgba(255, 255, 255, 0.3),
        inset 0 -2px 0 rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
      pointer-events: none;
      opacity: 0.8;
    }
    
    .barber-avatar-container {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid rgba(255, 255, 255, 0.4);
      transition: all 0.4s ease;
    }
    
    .barber-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.4s ease;
      filter: brightness(1.1) contrast(1.1);
    }
    
    .barber-status-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: 2px solid white;
      border-radius: 50%;
      animation: statusPulse 2s ease-in-out infinite;
      box-shadow: 0 2px 6px rgba(16, 185, 129, 0.4);
    }
    
    .barber-price-badge {
      position: absolute;
      bottom: -12px;
      right: -12px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 16px;
      border: 3px solid white;
      box-shadow: 
        0 6px 18px rgba(16, 185, 129, 0.5),
        0 2px 6px rgba(0, 0, 0, 0.2);
      z-index: 1002;
      animation: priceFloat 4s ease-in-out infinite;
      backdrop-filter: blur(10px);
      letter-spacing: 0.5px;
    }
    
    .barber-marker-pulse {
      position: absolute;
      top: -10px;
      left: -10px;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(220, 38, 38, 0.6) 0%, rgba(220, 38, 38, 0.2) 40%, transparent 70%);
      animation: enhancedPulse 3s ease-in-out infinite;
      pointer-events: none;
      z-index: 999;
    }
    
    .barber-marker-glow {
      position: absolute;
      top: -15px;
      left: -15px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 60%);
      animation: glowPulse 4s ease-in-out infinite;
      pointer-events: none;
      z-index: 998;
      opacity: 0;
    }
    
    .barber-marker-pin:hover {
      transform: scale(1.3) translateY(-8px) rotateZ(5deg);
      box-shadow: 
        0 20px 50px rgba(220, 38, 38, 0.7),
        0 10px 25px rgba(0, 0, 0, 0.5),
        inset 0 3px 0 rgba(255, 255, 255, 0.4),
        inset 0 -3px 0 rgba(0, 0, 0, 0.2);
      border-color: #fbbf24;
      filter: brightness(1.2);
    }
    
    .barber-marker-pin:hover .barber-avatar-container {
      transform: scale(1.1) rotateZ(-5deg);
      border-color: rgba(251, 191, 36, 0.6);
    }
    
    .barber-marker-pin:hover .barber-avatar {
      transform: scale(1.1);
      filter: brightness(1.3) contrast(1.2) saturate(1.2);
    }
    
    .barber-marker-pin:hover .barber-price-badge {
      transform: scale(1.2) translateY(-2px);
      box-shadow: 
        0 8px 25px rgba(16, 185, 129, 0.7),
        0 4px 12px rgba(0, 0, 0, 0.3);
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
    
    .barber-marker-pin:hover + .barber-marker-glow {
      opacity: 1;
      animation: glowIntense 0.5s ease-out;
    }
    
    .barber-marker-pin:active {
      transform: scale(1.2) translateY(-4px) rotateZ(3deg);
      transition: all 0.2s ease;
    }
    
    @keyframes markerDropIn {
      0% {
        opacity: 0;
        transform: scale(0.3) translateY(-120px) rotateZ(180deg);
        filter: blur(10px);
      }
      60% {
        opacity: 1;
        transform: scale(1.2) translateY(-20px) rotateZ(-10deg);
        filter: blur(0px);
      }
      80% {
        transform: scale(0.9) translateY(8px) rotateZ(5deg);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0px) rotateZ(0deg);
        filter: blur(0px);
      }
    }
    
    @keyframes enhancedPulse {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      50% {
        transform: scale(1.8);
        opacity: 0.4;
      }
      100% {
        transform: scale(2.6);
        opacity: 0;
      }
    }
    
    @keyframes priceFloat {
      0%, 100% {
        transform: translateY(0px) rotateZ(0deg);
      }
      25% {
        transform: translateY(-3px) rotateZ(1deg);
      }
      50% {
        transform: translateY(-1px) rotateZ(0deg);
      }
      75% {
        transform: translateY(-2px) rotateZ(-1deg);
      }
    }
    
    @keyframes statusPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.2);
        opacity: 0.8;
      }
    }
    
    @keyframes glowPulse {
      0%, 100% {
        transform: scale(1);
        opacity: 0;
      }
      50% {
        transform: scale(1.3);
        opacity: 0.3;
      }
    }
    
    @keyframes glowIntense {
      0% {
        transform: scale(1);
        opacity: 0;
      }
      100% {
        transform: scale(1.5);
        opacity: 0.6;
      }
    }
    
    @media (max-width: 768px) {
      .barber-marker-container {
        width: 60px;
        height: 60px;
      }
      
      .barber-marker-pin {
        width: 50px;
        height: 50px;
      }
      
      .barber-avatar-container {
        width: 42px;
        height: 42px;
      }
      
      .barber-price-badge {
        font-size: 10px;
        padding: 2px 6px;
      }
    }
  `;
  
  return style;
};

export const ensureStylesLoaded = () => {
  if (!document.head.querySelector('#enhanced-barber-marker-styles')) {
    const style = createMarkerStyles();
    document.head.appendChild(style);
  }
};
