
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdItem {
  id: number;
  company: string;
  tagline: string;
  offer: string;
  image: string;
  color: string;
}

const MapWidget = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();

  const companyAds: AdItem[] = [
    {
      id: 1,
      company: "BarberTools Pro",
      tagline: "Professional Equipment",
      offer: "20% OFF Premium Clippers",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&h=60&fit=crop",
      color: "from-blue-500/90 to-blue-600/90"
    },
    {
      id: 2,
      company: "StyleCare Products",
      tagline: "Premium Hair Care",
      offer: "Buy 2 Get 1 FREE",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=60&fit=crop",
      color: "from-emerald-500/90 to-emerald-600/90"
    },
    {
      id: 3,
      company: "BarberAcademy",
      tagline: "Learn & Grow",
      offer: "30% Discount - Enroll Now",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=60&fit=crop",
      color: "from-purple-500/90 to-purple-600/90"
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % companyAds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [companyAds.length, isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + companyAds.length) % companyAds.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % companyAds.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const currentAd = companyAds[currentSlide];

  return (
    <div className="p-3 md:p-4">
      {/* Compact Bottom Panel */}
      <Card className="bg-gradient-to-r from-black/60 to-black/80 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {/* Trigger Section - Always Visible */}
            <div className="flex items-center p-3 md:p-4 flex-1">
              <div className={`${
                isMobile ? 'w-10 h-10' : 'w-12 h-12'
              } bg-gradient-to-br from-green-500/80 to-green-600/80 rounded-lg flex items-center justify-center mr-3 shadow-lg`}>
                <span className={`${isMobile ? 'text-lg' : 'text-xl'}`}>📢</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`text-white/80 ${
                  isMobile ? 'text-xs' : 'text-sm'
                } font-medium mb-1`}>
                  Special Offer
                </div>
                <div className={`text-white font-bold ${
                  isMobile ? 'text-sm' : 'text-base'
                } truncate`}>
                  {currentAd.company}
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-2 mr-3">
                <div className="text-white text-xs font-semibold bg-green-500/20 px-2 py-1 rounded-full backdrop-blur-sm">
                  Offer
                </div>
              </div>

              {/* Expand/Collapse Indicator */}
              <div className={`text-white/60 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : ''
              }`}>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          <div className={`transition-all duration-500 overflow-hidden ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="border-t border-white/10">
              {/* Detailed Content Area */}
              <div className={`relative ${isMobile ? 'h-32' : 'h-36'} overflow-hidden`}>
                {/* Ad Detailed Content */}
                <div className={`h-full bg-gradient-to-r ${currentAd.color} backdrop-blur-sm flex items-center justify-between p-4 relative overflow-hidden cursor-pointer group/ad`}>
                  <div className="flex-1 pr-4 min-w-0">
                    <div className={`text-white/80 ${
                      isMobile ? 'text-sm' : 'text-base'
                    } font-medium mb-2`}>{currentAd.tagline}</div>
                    <h3 className={`text-white font-bold ${
                      isMobile ? 'text-lg' : 'text-xl'
                    } leading-tight mb-3`}>{currentAd.company}</h3>
                    <div className="text-white font-semibold text-sm bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm inline-block">
                      {currentAd.offer}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <img
                      src={currentAd.image}
                      alt={currentAd.company}
                      className={`${
                        isMobile ? 'w-16 h-16' : 'w-20 h-20'
                      } rounded-xl object-cover border-2 border-white/30 shadow-xl group-hover/ad:scale-105 transition-transform duration-300`}
                    />
                  </div>
                </div>
              </div>
              
              {/* Controls Panel */}
              <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm border-t border-white/10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {e.stopPropagation(); handlePrev();}}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  
                  <div className="flex gap-1">
                    {companyAds.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {e.stopPropagation(); handleSlideSelect(index);}}
                        className={`h-2 rounded-full transition-all duration-300 hover:scale-110 ${
                          index === currentSlide 
                            ? 'bg-white w-8' 
                            : 'bg-white/50 hover:bg-white/70 w-2'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={(e) => {e.stopPropagation(); handleNext();}}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                <div className="text-white/70 text-sm font-medium">
                  {currentSlide + 1} of {companyAds.length}
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
