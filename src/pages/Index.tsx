
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import MapView from '@/components/MapView';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const { user, loading, userType } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  console.log('Index: Rendering with auth state:', { 
    hasUser: !!user, 
    loading, 
    userType, 
    showSplash 
  });

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={() => {
      console.log('Index: Splash completed, showing main content');
      setShowSplash(false);
    }} />;
  }

  // Show loading screen while auth is initializing
  if (loading) {
    console.log('Index: Still loading authentication...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="glass-morphism-dark rounded-2xl p-8 flex flex-col items-center space-y-6">
          {/* Logo */}
          <img 
            src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
            alt="TRIMMERR Logo" 
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-xl"
          />
          
          {/* Loading text */}
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

  // Show auth page if no user is logged in
  if (!user) {
    console.log('Index: No user found, showing auth page');
    return <AuthPage />;
  }

  // Show main app if user is authenticated
  console.log('Index: User authenticated, showing map view');
  return <MapView userType={userType} />;
};

export default Index;
