
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AuthPage from '@/components/AuthPage';
import MapView from '@/components/MapView';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [userType, setUserType] = useState<'barber' | 'client'>('client');
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch user profile data when user is available
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && !profileLoading) {
        setProfileLoading(true);
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            // Default to client if profile not found
            setUserType('client');
          } else {
            const profileUserType = profile?.user_type;
            setUserType((profileUserType === 'barber' || profileUserType === 'client') ? profileUserType : 'client');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserType('client');
        } finally {
          setProfileLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user, profileLoading]);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MapView userType={userType} />;
};

export default Index;
