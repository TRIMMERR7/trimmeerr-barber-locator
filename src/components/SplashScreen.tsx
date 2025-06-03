
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start logo animation immediately
    setShowLogo(true);
    
    // Show text after logo appears
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 800);

    // Start fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Complete the splash screen
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Logo */}
      <div className={`transform transition-all duration-1000 ease-out ${showLogo ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}>
        <img 
          src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
          alt="TRIMMERR Logo" 
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mb-6"
        />
      </div>

      {/* Text */}
      <div className={`transform transition-all duration-1000 delay-300 ease-out ${showText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-4">
          TRIMMERR
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl md:text-2xl text-center animate-pulse">
          Book your perfect barber in seconds
        </p>
      </div>

      {/* Loading indicator */}
      <div className={`mt-12 transition-all duration-500 delay-1000 ${showText ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full overflow-hidden">
          <div className="h-full bg-white/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
