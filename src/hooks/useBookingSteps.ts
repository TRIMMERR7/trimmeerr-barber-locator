
import { useToast } from '@/hooks/use-toast';
import type { Service, BookingStep } from '@/types/booking';

interface UseBookingStepsProps {
  step: BookingStep;
  setStep: (step: BookingStep) => void;
  setSelectedService: (service: Service | null) => void;
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
    console.log('BookingDialog: Service selected:', service);
    setSelectedService(service);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    console.log('BookingDialog: Time selected:', time);
    setSelectedTime(time);
    setStep('details');
  };

  const handleStepBack = () => {
    console.log('BookingDialog: Going back from step:', step);
    if (step === 'time') {
      setStep('service');
    } else if (step === 'details') {
      setStep('time');
    }
  };

  const handlePaymentComplete = () => {
    console.log('BookingDialog: Payment completed');
    toast({
      title: "Booking Confirmed!",
      description: `Your appointment with ${barberName} has been booked successfully.`,
    });
    resetBooking();
    setIsOpen(false);
  };

  const handlePaymentLoad = () => {
    console.log('BookingDialog: Payment loaded');
  };

  const getStepTitle = () => {
    switch (step) {
      case 'service':
        return 'Choose Service';
      case 'time':
        return 'Select Time';
      case 'details':
        return 'Booking Details';
      default:
        return 'Book Appointment';
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    console.log('BookingDialog: Dialog open state changed:', open);
    setIsOpen(open);
    if (!open) {
      resetBooking();
    }
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
