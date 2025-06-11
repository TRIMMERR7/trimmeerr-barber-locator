
import React from 'react';
import { CheckCircle } from 'lucide-react';
import ServiceSelection from './ServiceSelection';
import RealTimeTimeSelection from './RealTimeTimeSelection';
import BookingDetails from './BookingDetails';
import BookingAnimations from './BookingAnimations';
import SuccessConfetti from './SuccessConfetti';
import type { Service, BookingStep } from '@/types/booking';

interface BookingStepContentProps {
  step: BookingStep;
  selectedService: Service | null;
  selectedTime: string;
  userPhone: string;
  user: any;
  isProcessingPayment: boolean;
  paymentUrl: string;
  paymentLoading: boolean;
  barberId: string; // Add barberId prop
  onServiceSelect: (service: Service) => void;
  onTimeSelect: (time: string) => void;
  setUserPhone: (phone: string) => void;
  onBookingAndPayment: () => void;
  onPaymentLoad: () => void;
  onPaymentComplete: () => void;
}

const BookingStepContent = ({
  step,
  selectedService,
  selectedTime,
  userPhone,
  user,
  isProcessingPayment,
  paymentUrl,
  paymentLoading,
  barberId,
  onServiceSelect,
  onTimeSelect,
  setUserPhone,
  onBookingAndPayment,
  onPaymentLoad,
  onPaymentComplete
}: BookingStepContentProps) => {
  const renderStepContent = () => {
    switch (step) {
      case 'service':
        return (
          <div className="overflow-y-auto max-h-[60vh]">
            <ServiceSelection 
              onServiceSelect={onServiceSelect}
              selectedService={selectedService}
            />
          </div>
        );

      case 'time':
        return (
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            {selectedService && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-red-800">Selected Service</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-800 font-medium">{selectedService.name}</span>
                    <p className="text-sm text-gray-600">{selectedService.duration}</p>
                  </div>
                  <span className="font-bold text-red-600 text-lg">${selectedService.price}</span>
                </div>
              </div>
            )}
            <RealTimeTimeSelection 
              selectedTime={selectedTime}
              onTimeSelect={onTimeSelect}
              barberId={barberId}
            />
          </div>
        );

      case 'details':
        return (
          <div className="overflow-y-auto max-h-[60vh]">
            <BookingDetails
              selectedService={selectedService}
              selectedTime={selectedTime}
              userPhone={userPhone}
              setUserPhone={setUserPhone}
              onBookingAndPayment={onBookingAndPayment}
              isProcessingPayment={isProcessingPayment}
              user={user}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full">
      <BookingAnimations step={step}>
        {renderStepContent()}
      </BookingAnimations>
      <SuccessConfetti show={false} />
    </div>
  );
};

export default BookingStepContent;
