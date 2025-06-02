
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, ArrowLeft, X } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BookingProgressBar from './BookingProgressBar';
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

interface BookingDialogProps {
  barber: Barber;
  children: React.ReactNode;
}

const BookingDialog = ({ barber, children }: BookingDialogProps) => {
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
        return;
      }

      if (data?.url) {
        console.log('BookingDialog: Setting payment URL for in-app display');
        setPaymentUrl(data.url);
        setStep('payment');
        
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
    setStep('service');
  };

  const handleStepBack = () => {
    if (step === 'time') setStep('service');
    if (step === 'details') setStep('time');
    if (step === 'payment') setStep('details');
  };

  const handlePaymentComplete = () => {
    setIsOpen(false);
    resetBooking();
    toast({
      title: "🎉 Booking Confirmed!",
      description: `Your ${selectedService?.name} appointment with ${barber.name} is confirmed for ${selectedTime}`,
      duration: 6000,
    });
  };

  const handlePaymentLoad = () => {
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      console.log('BookingDialog: Dialog open state changed:', open);
      setIsOpen(open);
      if (!open) resetBooking();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className={`${step === 'payment' ? 'sm:max-w-4xl max-w-[95vw]' : 'sm:max-w-lg max-w-[95vw]'} max-h-[95vh] overflow-hidden shadow-2xl border-0`}>
        <DialogHeader className="space-y-4 border-b border-gray-100 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step !== 'service' && (
                <button 
                  onClick={handleStepBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <span className="text-lg font-semibold">{getStepTitle()}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 hidden sm:block font-medium">
              {barber.name}
            </div>
          </DialogTitle>
          
          <BookingProgressBar step={step} />
        </DialogHeader>
        
        <div className={`flex-shrink-0 ${step === 'payment' ? 'max-h-[70vh]' : 'max-h-[60vh]'} overflow-y-auto`}>
          <BookingStepContent
            step={step}
            selectedService={selectedService}
            selectedTime={selectedTime}
            userPhone={userPhone}
            user={user}
            isProcessingPayment={isProcessingPayment}
            paymentUrl={paymentUrl}
            paymentLoading={paymentLoading}
            onServiceSelect={handleServiceSelect}
            onTimeSelect={handleTimeSelect}
            setUserPhone={setUserPhone}
            onBookingAndPayment={handleBookingAndPayment}
            onPaymentLoad={handlePaymentLoad}
            onPaymentComplete={handlePaymentComplete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
