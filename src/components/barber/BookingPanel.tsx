
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star, DollarSign } from "lucide-react";
import SimpleBookingDialog from './SimpleBookingDialog';

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

interface BookingPanelProps {
  barber: Barber;
}

const BookingPanel = ({ barber }: BookingPanelProps) => {
  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0">
      <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl sticky top-4">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Book Appointment</h2>
            <div className="flex items-center justify-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{barber.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{barber.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{barber.price}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="font-semibold text-white mb-2">Quick Facts</h3>
              <ul className="space-y-1 text-sm text-white/80">
                <li>• {barber.experience} experience</li>
                <li>• Specialty: {barber.specialty}</li>
                <li>• Same day appointments</li>
                <li>• Premium products used</li>
              </ul>
            </div>
          </div>

          <SimpleBookingDialog barber={barber}>
            <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
              <Calendar className="w-5 h-5 mr-2" />
              Book Now
            </Button>
          </SimpleBookingDialog>

          <div className="text-center">
            <p className="text-xs text-white/60">
              💳 Secure payment • 📱 Instant confirmation
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPanel;
