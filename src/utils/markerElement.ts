
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

export const createMarkerElement = (barber: Barber, index: number) => {
  const markerElement = document.createElement('div');
  markerElement.className = 'barber-marker-container';
  markerElement.style.setProperty('--animation-delay', `${index * 0.1}s`);
  
  markerElement.innerHTML = `
    <div class="barber-marker-wrapper">
      <div class="barber-marker-pin">
        <div class="barber-avatar-container">
          <img src="${barber.image}" alt="${barber.name}" class="barber-avatar" />
          <div class="barber-status-indicator"></div>
        </div>
        <div class="barber-price-badge">${barber.price}</div>
      </div>
      <div class="barber-marker-pulse"></div>
      <div class="barber-marker-glow"></div>
    </div>
  `;

  return markerElement;
};
