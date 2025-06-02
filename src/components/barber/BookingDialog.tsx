
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, ArrowLeft, X } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ServiceSelection from './ServiceSelection';
import TimeSelection from './TimeSelection';
import BookingDetails from './BookingDetails';

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

    setIsProcessingPayment(true);
    
    try {
      console.log('Starting payment process...');
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

      console.log('Payment response:', { data, error });

      if (error) {
        console.error('Payment creation error:', error);
        let errorMessage = "Failed to process booking. Please try again.";
        
        if (error.message.includes('Invalid Stripe secret key')) {
          errorMessage = "Payment system configuration error. Please contact support.";
        } else if (error.message.includes('authentication')) {
          errorMessage = "Authentication error. Please sign in again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Booking Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        console.log('Loading payment page in app:', data.url);
        setPaymentUrl(data.url);
        setStep('payment');
        
        toast({
          title: "Payment Page Loaded",
          description: `Complete your payment for ${selectedTime} ${selectedService.name} with ${barber.name}`,
        });
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error) {
      console.error('Unexpected payment error:', error);
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
    setStep('service');
  };

  const handleStepBack = () => {
    if (step === 'time') setStep('service');
    if (step === 'details') setStep('time');
    if (step === 'payment') setStep('details');
  };

  const handlePaymentComplete = () => {
    // This would be called when payment is successful
    // You might want to listen for postMessage events from the iframe
    setIsOpen(false);
    resetBooking();
    toast({
      title: "Booking Confirmed!",
      description: "Your appointment has been successfully booked",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetBooking();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className={`${step === 'payment' ? 'sm:max-w-4xl max-w-[95vw] h-[90vh]' : 'sm:max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== 'service' && step !== 'payment' && (
              <button 
                onClick={handleStepBack}
                className="p-1 h-auto hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            {step === 'payment' && (
              <button 
                onClick={handleStepBack}
                className="p-1 h-auto hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Calendar className="w-5 h-5 text-red-600" />
            {step === 'payment' ? 'Complete Payment' : `Book with ${barber.name}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Step 1: Service Selection */}
          {step === 'service' && (
            <ServiceSelection 
              onServiceSelect={handleServiceSelect}
              selectedService={selectedService}
            />
          )}

          {/* Step 2: Time Selection */}
          {step === 'time' && (
            <TimeSelection 
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
            />
          )}

          {/* Step 3: Final Details */}
          {step === 'details' && (
            <BookingDetails
              selectedService={selectedService}
              selectedTime={selectedTime}
              userPhone={userPhone}
              setUserPhone={setUserPhone}
              onBookingAndPayment={handleBookingAndPayment}
              isProcessingPayment={isProcessingPayment}
              user={user}
            />
          )}

          {/* Step 4: Payment Page */}
          {step === 'payment' && paymentUrl && (
            <div className="w-full h-[70vh]">
              <iframe
                src={paymentUrl}
                className="w-full h-full border-0 rounded-lg"
                title="Stripe Checkout"
                onLoad={() => {
                  // Listen for payment completion
                  const handleMessage = (event: MessageEvent) => {
                    // Stripe sends messages when payment is complete
                    if (event.origin === 'https://checkout.stripe.com') {
                      if (event.data.type === 'checkout.session.completed') {
                        handlePaymentComplete();
                      }
                    }
                  };
                  window.addEventListener('message', handleMessage);
                  return () => window.removeEventListener('message', handleMessage);
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
