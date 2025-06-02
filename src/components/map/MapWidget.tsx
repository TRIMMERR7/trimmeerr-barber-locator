
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MapWidget = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const topBarbers = [
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

  const companyAds = [
    {
      id: 4,
      company: "BarberTools Pro",
      tagline: "Professional Equipment",
      offer: "20% OFF Premium Clippers",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&h=60&fit=crop",
      color: "from-blue-600/80 to-blue-700/80",
      type: "ad"
    },
    {
      id: 5,
      company: "StyleCare Products",
      tagline: "Premium Hair Care",
      offer: "Buy 2 Get 1 FREE Pomades",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=60&fit=crop",
      color: "from-green-600/80 to-green-700/80",
      type: "ad"
    },
    {
      id: 6,
      company: "BarberAcademy",
      tagline: "Learn & Grow",
      offer: "Enroll Now - 30% Discount",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=60&fit=crop",
      color: "from-purple-600/80 to-purple-700/80",
      type: "ad"
    }
  ];

  const allSlides = [...topBarbers, ...companyAds];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % allSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [allSlides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + allSlides.length) % allSlides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % allSlides.length);
  };

  const currentItem = allSlides[currentSlide];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-[100]"
    >
      {/* Hover trigger - compact widget style */}
      <div className="w-16 h-16 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center cursor-pointer border border-white/10 hover:bg-black/30 transition-all duration-300 shadow-xl">
        <div className="flex flex-col items-center">
          <span className="text-lg">🏆</span>
          <span className="text-xs">📢</span>
        </div>
      </div>

      {/* Content - positioned to the right of trigger */}
      <Card className={`absolute top-0 left-full ml-3 bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden w-80 transition-all duration-300 ${
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <CardContent className="p-0">
          <div className="relative h-24 overflow-hidden">
            {/* Barber Content */}
            {currentItem.type === 'barber' && (
              <div className="h-full bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-sm flex items-center p-4 border-b border-white/10">
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/20 mr-4 shadow-lg"
                />
                <div className="flex-1">
                  <div className="text-white/90 text-xs font-medium mb-1">{currentItem.title}</div>
                  <h4 className="text-white font-bold text-sm leading-tight">{currentItem.name}</h4>
                </div>
                <div className="text-white text-xs font-bold bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                  ⭐ {currentItem.rating}
                </div>
              </div>
            )}

            {/* Ad Content */}
            {currentItem.type === 'ad' && (
              <div
                className={`h-full bg-gradient-to-r ${currentItem.color} backdrop-blur-sm flex items-center justify-between p-4 relative overflow-hidden border-b border-white/10 cursor-pointer`}
                onClick={() => console.log(`Clicked ad: ${currentItem.company}`)}
              >
                <div className="flex-1 pr-3">
                  <div className="text-white/90 text-xs font-medium mb-1">{currentItem.tagline}</div>
                  <h3 className="text-white font-bold text-sm leading-tight mb-1">{currentItem.company}</h3>
                  <div className="text-white/80 text-xs font-medium bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm inline-block">
                    {currentItem.offer}
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  <img
                    src={currentItem.image}
                    alt={currentItem.company}
                    className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-lg"
                  />
                </div>
                
                {/* Subtle decorative elements */}
                <div className="absolute -right-6 -top-6 w-12 h-12 bg-white/5 rounded-full blur-sm"></div>
                <div className="absolute -left-3 -bottom-3 w-8 h-8 bg-white/5 rounded-full blur-sm"></div>
              </div>
            )}
          </div>
          
          {/* Header and Controls with glass effect */}
          <div className="flex justify-between items-center p-3 bg-white/5 backdrop-blur-sm border-t border-white/10">
            <div className="text-xs font-semibold text-white/90">
              {currentItem.type === 'barber' ? '🏆 Top Barber' : '📢 Partner Offer'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
              >
                <ChevronLeft className="w-3 h-3 text-white" />
              </button>
              <div className="flex gap-1">
                {allSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200"
              >
                <ChevronRight className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapWidget;
