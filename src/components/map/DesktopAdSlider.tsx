
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Play, Pause } from 'lucide-react';
import { companyAds } from './AdData';

const DesktopAdSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isPaused || isHovering) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % companyAds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, isHovering]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + companyAds.length) % companyAds.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % companyAds.length);
  };

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index);
  };

  const handleAdClick = (website: string) => {
    window.open(`https://${website}`, '_blank');
  };

  const currentAd = companyAds[currentSlide];

  return (
    <div 
      className="h-full flex flex-col"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Ad Display Area */}
      <div className="flex-1 relative overflow-hidden">
        <div className="relative h-full">
          {companyAds.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
                index === currentSlide ? 'translate-x-0 opacity-100' : 
                index < currentSlide ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
              }`}
              onClick={() => handleAdClick(ad.website)}
            >
              <div className={`h-full bg-gradient-to-br ${ad.color} backdrop-blur-sm flex flex-col justify-between p-6 relative overflow-hidden`}>
                {/* Content Section */}
                <div className="flex-1 z-10">
                  <div className="text-white/90 text-sm font-semibold mb-3 tracking-wide">
                    {ad.tagline}
                  </div>
                  <h3 className="text-white font-bold text-3xl leading-tight mb-4 drop-shadow-lg">
                    {ad.company}
                  </h3>
                  <div className="space-y-4">
                    <div className="text-white font-bold text-xl bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm inline-block shadow-lg">
                      {ad.offer}
                    </div>
                    <button className="flex items-center gap-3 text-white font-semibold text-base bg-white/15 hover:bg-white/25 px-6 py-3 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 w-fit">
                      {ad.ctaText}
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Image Section */}
                <div className="flex justify-center z-10 mt-6">
                  <div className="relative">
                    <img
                      src={ad.image}
                      alt={ad.company}
                      className="w-32 h-32 rounded-3xl object-cover border-4 border-white/40 shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3"
                    />
                    <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -right-12 -top-12 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute -left-8 -bottom-8 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
                <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border-t border-white/10">
        {/* Left Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          {/* Indicators */}
          <div className="flex gap-2">
            {companyAds.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSlideSelect(index);
                }}
                className={`h-2 rounded-full transition-all duration-500 hover:scale-125 ${
                  index === currentSlide 
                    ? 'bg-white w-8 shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70 w-2'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-white ml-0.5" />
            ) : (
              <Pause className="w-4 h-4 text-white" />
            )}
          </button>
          
          <div className="text-white/80 text-sm font-medium">
            {currentSlide + 1} / {companyAds.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopAdSlider;
