
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';

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
  );
};

export default BookingPanel;
