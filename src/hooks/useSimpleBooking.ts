
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validatePhoneNumber } from '@/utils/bookingValidation';
import type { Service, Barber } from '@/types/booking';

export const useSimpleBooking = (barber: Barber) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const availableTimes = [
    '9:00 AM', '11:00 AM', '1:00 PM', 
    '3:00 PM', '5:00 PM', '7:00 PM'
  ];

  const services: Service[] = [
    {
      id: 'classic-cut',
      name: 'Classic Haircut',
      price: 30,
      duration: '30 min',
      icon: () => null,
      popular: false,
      description: 'Traditional haircut with scissor and clipper work'
    },
    {
      id: 'fade-cut',
      name: 'Fade Cut',
      price: 35,
      duration: '35 min',
      icon: () => null,
      popular: true,
      description: 'Modern fade with precise blending and styling'
    },
    {
      id: 'beard-trim',
      name: 'Beard Trim',
      price: 20,
      duration: '20 min',
      icon: () => null,
      popular: false,
      description: 'Professional beard shaping and trimming'
    },
    {
      id: 'premium-package',
      name: 'Premium Package',
      price: 60,
      duration: '60 min',
      icon: () => null,
      popular: true,
      description: 'Haircut + beard trim + hot towel treatment'
    }
  ];

  const handleBooking = async () => {
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

    setIsProcessing(true);
    
    try {
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

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open payment in new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Payment Opened",
          description: "Complete your payment in the new tab to confirm your booking",
        });
        
        // Close dialog after opening payment
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
        }, 1000);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Error",
        description: "Failed to process booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedService(null);
    setSelectedTime('');
    setUserPhone('');
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return {
    isOpen,
    selectedService,
    selectedTime,
    userPhone,
    isProcessing,
    services,
    availableTimes,
    user,
    setSelectedService,
    setSelectedTime,
    setUserPhone,
    handleBooking,
    handleDialogChange
  };
};
