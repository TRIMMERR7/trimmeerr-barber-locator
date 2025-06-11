
import React from 'react';
import { Clock, Calendar, CheckCircle, X, Loader2 } from "lucide-react";
import { useRealTimeAvailability } from '@/hooks/useRealTimeAvailability';

interface RealTimeTimeSelectionProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  barberId: string;
  selectedDate?: string;
}

const RealTimeTimeSelection = ({ 
  selectedTime, 
  onTimeSelect, 
  barberId, 
  selectedDate = new Date().toISOString().split('T')[0] 
}: RealTimeTimeSelectionProps) => {
  const { availability, loading } = useRealTimeAvailability(barberId, selectedDate);

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-red-600" />
        <span className="ml-2 text-gray-600">Loading availability...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-full">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Available Today</h3>
            <p className="text-sm text-blue-700">{getTodayDate()}</p>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-red-600" />
          <h4 className="text-lg font-semibold text-gray-900">Select Your Preferred Time</h4>
          <div className="ml-auto bg-green-100 px-2 py-1 rounded-full">
            <span className="text-xs text-green-700 font-medium">🔴 Live Updates</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availability.map(({ time, available }) => (
            <button
              key={time}
              onClick={() => available && onTimeSelect(time)}
              disabled={!available}
              className={`group relative p-5 text-center rounded-xl border-2 transition-all duration-300 font-medium transform hover:scale-105 ${
                selectedTime === time 
                  ? 'border-red-500 bg-red-50 text-red-700 shadow-xl ring-4 ring-red-200 scale-105' 
                  : available
                  ? 'border-gray-300 hover:border-red-400 hover:bg-red-25 hover:shadow-lg bg-white text-gray-700 shadow-sm' 
                  : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-full ${
                  selectedTime === time 
                    ? 'bg-red-100' 
                    : available 
                    ? 'bg-gray-100 group-hover:bg-red-100' 
                    : 'bg-gray-200'
                }`}>
                  <Clock className={`w-5 h-5 ${
                    selectedTime === time 
                      ? 'text-red-600' 
                      : available 
                      ? 'text-gray-600 group-hover:text-red-600' 
                      : 'text-gray-400'
                  }`} />
                </div>
                
                <div>
                  <span className="text-lg font-bold">{time}</span>
                  <p className={`text-sm mt-1 ${
                    selectedTime === time 
                      ? 'text-red-600' 
                      : available 
                      ? 'text-gray-500' 
                      : 'text-gray-400'
                  }`}>
                    {available ? 'Available' : 'Booked'}
                  </p>
                </div>
              </div>
              
              {selectedTime === time && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-red-600 rounded-full p-1.5 shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              {!available && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-gray-500 rounded-full p-1.5 shadow-lg">
                    <X className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-semibold text-gray-800">Real-time availability</span>
          </div>
          <p className="text-sm text-gray-600">
            Availability updates automatically when other clients book appointments.
          </p>
          <div className="mt-3 text-xs text-gray-500 bg-white rounded-lg p-2 border">
            🔄 Updates in real-time • 📱 Instant notifications to barber
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTimeSelection;
