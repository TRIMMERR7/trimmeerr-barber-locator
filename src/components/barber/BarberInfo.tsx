
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock } from "lucide-react";

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
}

interface BarberInfoProps {
  barber: Barber;
}

const BarberInfo = ({ barber }: BarberInfoProps) => {
  return (
    <Card className="bg-white/95 backdrop-blur-sm mb-6 shadow-xl border-0">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src={barber.image}
              alt={barber.name}
              className="w-24 h-24 rounded-3xl object-cover shadow-lg"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{barber.name}</h2>
            <p className="text-red-600 font-semibold text-lg mb-3">{barber.specialty}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-medium">{barber.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{barber.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{barber.experience}</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{barber.price}</div>
            <div className="text-sm text-gray-500 font-medium">30 minutes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarberInfo;
