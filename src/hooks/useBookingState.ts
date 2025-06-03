
import { useState } from 'react';
import type { Service, BookingStep } from '@/types/booking';

export const useBookingState = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<BookingStep>('service');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedTime('');
    setUserPhone('');
    setPaymentUrl('');
    setPaymentLoading(false);
    setStep('service');
  };

  return {
    selectedService,
    setSelectedService,
    selectedTime,
    setSelectedTime,
    userPhone,
    setUserPhone,
    isOpen,
    setIsOpen,
    step,
    setStep,
    paymentUrl,
    setPaymentUrl,
    paymentLoading,
    setPaymentLoading,
    resetBooking
  };
};
