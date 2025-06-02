
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

export const createBarberAnnotation = (
  barber: Barber, 
  markerElement: HTMLElement,
  onBarberSelect: (barber: Barber) => void
) => {
  const annotation = new window.mapkit.MarkerAnnotation(
    new window.mapkit.Coordinate(barber.lat, barber.lng),
    {
      color: '#EF4444',
      glyphColor: '#FFFFFF',
      title: barber.name,
      subtitle: `${barber.specialty} • ${barber.price}`,
      data: { barber },
      element: markerElement
    }
  );

  // Add click event to the custom element
  markerElement.addEventListener('click', (event) => {
    event.stopPropagation();
    console.log('Barber marker selected:', barber.name);
    onBarberSelect(barber);
  });

  // Add selection event listener
  annotation.addEventListener('select', (event) => {
    console.log('Barber marker selected:', barber.name);
    onBarberSelect(barber);
  });

  // Add deselect event for debugging
  annotation.addEventListener('deselect', () => {
    console.log('Barber marker deselected:', barber.name);
  });

  return annotation;
};

export const setMapRegionForBarbers = (map: any, nearbyBarbers: Barber[]) => {
  if (nearbyBarbers.length > 0) {
    const coordinates = nearbyBarbers.map(barber => 
      new window.mapkit.Coordinate(barber.lat, barber.lng)
    );
    
    const region = window.mapkit.CoordinateRegion.regionFittingCoordinates(coordinates);
    map.setRegionAnimated(region, true);
  }
};
