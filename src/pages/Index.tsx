
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="glass-morphism-dark rounded-2xl p-8 flex flex-col items-center space-y-6">
          {/* Logo */}
          <img 
            src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
            alt="TRIMMERR Logo" 
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-xl"
          />
          
          {/* Loading text with gradient */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              TRIMMERR
            </h2>
            <p className="text-gray-300 text-lg animate-pulse">Loading...</p>
          </div>
          
          {/* Loading spinner */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <MapView userType={userType} />;
};

export default Index;
