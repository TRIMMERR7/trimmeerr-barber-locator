
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AdSlider = () => {
  const [currentBarber, setCurrentBarber] = useState(0);

  const topBarbers = [
    {
      id: 1,
      name: "Marcus Johnson",
      title: "Master Barber of 2024",
      specialty: "Fades & Braids Specialist",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=200&fit=crop&crop=face",
      rating: 4.9,
      color: "from-gold-600 to-yellow-600",
      awards: "Best Fade Artist"
    },
    {
      id: 2,
      name: "Carlos Rivera",
      title: "Excellence Award Winner",
      specialty: "Classic Cuts Expert",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop&crop=face",
      rating: 4.8,
      color: "from-blue-600 to-purple-600",
      awards: "Client Favorite"
    },
    {
      id: 3,
      name: "Ahmed Hassan",
      title: "Rising Star 2024",
      specialty: "Beard Styling Master",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=200&fit=crop&crop=face",
      rating: 4.7,
      color: "from-green-600 to-teal-600",
      awards: "Innovation Award"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBarber((prev) => (prev + 1) % topBarbers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [topBarbers.length]);

  const handleBarberClick = (index: number) => {
    setCurrentBarber(index);
  };

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30">
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-28 overflow-hidden">
            {topBarbers.map((barber, index) => (
              <div
                key={barber.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out cursor-pointer ${
                  index === currentBarber ? 'translate-x-0 opacity-100' : 
                  index < currentBarber ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
                }`}
                onClick={() => console.log(`Clicked top barber: ${barber.name}`)}
              >
                <div className={`h-full bg-gradient-to-r ${barber.color} flex items-center justify-between p-4 relative overflow-hidden`}>
                  {/* Rating badge */}
                  <div className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    ⭐ {barber.rating}
                  </div>
                  
                  <div className="flex-1 pr-4">
                    <div className="text-white/90 text-xs font-medium mb-1">{barber.title}</div>
                    <h3 className="text-white font-bold text-sm leading-tight mb-1">{barber.name}</h3>
                    <p className="text-white/80 text-xs leading-tight mb-1">{barber.specialty}</p>
                    <div className="text-white/70 text-xs font-medium">{barber.awards}</div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <img
                      src={barber.image}
                      alt={barber.name}
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
          
          {/* Header and Indicators */}
          <div className="flex justify-between items-center p-3 bg-gray-50">
            <div className="text-sm font-semibold text-gray-800">🏆 Top Barbers of the Year</div>
            <div className="flex gap-1">
              {topBarbers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleBarberClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentBarber ? 'bg-gray-800 w-6' : 'bg-gray-300 hover:bg-gray-400'
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
