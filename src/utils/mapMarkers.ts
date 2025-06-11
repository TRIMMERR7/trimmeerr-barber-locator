
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

export const createUserLocationMarker = (latitude: number, longitude: number) => {
  console.log('createUserLocationMarker: Creating user location marker');
  
  const userIcon = L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: -5px;
          left: -5px;
          width: 34px;
          height: 34px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  return L.marker([latitude, longitude], { icon: userIcon })
    .bindPopup('<div style="padding: 8px; font-weight: bold;">Your Location</div>');
};

export const createBarberMarker = (barber: Barber, onBarberSelect: (barber: Barber) => void) => {
  console.log('createBarberMarker: Adding marker for barber:', barber.name);

  const barberIcon = L.divIcon({
    className: 'custom-barber-marker',
    html: `
      <div style="
        position: relative;
        width: 50px;
        height: 60px;
        cursor: pointer;
        z-index: 1000;
      ">
        <div style="
          width: 50px;
          height: 50px;
          background: #dc2626;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        ">
          <img 
            src="${barber.image}" 
            alt="${barber.name}" 
            style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              object-fit: cover;
            "
          />
          <div style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            background: #059669;
            color: white;
            padding: 1px 4px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 1px;
          ">
            ⭐ ${barber.rating}
          </div>
        </div>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: #dc2626;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
          white-space: nowrap;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${barber.price}
        </div>
        <div style="
          position: absolute;
          top: -2px;
          left: -2px;
          width: 54px;
          height: 54px;
          border: 2px solid #dc2626;
          border-radius: 50%;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          opacity: 0.4;
        "></div>
      </div>
      <style>
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
      </style>
    `,
    iconSize: [50, 60],
    iconAnchor: [25, 50]
  });

  const marker = L.marker([barber.lat, barber.lng], { icon: barberIcon })
    .bindPopup(
      `<div style="padding: 16px; min-width: 220px; font-family: system-ui, -apple-system, sans-serif;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <img 
            src="${barber.image}" 
            alt="${barber.name}" 
            style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #dc2626;"
          />
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: bold; color: #1f2937;">${barber.name}</h3>
            <p style="margin: 0 0 4px 0; color: #dc2626; font-weight: 500; font-size: 14px;">${barber.specialty}</p>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="background: #059669; color: white; padding: 2px 6px; border-radius: 8px; font-size: 12px; font-weight: bold;">
                ⭐ ${barber.rating}
              </span>
              <span style="color: #6b7280; font-size: 12px;">${barber.experience}</span>
            </div>
          </div>
        </div>
        <div style="display: flex; justify-between; items-center; padding-top: 8px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #059669;">${barber.price}</p>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">${barber.distance}</p>
        </div>
      </div>`
    );

  marker.on('click', () => {
    console.log('Barber marker clicked:', barber.name);
    onBarberSelect(barber);
  });

  return marker;
};
