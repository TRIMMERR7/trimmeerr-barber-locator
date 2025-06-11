
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BarberProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  specialty: string | null;
  experience: string | null;
  bio: string | null;
  hourly_rate: number | null;
  phone: string | null;
  location: string | null;
  services: string[] | null;
  working_hours: any;
  profile_image_url: string | null;
  portfolio_images: string[] | null;
  rating: number;
  completed_cuts: number;
  is_active: boolean;
  is_verified: boolean;
  latitude: number | null;
  longitude: number | null;
}

export const useBarberProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('barber_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<BarberProfile>) => {
    if (!user) throw new Error('No authenticated user');

    try {
      // First check if profile already exists
      const { data: existingProfile } = await supabase
        .from('barber_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile instead of creating new one
        const { data, error } = await supabase
          .from('barber_profiles')
          .update({
            ...profileData,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
        return data;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('barber_profiles')
          .insert({
            user_id: user.id,
            ...profileData
          })
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
        return data;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProfile = async (updates: Partial<BarberProfile>) => {
    if (!user || !profile) throw new Error('No profile to update');

    try {
      const { data, error } = await supabase
        .from('barber_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: fetchProfile
  };
};
