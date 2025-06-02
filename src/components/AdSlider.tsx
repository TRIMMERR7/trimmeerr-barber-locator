
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AdSlider = () => {
  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    {
      id: 1,
      title: "Premium Hair Products",
      subtitle: "Professional grade tools & styling products",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=200&fit=crop",
      brand: "BarberPro",
      color: "from-blue-600 to-purple-600",
      offer: "20% OFF"
    },
    {
      id: 2,
      title: "New Clippers Collection",
      subtitle: "Precision cutting technology for professionals",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=200&fit=crop",
      brand: "CutMaster",
      color: "from-red-600 to-orange-600",
      offer: "Buy 1 Get 1"
    },
    {
      id: 3,
      title: "Beard Care Essentials",
      subtitle: "Natural oils & premium styling products",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=200&fit=crop",
      brand: "BeardCraft",
      color: "from-green-600 to-teal-600",
      offer: "Free Shipping"
    },
    {
      id: 4,
      title: "Barbershop Furniture",
      subtitle: "Professional chairs & stations",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=200&fit=crop",
      brand: "ShopPro",
      color: "from-purple-600 to-pink-600",
      offer: "Starting $299"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000); // Changed to 5 seconds for better viewing
    return () => clearInterval(timer);
  }, [ads.length]);

  const handleAdClick = (index: number) => {
    setCurrentAd(index);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30">
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-28 overflow-hidden">
            {ads.map((ad, index) => (
              <div
                key={ad.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
                  index === currentAd ? 'translate-x-0 opacity-100' : 
                  index < currentAd ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
                }`}
                onClick={() => console.log(`Clicked ad: ${ad.brand}`)}
              >
                <div className={`h-full bg-gradient-to-r ${ad.color} flex items-center justify-between p-4 relative overflow-hidden`}>
                  {/* Offer badge */}
                  <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full text-xs font-bold">
                    {ad.offer}
                  </div>
                  
                  <div className="flex-1 pr-4">
                    <div className="text-white/90 text-xs font-medium mb-1">{ad.brand}</div>
                    <h3 className="text-white font-bold text-sm leading-tight mb-1">{ad.title}</h3>
                    <p className="text-white/80 text-xs leading-tight">{ad.subtitle}</p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-20 h-20 rounded-xl object-cover border-3 border-white/30 shadow-lg"
                    />
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -right-10 -top-10 w-20 h-20 bg-white/10 rounded-full"></div>
                  <div className="absolute -left-5 -bottom-5 w-15 h-15 bg-white/5 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Indicators */}
          <div className="flex justify-center items-center gap-2 p-3 bg-gray-50">
            <div className="flex gap-1">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleAdClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentAd ? 'bg-gray-800 w-6' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            <div className="text-xs text-gray-500 ml-2">
              Ad {currentAd + 1} of {ads.length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSlider;
