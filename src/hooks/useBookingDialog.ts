
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface Barber {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  image: string;
  price: string;
  distance: string;
  experience: string;
  lat: number;
  lng: number;
}

export const useBookingDialog = (barber: Barber) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [step, setStep] = useState<'service' | 'time' | 'details' | 'payment'>('service');
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleBookingAndPayment = async () => {
    if (!selectedService || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a service and time slot",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book an appointment",
        variant: "destructive",
      });
      return;
    }

    if (userPhone && !validatePhoneNumber(userPhone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);
    setPaymentLoading(true);
    
    try {
      console.log('BookingDialog: Starting payment process...');
      
      toast({
        title: "Creating Payment Session",
        description: "Setting up your secure checkout...",
      });

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: selectedService.price * 100,
          currency: 'usd',
          serviceType: `barber_service_${barber.id}`,
          serviceName: selectedService.name,
          barberName: barber.name,
          appointmentTime: selectedTime,
          userPhone: userPhone
        }
      });

      console.log('BookingDialog: Payment response:', { data, error });

      if (error) {
        console.error('BookingDialog: Payment creation error:', error);
        toast({
          title: "Booking Error",
          description: "Failed to process booking. Please try again.",
          variant: "destructive",
        });
        setIsProcessingPayment(false);
        setPaymentLoading(false);
        return;
      }

      if (data?.url) {
        console.log('BookingDialog: Setting payment URL and moving to payment step');
        setPaymentUrl(data.url);
        setStep('payment');
        setPaymentLoading(false);
        
        toast({
          title: "Payment Ready",
          description: "Complete your secure payment below",
        });
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('BookingDialog: Unexpected payment error:', error);
      toast({
        title: "Booking Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
      setPaymentLoading(false);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedTime('');
    setUserPhone('');
    setPaymentUrl('');
    setPaymentLoading(false);
    setIsProcessingPayment(false);
    setStep('service');
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
      description: `Your ${selectedService?.name} appointment with ${barber.name} is confirmed for ${selectedTime}`,
      duration: 6000,
    });
  };

  const handlePaymentLoad = () => {
    console.log('BookingDialog: Payment iframe loaded');
    setPaymentLoading(false);
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
