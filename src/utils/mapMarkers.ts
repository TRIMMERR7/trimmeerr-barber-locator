
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
    className: 'user-location-marker',
    html: `
      <div class="user-marker-container">
        <div class="user-marker-pin">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" 
               alt="Your location" class="user-avatar" />
        </div>
        <div class="user-marker-pulse"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  return L.marker([latitude, longitude], { icon: userIcon })
    .bindPopup('<div class="p-2"><strong>Your Location</strong></div>');
};

export const createBarberMarker = (barber: Barber, onBarberSelect: (barber: Barber) => void) => {
  console.log('createBarberMarker: Adding marker for barber:', barber.name);

  const barberIcon = L.divIcon({
    className: 'barber-marker',
    html: `
      <div class="barber-marker-container">
        <div class="barber-marker-pin">
          <img src="${barber.image}" alt="${barber.name}" class="barber-avatar" />
        </div>
        <div class="barber-marker-pulse"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  const marker = L.marker([barber.lat, barber.lng], { icon: barberIcon })
    .bindPopup(
      `<div class="p-3 min-w-[200px]">
        <div class="flex items-center gap-3 mb-2">
          <img src="${barber.image}" alt="${barber.name}" class="w-12 h-12 rounded-full object-cover" />
          <div>
            <h3 class="font-bold text-lg text-gray-900">${barber.name}</h3>
            <p class="text-red-600 font-medium">${barber.specialty}</p>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <p class="text-2xl font-bold text-green-600">${barber.price}</p>
          <div class="text-right">
            <p class="text-gray-600">${barber.distance}</p>
            <p class="text-yellow-500 font-medium">⭐ ${barber.rating}</p>
          </div>
        </div>
      </div>`
    );

  marker.on('click', () => {
    onBarberSelect(barber);
  });

  return marker;
};
