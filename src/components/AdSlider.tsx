
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AdSlider = () => {
  const [currentAd, setCurrentAd] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const companyAds = [
    {
      id: 1,
      company: "BarberTools Pro",
      tagline: "Professional Equipment",
      offer: "20% OFF Premium Clippers",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&h=60&fit=crop",
      color: "from-blue-600/80 to-blue-700/80"
    },
    {
      id: 2,
      company: "StyleCare Products",
      tagline: "Premium Hair Care",
      offer: "Buy 2 Get 1 FREE Pomades",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=60&fit=crop",
      color: "from-green-600/80 to-green-700/80"
    },
    {
      id: 3,
      company: "BarberAcademy",
      tagline: "Learn & Grow",
      offer: "Enroll Now - 30% Discount",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=60&fit=crop",
      color: "from-purple-600/80 to-purple-700/80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % companyAds.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [companyAds.length]);

  const handleAdClick = (index: number) => {
    setCurrentAd(index);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-[100]"
    >
      {/* Hover trigger - modern glass morphism style */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center cursor-pointer border border-white/10 hover:bg-black/30 transition-all duration-300 shadow-xl">
        <span className="text-xl sm:text-2xl">📢</span>
      </div>

      {/* Content - glass morphism design with improved positioning */}
      <Card className={`absolute bottom-0 right-0 bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ${
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <CardContent className="p-0">
          <div className="relative h-24 overflow-hidden w-72 sm:w-80">
            {companyAds.map((ad, index) => (
              <div
                key={ad.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
                  index === currentAd ? 'translate-x-0 opacity-100' : 
                  index < currentAd ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
                }`}
                onClick={() => console.log(`Clicked ad: ${ad.company}`)}
              >
                <div className={`h-full bg-gradient-to-r ${ad.color} backdrop-blur-sm flex items-center justify-between p-4 relative overflow-hidden border-b border-white/10`}>
                  <div className="flex-1 pr-3">
                    <div className="text-white/90 text-xs font-medium mb-1">{ad.tagline}</div>
                    <h3 className="text-white font-bold text-sm leading-tight mb-1">{ad.company}</h3>
                    <div className="text-white/80 text-xs font-medium bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm inline-block">
                      {ad.offer}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <img
                      src={ad.image}
                      alt={ad.company}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/20 shadow-lg"
                    />
                  </div>
                  
                  {/* Subtle decorative elements */}
                  <div className="absolute -right-6 -top-6 w-12 h-12 bg-white/5 rounded-full blur-sm"></div>
                  <div className="absolute -left-3 -bottom-3 w-8 h-8 bg-white/5 rounded-full blur-sm"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Header and Indicators with glass effect */}
          <div className="flex justify-between items-center p-3 bg-white/5 backdrop-blur-sm border-t border-white/10">
            <div className="text-xs font-semibold text-white/90">📢 Partner Offers</div>
            <div className="flex gap-1.5">
              {companyAds.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleAdClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentAd ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSlider;
