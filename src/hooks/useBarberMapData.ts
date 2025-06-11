
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
      const transformedBarbers: BarberMapData[] = data.map(barber => ({
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
      }));

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
          
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const updatedBarber = payload.new;
            
            // Only include active barbers with valid coordinates
            if (updatedBarber.is_active && updatedBarber.latitude && updatedBarber.longitude) {
              const transformedBarber: BarberMapData = {
                id: updatedBarber.id,
                name: updatedBarber.business_name || 'Unnamed Barber',
                rating: Number(updatedBarber.rating) || 4.5,
                specialty: updatedBarber.specialty || 'General Barber',
                image: updatedBarber.profile_image_url || '/placeholder.svg',
                price: `$${updatedBarber.hourly_rate || 35}/hr`,
                distance: '0.5 mi',
                experience: updatedBarber.experience || 'New',
                lat: Number(updatedBarber.latitude),
                lng: Number(updatedBarber.longitude),
                ethnicity: 'Unknown',
                age: 25,
                languages: ['English'],
                personalityTraits: ['Professional'],
                videoUrl: undefined
              };

              setBarbers(prevBarbers => {
                const existingIndex = prevBarbers.findIndex(b => b.id === updatedBarber.id);
                if (existingIndex >= 0) {
                  // Update existing barber
                  const updated = [...prevBarbers];
                  updated[existingIndex] = transformedBarber;
                  return updated;
                } else {
                  // Add new barber
                  return [...prevBarbers, transformedBarber];
                }
              });
            } else if (!updatedBarber.is_active) {
              // Remove inactive barber from map
              setBarbers(prevBarbers => prevBarbers.filter(b => b.id !== updatedBarber.id));
            }
          } else if (payload.eventType === 'DELETE') {
            // Remove deleted barber
            setBarbers(prevBarbers => prevBarbers.filter(b => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up barber map real-time subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return { barbers, loading, error, refetch: fetchBarbers };
};
