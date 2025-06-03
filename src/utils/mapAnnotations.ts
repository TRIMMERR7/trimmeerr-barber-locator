
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
  onBarberSelect: (barber: Barber) => void
) => {
  // Create a custom marker annotation with enhanced styling
  const annotation = new window.mapkit.MarkerAnnotation(
    new window.mapkit.Coordinate(barber.lat, barber.lng),
    {
      color: '#EF4444',
      glyphColor: '#FFFFFF',
      title: barber.name,
      subtitle: `${barber.specialty} • ${barber.price}`,
      data: { barber },
      displayPriority: 750,
      animates: true
    }
  );

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
    // Calculate the center and span for all barber locations
    const latitudes = nearbyBarbers.map(barber => barber.lat);
    const longitudes = nearbyBarbers.map(barber => barber.lng);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    // Add padding to the span
    const latSpan = Math.max((maxLat - minLat) * 1.2, 0.01);
    const lngSpan = Math.max((maxLng - minLng) * 1.2, 0.01);
    
    const center = new window.mapkit.Coordinate(centerLat, centerLng);
    const span = new window.mapkit.CoordinateSpan(latSpan, lngSpan);
    const region = new window.mapkit.CoordinateRegion(center, span);
    
    map.setRegionAnimated(region, true);
  }
};
