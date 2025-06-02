import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BarberItem {
  id: number;
  name: string;
  title: string;
  image: string;
  rating: number;
  type: 'barber';
}

interface AdItem {
  id: number;
  company: string;
  tagline: string;
  offer: string;
  image: string;
  color: string;
  type: 'ad';
}

type SlideItem = BarberItem | AdItem;

const MapWidget = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();

  const topBarbers: BarberItem[] = [
    {
      id: 1,
      name: "Marcus Johnson",
      title: "Master Barber 2024",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4.9,
      type: "barber"
    },
    {
      id: 2,
      name: "Carlos Rivera", 
      title: "Excellence Award Winner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4.8,
      type: "barber"
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      title: "Rising Star 2024", 
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      rating: 4.7,
      type: "barber"
    }
  ];

  const companyAds: AdItem[] = [
    {
      id: 4,
      company: "BarberTools Pro",
      tagline: "Professional Equipment",
      offer: "20% OFF Premium Clippers",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&h=60&fit=crop",
      color: "from-blue-500/90 to-blue-600/90",
      type: "ad"
    },
    {
      id: 5,
      company: "StyleCare Products",
      tagline: "Premium Hair Care",
      offer: "Buy 2 Get 1 FREE",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=60&fit=crop",
      color: "from-emerald-500/90 to-emerald-600/90",
      type: "ad"
    },
    {
      id: 6,
      company: "BarberAcademy",
      tagline: "Learn & Grow",
      offer: "30% Discount - Enroll Now",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=60&fit=crop",
      color: "from-purple-500/90 to-purple-600/90",
      type: "ad"
    }
  ];

  const allSlides: SlideItem[] = [...topBarbers, ...companyAds];

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [allSlides.length, isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const currentItem = allSlides[currentSlide];

  return (
    <div
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onClick={() => isMobile && setIsHovered(!isHovered)}
      className="relative z-[100] group"
    >
      {/* Trigger Button - Mobile Optimized */}
      <div className={`${
        isMobile 
          ? 'w-12 h-12 fixed bottom-20 right-4 shadow-xl' 
          : 'w-14 h-14 md:w-16 md:h-16'
        } bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl rounded-xl flex flex-col items-center justify-center cursor-pointer border border-white/30 hover:border-white/50 transition-all duration-500 shadow-2xl hover:shadow-red-500/30 group-hover:scale-105`}>
        <div className={`${
          isMobile ? 'text-base' : 'text-lg md:text-xl'
        } mb-0.5 transform transition-transform duration-300 group-hover:scale-110`}>
          {currentItem.type === 'barber' ? '🏆' : '📢'}
        </div>
        <div className="w-4 h-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-70"></div>
      </div>

      {/* Content Panel - Mobile Adaptive */}
      <Card className={`absolute ${
        isMobile 
          ? 'bottom-full mb-4 right-0 w-[280px]' 
          : 'top-0 left-full ml-4 w-80 md:w-96'
        } bg-gradient-to-br from-black/50 to-black/70 backdrop-blur-2xl border border-white/30 shadow-2xl overflow-hidden transition-all duration-500 ${
        isHovered ? 'opacity-100 scale-100 translate-x-0 translate-y-0' : 'opacity-0 scale-95 pointer-events-none' + (isMobile ? ' translate-y-2' : ' translate-x-2')
      }`}>
        <CardContent className="p-0">
          {/* Main Content Area */}
          <div className={`relative ${isMobile ? 'h-24' : 'h-28 md:h-32'} overflow-hidden`}>
            {/* Barber Content */}
            {currentItem.type === 'barber' && (
              <div className="h-full bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-sm flex items-center p-3 md:p-4 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-16 h-16 bg-white/20 rounded-full -translate-x-8 -translate-y-8"></div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/10 rounded-full translate-x-6 translate-y-6"></div>
                </div>
                
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className={`${
                    isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'
                  } rounded-xl object-cover border-2 border-white/30 mr-3 shadow-xl z-10 relative`}
                />
                <div className="flex-1 min-w-0 z-10 relative">
                  <div className={`text-white/80 ${
                    isMobile ? 'text-xs' : 'text-xs md:text-sm'
                  } font-medium mb-1 truncate`}>{currentItem.title}</div>
                  <h4 className={`text-white font-bold ${
                    isMobile ? 'text-sm' : 'text-base md:text-lg'
                  } leading-tight truncate mb-2`}>{currentItem.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className={`text-white ${
                      isMobile ? 'text-xs' : 'text-xs'
                    } font-bold bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1`}>
                      <span className="text-yellow-300">⭐</span>
                      {currentItem.rating}
                    </div>
                    <div className={`text-white/70 ${
                      isMobile ? 'text-xs' : 'text-xs'
                    } font-medium`}>Top Rated</div>
                  </div>
                </div>
              </div>
            )}

            {/* Ad Content */}
            {currentItem.type === 'ad' && (
              <div
                className={`h-full bg-gradient-to-r ${currentItem.color} backdrop-blur-sm flex items-center justify-between p-3 md:p-4 relative overflow-hidden cursor-pointer group/ad`}
                onClick={() => console.log(`Clicked ad: ${currentItem.company}`)}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full translate-x-10 -translate-y-10 group-hover/ad:scale-110 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/10 rounded-full -translate-x-6 translate-y-6 group-hover/ad:scale-110 transition-transform duration-500"></div>
                </div>
                
                <div className="flex-1 pr-3 min-w-0 z-10 relative">
                  <div className={`text-white/80 ${
                    isMobile ? 'text-xs' : 'text-xs md:text-sm'
                  } font-medium mb-1 truncate`}>{currentItem.tagline}</div>
                  <h3 className={`text-white font-bold ${
                    isMobile ? 'text-sm' : 'text-base md:text-lg'
                  } leading-tight mb-2 truncate`}>{currentItem.company}</h3>
                  <div className={`text-white font-semibold ${
                    isMobile ? 'text-xs' : 'text-sm'
                  } bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm inline-block max-w-full truncate`}>
                    {currentItem.offer}
                  </div>
                </div>
                
                <div className="flex-shrink-0 z-10 relative">
                  <img
                    src={currentItem.image}
                    alt={currentItem.company}
                    className={`${
                      isMobile ? 'w-12 h-12' : 'w-14 h-14 md:w-16 md:h-16'
                    } rounded-xl object-cover border-2 border-white/30 shadow-xl group-hover/ad:scale-105 transition-transform duration-300`}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Controls Panel */}
          <div className={`flex justify-between items-center ${
            isMobile ? 'p-2' : 'p-3 md:p-4'
          } bg-white/10 backdrop-blur-sm border-t border-white/20`}>
            <div className={`${
              isMobile ? 'text-xs' : 'text-xs md:text-sm'
            } font-semibold text-white/90 truncate flex items-center gap-1`}>
              <span className={isMobile ? 'text-sm' : 'text-base'}>
                {currentItem.type === 'barber' ? '🏆' : '📢'}
              </span>
              {currentItem.type === 'barber' ? 'Top Barber' : 'Special Offer'}
            </div>
            
            <div className={`flex items-center ${isMobile ? 'gap-1' : 'gap-2 md:gap-3'}`}>
              <button
                onClick={handlePrev}
                className={`${
                  isMobile ? 'w-6 h-6' : 'w-7 h-7 md:w-8 md:h-8'
                } rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
              >
                <ChevronLeft className={`${
                  isMobile ? 'w-3 h-3' : 'w-3 h-3 md:w-4 md:h-4'
                } text-white`} />
              </button>
              
              <div className="flex gap-1">
                {allSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideSelect(index)}
                    className={`${
                      isMobile ? 'h-1' : 'h-1.5 md:h-2'
                    } rounded-full transition-all duration-300 hover:scale-110 ${
                      index === currentSlide 
                        ? `bg-white ${isMobile ? 'w-4' : 'w-6 md:w-8'}` 
                        : `bg-white/50 hover:bg-white/70 ${isMobile ? 'w-1' : 'w-1.5 md:w-2'}`
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleNext}
                className={`${
                  isMobile ? 'w-6 h-6' : 'w-7 h-7 md:w-8 md:h-8'
                } rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95`}
              >
                <ChevronRight className={`${
                  isMobile ? 'w-3 h-3' : 'w-3 h-3 md:w-4 md:h-4'
                } text-white`} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapWidget;
