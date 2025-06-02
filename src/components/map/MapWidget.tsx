
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdItem {
  id: number;
  company: string;
  tagline: string;
  offer: string;
  image: string;
  color: string;
  ctaText: string;
  website: string;
}

const MapWidget = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const isMobile = useIsMobile();

  const companyAds: AdItem[] = [
    {
      id: 1,
      company: "BarberTools Pro",
      tagline: "Professional Equipment",
      offer: "20% OFF Premium Clippers",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=120&h=120&fit=crop",
      color: "from-blue-500/90 via-blue-600/90 to-blue-700/90",
      ctaText: "Shop Now",
      website: "barbertools.com"
    },
    {
      id: 2,
      company: "StyleCare Products",
      tagline: "Premium Hair Care",
      offer: "Buy 2 Get 1 FREE",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&h=120&fit=crop",
      color: "from-emerald-500/90 via-emerald-600/90 to-emerald-700/90",
      ctaText: "Get Deal",
      website: "stylecare.com"
    },
    {
      id: 3,
      company: "BarberAcademy",
      tagline: "Learn & Grow",
      offer: "30% Discount - Enroll Now",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=120&fit=crop",
      color: "from-purple-500/90 via-purple-600/90 to-purple-700/90",
      ctaText: "Enroll",
      website: "barberacademy.com"
    },
    {
      id: 4,
      company: "TrimTech Solutions",
      tagline: "Smart Booking System",
      offer: "Free 30-Day Trial",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop",
      color: "from-orange-500/90 via-orange-600/90 to-orange-700/90",
      ctaText: "Try Free",
      website: "trimtech.com"
    }
  ];

  useEffect(() => {
    if (isPaused || isHovering) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % companyAds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [companyAds.length, isPaused, isHovering]);

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

  const currentAd = companyAds[currentSlide];

  return (
    <div className="p-2 md:p-3">
      <Card 
        className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl"
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
              {/* Ad Icon with Pulse Animation */}
              <div className={`${
                isMobile ? 'w-10 h-10' : 'w-12 h-12'
              } bg-gradient-to-br from-red-500/90 to-pink-600/90 rounded-xl flex items-center justify-center mr-3 shadow-lg transition-all duration-300 group-hover:scale-110 ${
                !isPaused ? 'animate-pulse' : ''
              }`}>
                <span className={`${isMobile ? 'text-lg' : 'text-xl'}`}>🎯</span>
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
                {!isPaused ? (
                  <Play className="w-3 h-3 text-green-400" />
                ) : (
                  <Pause className="w-3 h-3 text-yellow-400" />
                )}
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
              <div className={`relative ${isMobile ? 'h-40' : 'h-44'} overflow-hidden group/ad`}>
                <div className={`h-full bg-gradient-to-r ${currentAd.color} backdrop-blur-sm flex items-center justify-between p-4 md:p-6 relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]`}
                     onClick={() => handleAdClick(currentAd.website)}>
                  
                  {/* Content Section */}
                  <div className="flex-1 pr-4 min-w-0 z-10">
                    <div className={`text-white/90 ${
                      isMobile ? 'text-sm' : 'text-base'
                    } font-semibold mb-2 tracking-wide`}>
                      {currentAd.tagline}
                    </div>
                    <h3 className={`text-white font-bold ${
                      isMobile ? 'text-xl' : 'text-2xl'
                    } leading-tight mb-3 drop-shadow-lg`}>
                      {currentAd.company}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <div className="text-white font-bold text-lg bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm inline-block shadow-lg">
                        {currentAd.offer}
                      </div>
                      <button className="flex items-center gap-2 text-white font-semibold text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 w-fit">
                        {currentAd.ctaText}
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Image Section */}
                  <div className="flex-shrink-0 z-10">
                    <div className="relative">
                      <img
                        src={currentAd.image}
                        alt={currentAd.company}
                        className={`${
                          isMobile ? 'w-20 h-20' : 'w-24 h-24'
                        } rounded-2xl object-cover border-3 border-white/40 shadow-2xl transition-all duration-500 group-hover/ad:scale-110 group-hover/ad:rotate-3`}
                      />
                      <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm opacity-0 group-hover/ad:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -right-8 -top-8 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
                  <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-white/5 rounded-full blur-lg"></div>
                  <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
              
              {/* Enhanced Controls Panel */}
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {e.stopPropagation(); handlePrev();}}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  
                  <div className="flex gap-2">
                    {companyAds.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {e.stopPropagation(); handleSlideSelect(index);}}
                        className={`h-2 rounded-full transition-all duration-500 hover:scale-125 ${
                          index === currentSlide 
                            ? 'bg-white w-8 shadow-lg' 
                            : 'bg-white/50 hover:bg-white/70 w-2'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={(e) => {e.stopPropagation(); handleNext();}}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {e.stopPropagation(); setIsPaused(!isPaused);}}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    {isPaused ? (
                      <Play className="w-3 h-3 text-white ml-0.5" />
                    ) : (
                      <Pause className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <div className="text-white/80 text-sm font-medium">
                    {currentSlide + 1} / {companyAds.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapWidget;
