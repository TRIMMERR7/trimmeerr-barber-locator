
import React from 'react';
import { Clock, Calendar } from "lucide-react";

interface TimeSelectionProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeSelection = ({ selectedTime, onTimeSelect }: TimeSelectionProps) => {
  const availableTimes = [
    { time: '9:00 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '1:00 PM', available: false },
    { time: '3:00 PM', available: true },
    { time: '5:00 PM', available: true },
    { time: '7:00 PM', available: true }
  ];

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-red-600" />
        <div>
          <span className="text-lg font-semibold text-gray-900">Available Today</span>
          <p className="text-sm text-gray-600">{getTodayDate()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {availableTimes.map(({ time, available }) => (
          <button
            key={time}
            onClick={() => available && onTimeSelect(time)}
            disabled={!available}
            className={`p-4 text-center rounded-xl border-2 transition-all duration-200 font-medium relative ${
              selectedTime === time 
                ? 'border-red-600 bg-red-50 text-red-700 shadow-md scale-105' 
                : available
                ? 'border-gray-200 hover:border-red-300 hover:bg-red-25 hover:shadow-sm bg-white' 
                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{time}</span>
            </div>
            {!available && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-xl">
                <span className="text-xs text-gray-500 font-medium">Booked</span>
              </div>
            )}
            {selectedTime === time && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Need a different time? Call the barber directly for more options.
        </p>
      </div>
    </div>
  );
};

export default TimeSelection;
