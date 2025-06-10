
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'admin' | 'barber' | 'client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('get_current_user_role');

      if (error) throw error;
      setRole(data as UserRole);
    } catch (err) {
      console.error('Error fetching user role:', err);
      // Default to client role if there's an error
      setRole('client');
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    return role === requiredRole;
  };

  const isBarber = (): boolean => {
    return role === 'barber';
  };

  const isAdmin = (): boolean => {
    return role === 'admin';
  };

  const isClient = (): boolean => {
    return role === 'client';
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  return {
    role,
    loading,
    hasRole,
    isBarber,
    isAdmin,
    isClient,
    refetch: fetchUserRole
  };
};
