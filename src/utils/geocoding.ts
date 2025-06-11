
// Enhanced geocoding utility with better address handling and fallbacks
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!address.trim()) {
    console.warn('Empty address provided for geocoding');
    return null;
  }

  // Clean and format the address
  const cleanAddress = address
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/,\s*/g, ', ') // Ensure proper comma spacing
    .replace(/\btx\b/gi, 'Texas') // Replace 'tx' with 'Texas'
    .replace(/\bfl\b/gi, 'Florida') // Common state abbreviations
    .replace(/\bca\b/gi, 'California')
    .replace(/\bny\b/gi, 'New York');

  console.log('Geocoding address:', cleanAddress);

  try {
    // Primary geocoding attempt with OpenStreetMap Nominatim
    const encodedAddress = encodeURIComponent(cleanAddress);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=us`,
      {
        headers: {
          'User-Agent': 'TrimmerrApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      const coords = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      };
      
      console.log('Geocoding successful:', coords);
      return coords;
    }
    
    // Fallback: Try with just city and state if full address fails
    const cityStateMatch = cleanAddress.match(/([^,]+),?\s*([a-zA-Z\s]+)\s*(\d{5})?$/);
    if (cityStateMatch) {
      const [, city, state] = cityStateMatch;
      const fallbackAddress = `${city.trim()}, ${state.trim()}, USA`;
      console.log('Trying fallback address:', fallbackAddress);
      
      const fallbackResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackAddress)}&limit=1&countrycodes=us`,
        {
          headers: {
            'User-Agent': 'TrimmerrApp/1.0'
          }
        }
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData && fallbackData.length > 0) {
          const result = fallbackData[0];
          const coords = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          };
          
          console.log('Fallback geocoding successful:', coords);
          return coords;
        }
      }
    }
    
    console.warn('No geocoding results found for address:', cleanAddress);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Additional helper function to validate coordinates
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return (
    !isNaN(lat) && 
    !isNaN(lng) && 
    lat >= -90 && 
    lat <= 90 && 
    lng >= -180 && 
    lng <= 180
  );
};

// Function to get address suggestions for better user experience
export const getAddressSuggestions = async (query: string): Promise<string[]> => {
  if (!query.trim() || query.length < 3) {
    return [];
  }

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&limit=5&countrycodes=us&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'TrimmerrApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    return data.map((item: any) => item.display_name).slice(0, 5);
  } catch (error) {
    console.error('Address suggestion error:', error);
    return [];
  }
};
