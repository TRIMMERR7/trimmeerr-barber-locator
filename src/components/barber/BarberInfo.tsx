
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock, Award } from "lucide-react";

interface Barber {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string;
  price: string;
  distance: string;
  experience: string;
  lat: number;
  lng: number;
  videoUrl?: string;
}

interface BarberInfoProps {
  barber: Barber;
}

const BarberInfo = ({ barber }: BarberInfoProps) => {
  return (
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          {/* Large Profile Video/Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {barber.videoUrl ? (
                <video
                  src={barber.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-3xl object-cover shadow-2xl border-2 border-white/20 backdrop-blur-sm"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement;
                    const img = document.createElement('img');
                    img.src = barber.image;
                    img.alt = barber.name;
                    img.className = target.className;
                    target.parentNode?.replaceChild(img, target);
                  }}
                />
              ) : (
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-40 h-40 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-3xl object-cover shadow-2xl border-2 border-white/20"
                />
              )}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{barber.name}</h2>
              <p className="text-red-400 font-semibold text-lg md:text-xl mb-3">{barber.specialty}</p>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium text-white">{barber.rating}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{barber.distance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price and experience section - made smaller */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <Clock className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Experience</p>
                  <p className="font-semibold text-white text-base">{barber.experience}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-gray-400">Starting from</p>
                <p className="text-2xl font-bold text-red-400">{barber.price}</p>
              </div>
            </div>
          </div>

          {/* Quick stats - made smaller */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 backdrop-blur-sm rounded-full mx-auto mb-2 border border-green-400/30">
                <Award className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-xs text-gray-400 mb-1">Licensed</p>
              <p className="text-xs font-semibold text-white">Certified</p>
            </div>
            
            <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-full mx-auto mb-2 border border-blue-400/30">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-gray-400 mb-1">Avg. Time</p>
              <p className="text-xs font-semibold text-white">30 min</p>
            </div>
            
            <div className="text-center p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-500/20 backdrop-blur-sm rounded-full mx-auto mb-2 border border-yellow-400/30">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-xs text-gray-400 mb-1">Reviews</p>
              <p className="text-xs font-semibold text-white">127+</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarberInfo;
