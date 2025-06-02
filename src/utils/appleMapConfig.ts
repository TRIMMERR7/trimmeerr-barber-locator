
export const createMapConfig = (center: any) => ({
  center: center,
  region: new window.mapkit.CoordinateRegion(
    center,
    new window.mapkit.CoordinateSpan(0.008, 0.008) // Closer zoom for better marker visibility
  ),
  mapType: window.mapkit.Map.MapTypes.Standard,
  showsMapTypeControl: false,
  showsZoomControl: true,
  showsUserLocationControl: true,
  isRotationEnabled: true,
  colorScheme: window.mapkit.Map.ColorSchemes.Light, // Change to light for better marker contrast
  showsCompass: window.mapkit.FeatureVisibility.Hidden,
  showsScale: window.mapkit.FeatureVisibility.Hidden,
  isScrollEnabled: true,
  isZoomEnabled: true
});

export const getDefaultCenter = () => 
  new window.mapkit.Coordinate(29.7604, -95.3698); // Houston default
