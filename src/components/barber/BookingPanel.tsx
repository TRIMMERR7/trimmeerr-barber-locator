
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
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
  const availableTimes = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

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

  const totalPrice = (parseInt(barber.price.replace('$', '')) + 1.23).toFixed(2);

  return (
    <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200 p-6 flex-shrink-0 shadow-xl">
      {/* Quick Booking Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-red-600" />
        <h3 className="text-xl font-semibold text-gray-900">Quick Book</h3>
      </div>
      
      {/* Time Selection */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Available Today</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 text-center rounded-lg border-2 transition-all font-medium ${
                selectedTime === time 
                  ? 'border-red-600 bg-red-50 text-red-700' 
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Service</span>
          <span className="font-semibold">{barber.price}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold text-red-600">
          <span>Total</span>
          <span>${totalPrice}</span>
        </div>
      </div>

      {/* Book Button */}
      <Button 
        onClick={handleBooking}
        disabled={!selectedTime || !user}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50"
      >
        {!user ? 'Sign In to Book' : selectedTime ? `Book ${selectedTime}` : 'Select Time'}
      </Button>
    </div>
  );
};

export default BookingPanel;
