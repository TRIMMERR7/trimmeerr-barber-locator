
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AdSlider = () => {
  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    {
      id: 1,
      title: "Premium Hair Products",
      subtitle: "Professional grade tools & products",
      image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&h=200&fit=crop",
      brand: "BarberPro",
      color: "from-blue-600 to-purple-600"
    },
    {
      id: 2,
      title: "New Clippers Collection",
      subtitle: "Precision cutting technology",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=200&fit=crop",
      brand: "CutMaster",
      color: "from-red-600 to-orange-600"
    },
    {
      id: 3,
      title: "Beard Care Essentials",
      subtitle: "Natural oils & styling products",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&h=200&fit=crop",
      brand: "BeardCraft",
      color: "from-green-600 to-teal-600"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [ads.length]);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10">
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-24 overflow-hidden">
            {ads.map((ad, index) => (
              <div
                key={ad.id}
                className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                  index === currentAd ? 'translate-x-0' : 
                  index < currentAd ? '-translate-x-full' : 'translate-x-full'
                }`}
              >
                <div className={`h-full bg-gradient-to-r ${ad.color} flex items-center justify-between p-4`}>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-sm">{ad.title}</h3>
                    <p className="text-white/80 text-xs">{ad.subtitle}</p>
                    <span className="text-white/60 text-xs font-medium">{ad.brand}</span>
                  </div>
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-white/20"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center gap-1 p-2 bg-black/20">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAd(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentAd ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdSlider;
