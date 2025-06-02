
export const createCustomBarberMarker = (barber: any): HTMLDivElement => {
  const markerElement = document.createElement('div');
  markerElement.className = 'custom-barber-marker';
  markerElement.innerHTML = `
    <div style="
      position: relative;
      width: 60px;
      height: 80px;
      cursor: pointer;
      transform: translateX(-50%) translateY(-100%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    " class="marker-container">
      <!-- Animated pulse ring -->
      <div style="
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 60px;
        border: 2px solid #dc2626;
        border-radius: 50%;
        opacity: 0.6;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      "></div>
      
      <!-- Secondary pulse ring -->
      <div style="
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 60px;
        border: 2px solid #dc2626;
        border-radius: 50%;
        opacity: 0.4;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        animation-delay: 1s;
      "></div>

      <!-- Red pin background with bounce animation -->
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 15px solid #dc2626;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        transition: all 0.3s ease;
      " class="pin-tail"></div>
      
      <!-- Main marker container with enhanced styling -->
      <div style="
        position: absolute;
        bottom: 15px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        border: 3px solid white;
        border-radius: 16px;
        padding: 8px;
        box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4), 0 3px 10px rgba(0,0,0,0.2);
        min-width: 65px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        animation: marker-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      " class="marker-body">
        <!-- Profile picture with enhanced styling -->
        <div style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 6px auto;
          border: 2px solid white;
          position: relative;
          transition: all 0.3s ease;
        " class="avatar-container">
          <img src="${barber.image}" alt="${barber.name}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: all 0.3s ease;
          " class="avatar-image" />
          <!-- Hover overlay -->
          <div style="
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.2));
            opacity: 0;
            transition: all 0.3s ease;
          " class="avatar-overlay"></div>
        </div>
        
        <!-- Price with enhanced styling -->
        <div style="
          background: linear-gradient(135deg, white 0%, #f8fafc 100%);
          color: #dc2626;
          font-weight: bold;
          font-size: 13px;
          padding: 4px 8px;
          border-radius: 8px;
          text-align: center;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        " class="price-tag">
          ${barber.price}
        </div>

        <!-- Rating stars -->
        <div style="
          display: flex;
          justify-content: center;
          margin-top: 4px;
          gap: 1px;
        ">
          ${Array.from({length: 5}, (_, i) => `
            <span style="
              color: ${i < Math.floor(barber.rating) ? '#fbbf24' : '#d1d5db'};
              font-size: 10px;
              text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            ">★</span>
          `).join('')}
        </div>
      </div>

      <!-- Floating info tooltip -->
      <div style="
        position: absolute;
        bottom: 85px;
        left: 50%;
        transform: translateX(-50%) scale(0);
        background: rgba(17, 24, 39, 0.95);
        backdrop-filter: blur(10px);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        white-space: nowrap;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        pointer-events: none;
        z-index: 1000;
      " class="tooltip">
        <div style="font-weight: 600; margin-bottom: 2px;">${barber.name}</div>
        <div style="color: #dc2626; font-weight: 500;">${barber.specialty}</div>
        <div style="color: #9ca3af; font-size: 11px;">${barber.distance}</div>
        <!-- Tooltip arrow -->
        <div style="
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid rgba(17, 24, 39, 0.95);
        "></div>
      </div>
    </div>
  `;

  // Add enhanced CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-ring {
      0% {
        transform: translateX(-50%) scale(0.8);
        opacity: 1;
      }
      100% {
        transform: translateX(-50%) scale(1.4);
        opacity: 0;
      }
    }

    @keyframes marker-bounce {
      0% {
        transform: translateX(-50%) scale(0) translateY(20px);
        opacity: 0;
      }
      50% {
        transform: translateX(-50%) scale(1.1) translateY(-5px);
      }
      100% {
        transform: translateX(-50%) scale(1) translateY(0);
        opacity: 1;
      }
    }

    .marker-container:hover .marker-body {
      transform: translateX(-50%) scale(1.1) translateY(-5px);
      box-shadow: 0 12px 35px rgba(220, 38, 38, 0.5), 0 5px 15px rgba(0,0,0,0.3);
    }

    .marker-container:hover .pin-tail {
      border-top-color: #b91c1c;
      transform: translateX(-50%) scale(1.1);
    }

    .marker-container:hover .avatar-container {
      transform: scale(1.05);
    }

    .marker-container:hover .avatar-overlay {
      opacity: 1;
    }

    .marker-container:hover .price-tag {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white;
      transform: scale(1.05);
    }

    .marker-container:hover .tooltip {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }

    .marker-container:active .marker-body {
      transform: translateX(-50%) scale(0.95) translateY(2px);
    }
  `;
  
  if (!document.head.querySelector('#barber-marker-styles')) {
    style.id = 'barber-marker-styles';
    document.head.appendChild(style);
  }
  
  return markerElement;
};
