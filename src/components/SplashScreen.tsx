
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
          className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 mb-8 drop-shadow-2xl"
        />
      </div>

      {/* Text with glow effect */}
      <div className={`transform transition-all duration-1000 delay-300 ease-out ${showText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent mb-6 text-center tracking-wider animate-pulse drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" 
            style={{
              textShadow: '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3), 0 0 60px rgba(239, 68, 68, 0.1)',
              filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.4))'
            }}>
          TRIMMERR
        </h1>
        <p className="text-gray-300 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center animate-pulse tracking-wide">
          Book your perfect barber in seconds
        </p>
      </div>

      {/* Enhanced loading indicator with glow */}
      <div className={`mt-16 transition-all duration-500 delay-1000 ${showText ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-20 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full overflow-hidden shadow-lg"
             style={{
               boxShadow: '0 0 20px rgba(239, 68, 68, 0.6), 0 0 40px rgba(239, 68, 68, 0.3)'
             }}>
          <div className="h-full bg-white/40 animate-pulse rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
