
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
    ">
      <!-- Red pin background -->
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
      "></div>
      
      <!-- Main marker container -->
      <div style="
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        background: #dc2626;
        border: 3px solid white;
        border-radius: 12px;
        padding: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        min-width: 60px;
      ">
        <!-- Profile picture -->
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 4px auto;
          border: 2px solid white;
        ">
          <img src="${barber.image}" alt="${barber.name}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          " />
        </div>
        
        <!-- Price -->
        <div style="
          background: white;
          color: #dc2626;
          font-weight: bold;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 6px;
          text-align: center;
          white-space: nowrap;
        ">
          ${barber.price}
        </div>
      </div>
    </div>
  `;
  
  return markerElement;
};
