
import { useAuth } from '@/contexts/AuthContext';
import { useBookingState } from '@/hooks/useBookingState';
import { usePaymentProcessing } from '@/hooks/usePaymentProcessing';
import { useBookingSteps } from '@/hooks/useBookingSteps';
import type { Barber } from '@/types/booking';

export const useBookingDialog = (barber: Barber) => {
  const { user } = useAuth();
  
  const {
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
  } = useBookingState();

  const { isProcessingPayment, handleBookingAndPayment } = usePaymentProcessing({
    selectedService,
    selectedTime,
    userPhone,
    user,
    barber,
    setPaymentUrl,
    setStep,
    setPaymentLoading
  });

  const {
    handleServiceSelect,
    handleTimeSelect,
    handleStepBack,
    handlePaymentComplete,
    handlePaymentLoad,
    getStepTitle,
    handleDialogOpenChange
  } = useBookingSteps({
    step,
    setStep,
    setSelectedService,
    setSelectedTime,
    resetBooking,
    setIsOpen,
    selectedService,
    barberName: barber.name,
    selectedTime
  });

  return {
    selectedService,
    selectedTime,
    userPhone,
    isOpen,
    isProcessingPayment,
    step,
    paymentUrl,
    paymentLoading,
    user,
    handleServiceSelect,
    handleTimeSelect,
    setUserPhone,
    handleBookingAndPayment,
    handleStepBack,
    handlePaymentComplete,
    handlePaymentLoad,
    getStepTitle,
    handleDialogOpenChange,
    setIsOpen
  };
};
