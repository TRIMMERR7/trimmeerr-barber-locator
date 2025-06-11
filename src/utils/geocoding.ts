
// Enhanced geocoding utility with better address handling and multiple fallbacks
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!address.trim()) {
    console.warn('Empty address provided for geocoding');
    return null;
  }

  // Clean and format the address with better normalization
  const cleanAddress = address
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/,\s*/g, ', ') // Ensure proper comma spacing
    .replace(/\btx\b/gi, 'Texas') // Replace 'tx' with 'Texas'
    .replace(/\bfl\b/gi, 'Florida') // Common state abbreviations
    .replace(/\bca\b/gi, 'California')
    .replace(/\bny\b/gi, 'New York')
    .replace(/\bfreeway\b/gi, 'Fwy') // Normalize freeway abbreviations
    .replace(/\bservice road\b/gi, 'Service Rd')
    .replace(/\bservcie\b/gi, 'Service') // Fix common typo
    .replace(/\bread\b/gi, 'Rd')
    .replace(/\bstreet\b/gi, 'St')
    .replace(/\bavenue\b/gi, 'Ave')
    .replace(/\bboulevard\b/gi, 'Blvd');

  console.log('Geocoding address:', cleanAddress);

  const fallbackStrategies = [
    cleanAddress, // Original cleaned address
    cleanAddress.replace(/\bservice rd\b/gi, ''), // Remove "Service Rd"
    cleanAddress.replace(/\bkaty\s+(freeway|fwy)\s+service\s+(rd|road)\b/gi, 'Katy Fwy'), // Simplify Katy Freeway Service Road
    cleanAddress.replace(/\d+\s+/, ''), // Remove street number for broader search
  ];

  // Extract city, state, zip for fallback
  const cityStateMatch = cleanAddress.match(/([^,]+),?\s*([a-zA-Z\s]+)\s*(\d{5})?$/);
  if (cityStateMatch) {
    const [, , state, zip] = cityStateMatch;
    // Add city-level fallbacks
    if (zip) {
      fallbackStrategies.push(`Houston, ${state} ${zip}`);
      fallbackStrategies.push(`${zip}, USA`); // ZIP code only
    }
    fallbackStrategies.push(`Houston, ${state}, USA`);
  }

  for (let i = 0; i < fallbackStrategies.length; i++) {
    const searchAddress = fallbackStrategies[i].trim();
    if (!searchAddress) continue;

    try {
      console.log(`Trying strategy ${i + 1}:`, searchAddress);
      
      const encodedAddress = encodeURIComponent(searchAddress);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=3&countrycodes=us&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TrimmerrApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        console.warn(`Strategy ${i + 1} request failed:`, response.status);
        continue;
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Prefer results with house numbers for street addresses
        let bestResult = data[0];
        if (i === 0 && data.length > 1) { // Only for first strategy (exact address)
          const resultWithHouseNumber = data.find((result: any) => 
            result.address && result.address.house_number
          );
          if (resultWithHouseNumber) {
            bestResult = resultWithHouseNumber;
          }
        }
        
        const coords = {
          lat: parseFloat(bestResult.lat),
          lng: parseFloat(bestResult.lon)
        };
        
        console.log(`Strategy ${i + 1} successful:`, coords, bestResult.display_name);
        return coords;
      }
      
      console.log(`Strategy ${i + 1} returned no results`);
      
      // Add delay between requests to respect rate limits
      if (i < fallbackStrategies.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (error) {
      console.error(`Strategy ${i + 1} error:`, error);
      continue;
    }
  }
  
  console.warn('All geocoding strategies failed for address:', address);
  return null;
};

// Additional helper function to validate coordinates
export const validateCoordinates = (lat: number, lng: number): boolean => {
  return (
    !isNaN(lat) && 
    !isNaN(lng) && 
    lat >= -90 && 
    lat <= 90 && 
    lng >= -180 && 
    lng <= 180 &&
    lat !== 0 || lng !== 0 // Avoid 0,0 coordinates which are likely errors
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
