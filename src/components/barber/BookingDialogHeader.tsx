
import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ArrowLeft } from "lucide-react";
import BookingProgressBar from './BookingProgressBar';

interface BookingDialogHeaderProps {
  step: 'service' | 'time' | 'details' | 'payment';
  barberName: string;
  stepTitle: string;
  onStepBack: () => void;
}

const BookingDialogHeader = ({ 
  step, 
  barberName, 
  stepTitle, 
  onStepBack 
}: BookingDialogHeaderProps) => {
  return (
    <DialogHeader className="space-y-4 border-b border-gray-100 p-6 flex-shrink-0">
      <DialogTitle className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step !== 'service' && (
            <button 
              onClick={onStepBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-600" />
            <span className="text-lg font-semibold">{stepTitle}</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 hidden sm:block font-medium">
          {barberName}
        </div>
      </DialogTitle>
      
      <BookingProgressBar step={step} />
    </DialogHeader>
  );
};

export default BookingDialogHeader;
