
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  userType: 'barber' | 'client' | 'guest';
}

const BarberProfile = ({ barber, onBack, userType }: BarberProfileProps) => {
  const [selectedTime, setSelectedTime] = useState<string>('');

  const availableTimes = ['9:00 AM', '10:30 AM', '12:00 PM', '2:30 PM', '4:00 PM', '6:00 PM'];

  const handleBooking = () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }
    
    if (userType === 'guest') {
      alert('Please sign in to book an appointment');
      return;
    }
    
    alert(`Appointment booked with ${barber.name} at ${selectedTime}!`);
  };

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 p-4 flex-shrink-0">
        <div className="flex items-center gap-4 max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </Button>
          <h1 className="text-xl font-semibold text-white">Book Appointment</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Profile Info - Left Side */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Steps Indicator */}
          <div className="bg-gray-900 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                <span className="text-white">Find</span>
              </div>
              <div className="w-8 h-px bg-white"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white text-black rounded-full flex items-center justify-center font-bold">2</div>
                <span className="text-white">Select</span>
              </div>
              <div className="w-8 h-px bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-600 text-gray-400 rounded-full flex items-center justify-center font-bold">3</div>
                <span className="text-gray-400">Book</span>
              </div>
            </div>
          </div>

          {/* Barber Info */}
          <Card className="bg-white mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black">{barber.name}</h2>
                  <p className="text-red-600 font-medium">{barber.specialty}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span>★ {barber.rating}</span>
                    <span>•</span>
                    <span>{barber.distance}</span>
                    <span>•</span>
                    <span>{barber.experience}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">{barber.price}</div>
                  <div className="text-sm text-gray-500">30 minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-black mb-4">Recent Work</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/photo-${1621605815971 + i}?w=200&h=200&fit=crop`}
                    alt={`Work ${i}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking - Right Side */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Select Time</h3>
          
          <div className="space-y-2 mb-6">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  selectedTime === time 
                    ? 'border-red-600 bg-red-50 text-red-600' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Service</span>
              <span>{barber.price}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>App Fee (3.5%)</span>
              <span>$1.23</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${(parseInt(barber.price.replace('$', '')) + 1.23).toFixed(2)}</span>
            </div>
          </div>

          <Button 
            onClick={handleBooking}
            disabled={!selectedTime}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {userType === 'guest' ? 'Sign In to Book' : 'Book Appointment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarberProfile;
