
import type { Service, BookingStep } from '@/types/booking';
import { useToast } from '@/hooks/use-toast';

interface UseBookingStepsProps {
  step: BookingStep;
  setStep: (step: BookingStep) => void;
  setSelectedService: (service: Service) => void;
  setSelectedTime: (time: string) => void;
  resetBooking: () => void;
  setIsOpen: (open: boolean) => void;
  selectedService: Service | null;
  barberName: string;
  selectedTime: string;
}

export const useBookingSteps = ({
  step,
  setStep,
  setSelectedService,
  setSelectedTime,
  resetBooking,
  setIsOpen,
  selectedService,
  barberName,
  selectedTime
}: UseBookingStepsProps) => {
  const { toast } = useToast();

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleStepBack = () => {
    if (step === 'time') setStep('service');
    if (step === 'details') setStep('time');
    if (step === 'payment') setStep('details');
  };

  const handlePaymentComplete = () => {
    console.log('BookingDialog: Payment completed, closing dialog');
    setIsOpen(false);
    resetBooking();
    toast({
      title: "🎉 Booking Confirmed!",
      description: `Your ${selectedService?.name} appointment with ${barberName} is confirmed for ${selectedTime}`,
      duration: 6000,
    });
  };

  const handlePaymentLoad = () => {
    console.log('BookingDialog: Payment iframe loaded');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'service': return 'Select Service';
      case 'time': return 'Choose Time';
      case 'details': return 'Booking Details';
      case 'payment': return 'Complete Payment';
      default: return 'Book Appointment';
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    console.log('BookingDialog: Dialog open state changed:', open);
    setIsOpen(open);
    if (!open) resetBooking();
  };

  return {
    handleServiceSelect,
    handleTimeSelect,
    handleStepBack,
    handlePaymentComplete,
    handlePaymentLoad,
    getStepTitle,
    handleDialogOpenChange
  };
};
