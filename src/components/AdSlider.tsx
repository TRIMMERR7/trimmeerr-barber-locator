
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AdSlider = () => {
  const [currentAd, setCurrentAd] = useState(0);

  const companyAds = [
    {
      id: 1,
      company: "BarberTools Pro",
      tagline: "Professional Equipment",
      offer: "20% OFF Premium Clippers",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=80&h=60&fit=crop",
      color: "from-blue-600 to-blue-700"
    },
    {
      id: 2,
      company: "StyleCare Products",
      tagline: "Premium Hair Care",
      offer: "Buy 2 Get 1 FREE Pomades",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=60&fit=crop",
      color: "from-green-600 to-green-700"
    },
    {
      id: 3,
      company: "BarberAcademy",
      tagline: "Learn & Grow",
      offer: "Enroll Now - 30% Discount",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=60&fit=crop",
      color: "from-purple-600 to-purple-700"
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
    <Card className="bg-white shadow-2xl border-0 overflow-hidden relative z-[100] max-w-md mx-auto lg:mx-0">
      <CardContent className="p-0">
        <div className="relative h-20 overflow-hidden">
          {companyAds.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
                index === currentAd ? 'translate-x-0 opacity-100' : 
                index < currentAd ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
              }`}
              onClick={() => console.log(`Clicked ad: ${ad.company}`)}
            >
              <div className={`h-full bg-gradient-to-r ${ad.color} flex items-center justify-between p-3 relative overflow-hidden`}>
                <div className="flex-1 pr-3">
                  <div className="text-white/90 text-xs font-medium mb-1">{ad.tagline}</div>
                  <h3 className="text-white font-bold text-sm leading-tight mb-1">{ad.company}</h3>
                  <div className="text-white/80 text-xs font-medium">{ad.offer}</div>
                </div>
                
                <div className="flex-shrink-0">
                  <img
                    src={ad.image}
                    alt={ad.company}
                    className="w-14 h-14 rounded-lg object-cover border-2 border-white/30 shadow-md"
                  />
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -right-8 -top-8 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-white/5 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Header and Indicators */}
        <div className="flex justify-between items-center p-2 bg-gray-50">
          <div className="text-xs font-semibold text-gray-800">📢 Partner Offers</div>
          <div className="flex gap-1">
            {companyAds.map((_, index) => (
              <button
                key={index}
                onClick={() => handleAdClick(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentAd ? 'bg-gray-800 w-4' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdSlider;
