
import React from 'react';
import { Clock } from "lucide-react";

interface TimeSelectionProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeSelection = ({ selectedTime, onTimeSelect }: TimeSelectionProps) => {
  const availableTimes = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Available Today</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {availableTimes.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`p-3 text-center rounded-lg border-2 transition-all font-medium text-sm ${
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
  );
};

export default TimeSelection;
