
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BarberMapData {
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
  ethnicity: string;
  age: number;
  languages: string[];
  personalityTraits: string[];
  videoUrl?: string;
}

export const useBarberMapData = () => {
  const [barbers, setBarbers] = useState<BarberMapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformBarberData = (barber: any): BarberMapData => ({
    id: barber.id,
    name: barber.business_name || 'Unnamed Barber',
    rating: Number(barber.rating) || 4.5,
    specialty: barber.specialty || 'General Barber',
    image: barber.profile_image_url || '/placeholder.svg',
    price: `$${barber.hourly_rate || 35}/hr`,
    distance: '0.5 mi', // This would need geolocation calculation
    experience: barber.experience || 'New',
    lat: Number(barber.latitude) || 0,
    lng: Number(barber.longitude) || 0,
    ethnicity: 'Unknown', // These fields might need to be added to the profile
    age: 25,
    languages: ['English'],
    personalityTraits: ['Professional'],
    videoUrl: undefined
  });

  const fetchBarbers = async () => {
    try {
      const { data, error } = await supabase
        .from('barber_profiles')
        .select('*')
        .eq('is_active', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      // Transform the data to match the expected format
      const transformedBarbers: BarberMapData[] = data.map(transformBarberData);

      console.log('Fetched barbers for map:', transformedBarbers.length);
      setBarbers(transformedBarbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch barbers');
      console.error('Error fetching barber map data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();

    // Set up real-time subscription for barber profile changes
    console.log('Setting up real-time subscription for barber map data');
    
    const channel = supabase
      .channel('barber-map-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'barber_profiles'
        },
        (payload) => {
          console.log('Real-time barber profile change detected:', payload);
          console.log('Event type:', payload.eventType);
          console.log('New data:', payload.new);
          console.log('Old data:', payload.old);
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updatedBarber = payload.new;
            console.log('Processing UPDATE/INSERT for barber:', updatedBarber.business_name);
            
            // Only include active barbers with valid coordinates
            if (updatedBarber.is_active && updatedBarber.latitude && updatedBarber.longitude) {
              const transformedBarber = transformBarberData(updatedBarber);
              console.log('Adding/updating barber on map:', transformedBarber.name);

              setBarbers(prevBarbers => {
                const existingIndex = prevBarbers.findIndex(b => b.id === updatedBarber.id);
                console.log('Existing barber index:', existingIndex);
                
                if (existingIndex >= 0) {
                  // Update existing barber
                  const updated = [...prevBarbers];
                  updated[existingIndex] = transformedBarber;
                  console.log('Updated existing barber:', transformedBarber.name);
                  return updated;
                } else {
                  // Add new barber
                  console.log('Adding new barber:', transformedBarber.name);
                  return [...prevBarbers, transformedBarber];
                }
              });
            } else if (!updatedBarber.is_active) {
              console.log('Removing inactive barber from map:', updatedBarber.business_name);
              // Remove inactive barber from map
              setBarbers(prevBarbers => prevBarbers.filter(b => b.id !== updatedBarber.id));
            }
          } else if (payload.eventType === 'DELETE') {
            console.log('Removing deleted barber from map');
            // Remove deleted barber
            setBarbers(prevBarbers => prevBarbers.filter(b => b.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up barber map real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { barbers, loading, error, refetch: fetchBarbers };
};
