
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Service, Barber } from '@/types/booking';
import { validateBookingData } from '@/utils/bookingValidation';
import { isValidAmount, sanitizeInput } from '@/utils/securityHelpers';

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
    // Enhanced validation using security helpers
    const validationResult = validateBookingData({
      selectedService,
      selectedTime,
      userPhone,
      user
    });

    if (!validationResult.isValid) {
      toast({
        title: "Validation Error",
        description: validationResult.errors[0],
        variant: "destructive",
      });
      return;
    }

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

    // Validate payment amount
    if (!isValidAmount(selectedService.price * 100)) {
      toast({
        title: "Invalid Amount",
        description: "Service price is invalid",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);
    setPaymentLoading(true);
    
    try {
      console.log('BookingDialog: Starting secure payment process...');
      
      toast({
        title: "Creating Payment Session",
        description: "Setting up your secure checkout...",
      });

      // Sanitize inputs before sending
      const sanitizedData = {
        amount: selectedService.price * 100,
        currency: 'usd',
        serviceType: sanitizeInput(`barber_service_${barber.id}`),
        serviceName: sanitizeInput(selectedService.name),
        barberName: sanitizeInput(barber.name),
        appointmentTime: sanitizeInput(selectedTime),
        userPhone: userPhone ? sanitizeInput(userPhone) : ''
      };

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: sanitizedData
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
        console.log('BookingDialog: Opening payment URL in new window');
        // Enhanced security: validate URL before opening
        try {
          const url = new URL(data.url);
          if (url.hostname === 'checkout.stripe.com') {
            window.open(data.url, '_blank', 'noopener,noreferrer');
            
            toast({
              title: "Payment Opened",
              description: "Complete your payment in the new tab to confirm your booking",
            });
          } else {
            throw new Error('Invalid payment URL');
          }
        } catch (urlError) {
          console.error('Invalid payment URL:', urlError);
          toast({
            title: "Security Error",
            description: "Invalid payment URL received",
            variant: "destructive",
          });
        }
        
        setPaymentLoading(false);
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
