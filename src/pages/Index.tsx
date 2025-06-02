
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import MapView from '@/components/MapView';

const Index = () => {
  const { user, loading } = useAuth();

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

  // Get user type from metadata or default to client
  const userType = user.user_metadata?.user_type || 'client';

  return <MapView userType={userType} />;
};

export default Index;
