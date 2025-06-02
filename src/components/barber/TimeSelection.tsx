
import React from 'react';
import { Clock, Calendar, CheckCircle } from "lucide-react";

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
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Available Today</h3>
            <p className="text-sm text-blue-700">{getTodayDate()}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-600" />
          Select Your Preferred Time
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {availableTimes.map(({ time, available }) => (
            <button
              key={time}
              onClick={() => available && onTimeSelect(time)}
              disabled={!available}
              className={`p-4 text-center rounded-xl border-2 transition-all duration-200 font-medium relative ${
                selectedTime === time 
                  ? 'border-red-600 bg-red-50 text-red-700 shadow-lg ring-2 ring-red-200' 
                  : available
                  ? 'border-gray-300 hover:border-red-300 hover:bg-red-25 hover:shadow-md bg-white text-gray-700' 
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">{time}</span>
              </div>
              
              {selectedTime === time && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-red-600 rounded-full p-1">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              
              {!available && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-90 rounded-xl">
                  <span className="text-xs text-gray-600 font-medium bg-white px-2 py-1 rounded shadow-sm">
                    Booked
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Need a different time?</span>
          </p>
          <p className="text-xs text-gray-500">
            Call the barber directly for more options or to reschedule.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
