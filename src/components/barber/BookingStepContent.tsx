
import React from 'react';
import { CheckCircle } from 'lucide-react';
import ServiceSelection from './ServiceSelection';
import TimeSelection from './TimeSelection';
import BookingDetails from './BookingDetails';
import PaymentIframe from './PaymentIframe';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface BookingStepContentProps {
  step: 'service' | 'time' | 'details' | 'payment';
  selectedService: Service | null;
  selectedTime: string;
  userPhone: string;
  user: any;
  isProcessingPayment: boolean;
  paymentUrl: string;
  paymentLoading: boolean;
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
          <div className="animate-fade-in overflow-y-auto max-h-[60vh]">
            <ServiceSelection 
              onServiceSelect={onServiceSelect}
              selectedService={selectedService}
            />
          </div>
        );

      case 'time':
        return (
          <div className="animate-fade-in space-y-4 overflow-y-auto max-h-[60vh]">
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
            <TimeSelection 
              selectedTime={selectedTime}
              onTimeSelect={onTimeSelect}
            />
          </div>
        );

      case 'details':
        return (
          <div className="animate-fade-in overflow-y-auto max-h-[60vh]">
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

      case 'payment':
        console.log('BookingStepContent: Rendering payment step', { paymentUrl, paymentLoading });
        return (
          <div className="h-full w-full">
            <PaymentIframe
              paymentUrl={paymentUrl}
              paymentLoading={paymentLoading}
              onPaymentLoad={onPaymentLoad}
              onPaymentComplete={onPaymentComplete}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full">
      {renderStepContent()}
    </div>
  );
};

export default BookingStepContent;
