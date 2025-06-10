
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
        rating: Number(barber.rating) || 0,
        specialty: barber.specialty || 'General Barber',
        image: barber.profile_image_url || '/placeholder.svg',
        price: `$${barber.hourly_rate || 35}/hr`,
        distance: '0.5 mi', // This would need geolocation calculation
        experience: barber.experience || 'New',
        lat: barber.latitude,
        lng: barber.longitude,
        ethnicity: 'Unknown', // These fields might need to be added to the profile
        age: 25,
        languages: ['English'],
        personalityTraits: ['Professional'],
        videoUrl: undefined
      }));

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
  }, []);

  return { barbers, loading, error, refetch: fetchBarbers };
};
