
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Service, Barber } from '@/types/booking';
import { validatePhoneNumber } from '@/utils/bookingValidation';

interface UsePaymentProcessingProps {
  selectedService: Service | null;
  selectedTime: string;
  userPhone: string;
  user: any;
  barber: Barber;
  setPaymentUrl: (url: string) => void;
  setStep: (step: 'service' | 'time' | 'details' | 'payment') => void;
  setPaymentLoading: (loading: boolean) => void;
}

export const usePaymentProcessing = ({
  selectedService,
  selectedTime,
  userPhone,
  user,
  barber,
  setPaymentUrl,
  setStep,
  setPaymentLoading
}: UsePaymentProcessingProps) => {
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  return {
    isProcessingPayment,
    handleBookingAndPayment
  };
};
