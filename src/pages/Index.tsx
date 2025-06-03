
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import MapView from '@/components/MapView';
import SplashScreen from '@/components/SplashScreen';

const Index = () => {
  const { user, loading, userType } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');

  // Debug logging to track where we're getting stuck
  useEffect(() => {
    console.log('Index: Component mounted');
    console.log('Index: Auth state - loading:', loading, 'user:', !!user, 'userType:', userType);
    
    let debugText = `Auth loading: ${loading}, User exists: ${!!user}, UserType: ${userType}`;
    setDebugInfo(debugText);
  }, [loading, user, userType]);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={() => {
      console.log('Index: Splash screen completed');
      setShowSplash(false);
    }} />;
  }

  if (loading) {
    console.log('Index: Still loading auth...');
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
            <p className="text-gray-300 text-lg animate-pulse">Loading authentication...</p>
            <p className="text-xs text-gray-500">{debugInfo}</p>
          </div>
          
          {/* Loading spinner */}
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>

          {/* Emergency bypass after 10 seconds */}
          <button 
            onClick={() => {
              console.log('Index: Emergency bypass clicked');
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  console.log('Index: Auth loaded, user:', !!user);

  if (!user) {
    console.log('Index: No user, showing auth page');
    return <AuthPage />;
  }

  console.log('Index: User authenticated, showing map view');
  return <MapView userType={userType} />;
};

export default Index;
