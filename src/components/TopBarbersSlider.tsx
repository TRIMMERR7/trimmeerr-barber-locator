
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
      {/* Hover trigger - always visible */}
      <div className="w-16 h-16 bg-red-600/80 rounded-full flex items-center justify-center cursor-pointer shadow-lg backdrop-blur-sm border border-white/20">
        <span className="text-white font-bold">🏆</span>
      </div>

      {/* Content - only visible on hover */}
      <Card className={`absolute top-0 left-0 bg-white shadow-2xl border-0 overflow-hidden w-64 transition-all duration-300 ${
        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <CardContent className="p-0">
          <div className="relative h-16 overflow-hidden">
            {topBarbers.map((barber, index) => (
              <div
                key={barber.id}
                className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                  index === currentBarber ? 'translate-x-0 opacity-100' : 
                  index < currentBarber ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
                }`}
              >
                <div className="h-full bg-gradient-to-r from-red-600 to-red-700 flex items-center p-3">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/50 mr-3"
                  />
                  <div className="flex-1">
                    <div className="text-white/90 text-xs font-medium">{barber.title}</div>
                    <h4 className="text-white font-bold text-sm">{barber.name}</h4>
                  </div>
                  <div className="text-white text-xs font-bold">⭐ {barber.rating}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-3 py-1 text-center">
            <div className="text-xs font-semibold text-gray-800">🏆 Top Barbers of the Year</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopBarbersSlider;
