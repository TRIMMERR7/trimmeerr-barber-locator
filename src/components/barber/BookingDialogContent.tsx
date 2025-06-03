
import React from 'react';
import BookingStepContent from './BookingStepContent';
import type { Service, BookingStep } from '@/types/booking';

interface BookingDialogContentProps {
  step: BookingStep;
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
  return (
    <div className="flex-1 overflow-hidden p-6">
      <BookingStepContent {...props} />
    </div>
  );
};

export default BookingDialogContent;
