
export const createMarkerContainer = (): HTMLDivElement => {
  const markerElement = document.createElement('div');
  markerElement.className = 'custom-barber-marker';
  markerElement.style.cssText = `
    position: relative;
    width: 50px;
    height: 70px;
    cursor: pointer;
    transform: translateX(-50%) translateY(-100%);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
  `;
  return markerElement;
};

export const createPulseRings = (): string => {
  return `
    <!-- Animated pulse ring -->
    <div style="
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 50px;
      border: 2px solid #dc2626;
      border-radius: 50%;
      opacity: 0.6;
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    "></div>
    
    <!-- Secondary pulse ring -->
    <div style="
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 50px;
      border: 2px solid #dc2626;
      border-radius: 50%;
      opacity: 0.4;
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      animation-delay: 1s;
    "></div>
  `;
};

export const createPinTail = (): string => {
  return `
    <!-- Pin tail -->
    <div style="
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 12px solid #dc2626;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      z-index: 1001;
    "></div>
  `;
};

export const createMarkerBody = (barber: any): string => {
  return `
    <!-- Main marker body -->
    <div style="
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      border: 2px solid white;
      border-radius: 12px;
      padding: 6px;
      box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4), 0 2px 8px rgba(0,0,0,0.2);
      min-width: 50px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      animation: marker-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      z-index: 1002;
    ">
      <!-- Profile picture -->
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto 4px auto;
        border: 1px solid white;
        background: white;
      ">
        <img src="${barber.image}" alt="${barber.name}" style="
          width: 100%;
          height: 100%;
          object-fit: cover;
        " onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNkYzI2MjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo='" />
      </div>
      
      <!-- Price -->
      <div style="
        background: white;
        color: #dc2626;
        font-weight: bold;
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 6px;
        text-align: center;
        white-space: nowrap;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      ">
        ${barber.price}
      </div>
    </div>
  `;
};

export const createTooltip = (barber: any): string => {
  return `
    <!-- Tooltip -->
    <div style="
      position: absolute;
      bottom: 75px;
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
      z-index: 1003;
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
  `;
};
