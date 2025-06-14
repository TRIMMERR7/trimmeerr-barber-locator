
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import AdDisplay from './AdDisplay';
import AdControls from './AdControls';
import { companyAds } from './AdData';

const MapWidget = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isPaused || isHovering || !isExpanded) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % companyAds.length);
    }, 8000); // Longer duration for videos
    return () => clearInterval(timer);
  }, [isPaused, isHovering, isExpanded]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + companyAds.length) % companyAds.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % companyAds.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleAdClick = (website: string) => {
    window.open(`https://${website}`, '_blank');
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const currentAd = companyAds[currentSlide];

  return (
    <div className="p-2 md:p-3">
      <Card 
        className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardContent className="p-0">
          {/* Compact Trigger Bar */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center p-3 md:p-4 flex-1 min-w-0">
              {/* Modern Ad Icon */}
              <div className={`${
                isMobile ? 'w-10 h-10' : 'w-12 h-12'
              } bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center mr-3 shadow-lg transition-all duration-300 group-hover:scale-110`}>
                <Zap className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
              </div>
              
              {/* Content Preview */}
              <div className="flex-1 min-w-0 mr-3">
                <div className={`text-white/90 ${
                  isMobile ? 'text-xs' : 'text-sm'
                } font-medium mb-1 opacity-80`}>
                  Partner Offers
                </div>
                <div className={`text-white font-bold ${
                  isMobile ? 'text-sm' : 'text-base'
                } truncate transition-colors duration-300 group-hover:text-blue-300`}>
                  {currentAd.company}
                </div>
              </div>

              {/* Live Indicator */}
              <div className="flex items-center gap-2 mr-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-xs font-medium">LIVE</span>
                </div>
              </div>

              {/* Expand Indicator */}
              <div className={`text-white/60 transition-all duration-500 ${
                isExpanded ? 'rotate-90' : ''
              } group-hover:text-white/80`}>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          <div className={`transition-all duration-700 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            {/* Main Ad Display */}
            <div className="border-t border-white/10">
              <AdDisplay 
                ad={currentAd}
                onAdClick={handleAdClick}
                isActive={isExpanded}
              />
              
              {/* Enhanced Controls Panel */}
              <AdControls
                ads={companyAds}
                currentSlide={currentSlide}
                isPaused={isPaused}
                onPrev={handlePrev}
                onNext={handleNext}
                onSlideSelect={handleSlideSelect}
                onTogglePause={handleTogglePause}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapWidget;
