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
  videoUrl?: string; // New optional video URL
}

interface BarberInfoProps {
  barber: Barber;
}

const BarberInfo = ({ barber }: BarberInfoProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          {/* Mobile-first layout */}
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {barber.videoUrl ? (
                <video
                  src={barber.videoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-lg"
                  onError={(e) => {
                    // Fallback to image if video fails to load
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
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-lg"
                />
              )}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 truncate">{barber.name}</h2>
              <p className="text-red-600 font-semibold text-base md:text-lg mb-2">{barber.specialty}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{barber.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{barber.distance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price and experience section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-900">{barber.experience}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-600">Starting from</p>
                <p className="text-2xl font-bold text-red-600">{barber.price}</p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-xs text-gray-600">Licensed</p>
              <p className="text-sm font-semibold text-gray-900">Certified</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-gray-600">Avg. Time</p>
              <p className="text-sm font-semibold text-gray-900">30 min</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full mx-auto mb-2">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-xs text-gray-600">Reviews</p>
              <p className="text-sm font-semibold text-gray-900">127+</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarberInfo;
