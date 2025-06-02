
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Star, MapPin, Clock, Phone, Calendar } from "lucide-react";

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

interface BarberProfileProps {
  barber: Barber;
  onBack: () => void;
  userType: 'barber' | 'client';
}

const BarberProfile = ({ barber, onBack, userType }: BarberProfileProps) => {
  const { user } = useAuth();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const availableTimes = ['9:00 AM', '10:30 AM', '12:00 PM', '2:30 PM', '4:00 PM', '6:00 PM'];

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }
    
    if (!user) {
      alert('Please sign in to book an appointment');
      return;
    }
    
    alert(`Appointment booked with ${barber.name} at ${selectedTime}!`);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4 flex-shrink-0">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold text-white">Book Appointment</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Profile Info */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Steps Indicator */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">✓</div>
                <span className="text-white font-medium hidden sm:inline">Find</span>
              </div>
              <div className="w-8 h-px bg-white"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <span className="text-white font-medium hidden sm:inline">Select</span>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-600 text-gray-400 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <span className="text-gray-400 hidden sm:inline">Book</span>
              </div>
            </div>
          </div>

          {/* Barber Info */}
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

          {/* Services & Info */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Services</h3>
                <div className="space-y-2">
                  {['Haircut', 'Beard Trim', 'Hot Towel', 'Styling'].map((service) => (
                    <div key={service} className="flex items-center justify-between py-2">
                      <span className="text-gray-700">{service}</span>
                      <span className="text-red-600 font-semibold">✓</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Downtown Barbershop</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">9 AM - 7 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Work</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="relative group cursor-pointer">
                    <img
                      src={`https://images.unsplash.com/photo-${1621605815971 + i}?w=200&h=200&fit=crop`}
                      alt={`Work ${i}`}
                      className="w-full h-20 sm:h-24 object-cover rounded-xl group-hover:scale-105 transition-transform shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-xl transition-colors"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Section */}
        <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200 p-6 flex-shrink-0 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900">Select Time</h3>
          </div>
          
          <div className="space-y-3 mb-8">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all touch-manipulation font-medium ${
                  selectedTime === time 
                    ? 'border-red-600 bg-red-50 text-red-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{time}</span>
                  {selectedTime === time && (
                    <span className="text-red-600">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-semibold">{barber.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">App Fee (3.5%)</span>
                <span className="font-semibold">$1.23</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-red-600">${(parseInt(barber.price.replace('$', '')) + 1.23).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleBooking}
            disabled={!selectedTime || !user}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-semibold rounded-xl touch-manipulation shadow-lg disabled:opacity-50"
          >
            {!user ? 'Sign In Required' : 'Book Appointment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;
