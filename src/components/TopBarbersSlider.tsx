
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const TopBarbersSlider = () => {
  const [currentBarber, setCurrentBarber] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const topBarbers = [
    {
      id: 1,
      name: "Marcus Johnson",
      title: "Master Barber 2024",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4.9
    },
    {
      id: 2,
      name: "Carlos Rivera", 
      title: "Excellence Award Winner",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4.8
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      title: "Rising Star 2024", 
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      rating: 4.7
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBarber((prev) => (prev + 1) % topBarbers.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [topBarbers.length]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-[100]"
    >
      {/* Hover trigger - modern glass morphism style */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-black/20 backdrop-blur-md rounded-2xl flex items-center justify-center cursor-pointer border border-white/10 hover:bg-black/30 transition-all duration-300 shadow-xl">
        <span className="text-xl sm:text-2xl">🏆</span>
      </div>

      {/* Content - positioned to the right of trigger */}
      <Card className={`absolute top-0 left-full ml-3 bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden w-64 sm:w-72 transition-all duration-300 ${
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <CardContent className="p-0">
          <div className="relative h-20 overflow-hidden">
            {topBarbers.map((barber, index) => (
              <div
                key={barber.id}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === currentBarber ? 'translate-x-0 opacity-100' : 
                  index < currentBarber ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
                }`}
              >
                <div className="h-full bg-gradient-to-r from-red-600/80 to-red-700/80 backdrop-blur-sm flex items-center p-4 border-b border-white/10">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/20 mr-3 sm:mr-4 shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="text-white/90 text-xs font-medium mb-1">{barber.title}</div>
                    <h4 className="text-white font-bold text-sm leading-tight">{barber.name}</h4>
                  </div>
                  <div className="text-white text-xs font-bold bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                    ⭐ {barber.rating}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-4 py-2 text-center border-t border-white/10">
            <div className="text-xs font-semibold text-white/90">🏆 Top Barbers of the Year</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopBarbersSlider;
