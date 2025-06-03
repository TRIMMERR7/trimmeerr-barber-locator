
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import MapView from '@/components/MapView';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const { user, loading, userType } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
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
