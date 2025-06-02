
import React from 'react';
import BookingStepContent from './BookingStepContent';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface BookingDialogContentProps {
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

const BookingDialogContent = (props: BookingDialogContentProps) => {
  const { step } = props;
  
  return (
    <div className={`flex-1 overflow-hidden ${step !== 'payment' ? 'p-6' : ''}`}>
      <BookingStepContent {...props} />
    </div>
  );
};

export default BookingDialogContent;
