
export const createMapConfig = (center: any) => ({
  center: center,
  region: new window.mapkit.CoordinateRegion(
    center,
    new window.mapkit.CoordinateSpan(0.016, 0.016) // Adjusted for better initial zoom
  ),
  mapType: window.mapkit.Map.MapTypes.Standard,
  showsMapTypeControl: false,
  showsZoomControl: true,
  showsUserLocationControl: true,
  isRotationEnabled: true,
  colorScheme: window.mapkit.Map.ColorSchemes.Light, // Changed to light for better marker visibility
  showsCompass: window.mapkit.FeatureVisibility.Visible,
  showsScale: window.mapkit.FeatureVisibility.Hidden,
  isScrollEnabled: true,
  isZoomEnabled: true
});

export const getDefaultCenter = () => 
  new window.mapkit.Coordinate(29.7604, -95.3698); // Houston default
