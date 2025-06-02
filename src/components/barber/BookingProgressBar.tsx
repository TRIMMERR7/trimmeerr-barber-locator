
import React from 'react';

interface BookingProgressBarProps {
  step: 'service' | 'time' | 'details' | 'payment';
}

const BookingProgressBar = ({ step }: BookingProgressBarProps) => {
  const getProgressPercentage = () => {
    switch (step) {
      case 'service': return 25;
      case 'time': return 50;
      case 'details': return 75;
      case 'payment': return 100;
      default: return 0;
    }
  };

  if (step === 'payment') return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${getProgressPercentage()}%` }}
      />
    </div>
  );
};

export default BookingProgressBar;
