
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, ArrowLeft, X, CheckCircle, Loader2 } from "lucide-react";
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
        setPaymentLoading(true);
        setStep('payment');
        
        toast({
          title: "Payment Page Loading",
          description: `Preparing your checkout for ${selectedService.name}`,
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
      title: "Booking Confirmed!",
      description: "Your appointment has been successfully booked",
      duration: 5000,
    });
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

  const getProgressPercentage = () => {
    switch (step) {
      case 'service': return 25;
      case 'time': return 50;
      case 'details': return 75;
      case 'payment': return 100;
      default: return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetBooking();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className={`${step === 'payment' ? 'sm:max-w-5xl max-w-[95vw] h-[90vh]' : 'sm:max-w-lg'} max-h-[90vh] overflow-hidden`}>
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step !== 'service' && step !== 'payment' && (
                <button 
                  onClick={handleStepBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              {step === 'payment' && (
                <button 
                  onClick={handleStepBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <span className="text-lg font-semibold">{getStepTitle()}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 hidden sm:block">
              {barber.name}
            </div>
          </DialogTitle>
          
          {/* Progress Bar */}
          {step !== 'payment' && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-red-600 to-red-700 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          )}
        </DialogHeader>
        
        <div className={`space-y-6 ${step === 'payment' ? 'h-full' : ''}`}>
          {/* Step 1: Service Selection */}
          {step === 'service' && (
            <div className="animate-fade-in">
              <ServiceSelection 
                onServiceSelect={handleServiceSelect}
                selectedService={selectedService}
              />
            </div>
          )}

          {/* Step 2: Time Selection */}
          {step === 'time' && (
            <div className="animate-fade-in space-y-4">
              {selectedService && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">Selected Service</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{selectedService.name}</span>
                    <span className="font-bold text-red-600">${selectedService.price}</span>
                  </div>
                </div>
              )}
              <TimeSelection 
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelect}
              />
            </div>
          )}

          {/* Step 3: Final Details */}
          {step === 'details' && (
            <div className="animate-fade-in">
              <BookingDetails
                selectedService={selectedService}
                selectedTime={selectedTime}
                userPhone={userPhone}
                setUserPhone={setUserPhone}
                onBookingAndPayment={handleBookingAndPayment}
                isProcessingPayment={isProcessingPayment}
                user={user}
              />
            </div>
          )}

          {/* Step 4: Payment Page */}
          {step === 'payment' && (
            <div className="w-full h-full flex flex-col">
              {paymentLoading && (
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                    <span className="text-gray-600">Loading secure payment page...</span>
                  </div>
                </div>
              )}
              {paymentUrl && (
                <div className="flex-1 min-h-[500px]">
                  <iframe
                    src={paymentUrl}
                    className="w-full h-full border-0 rounded-lg shadow-lg"
                    title="Secure Payment Checkout"
                    onLoad={() => {
                      setPaymentLoading(false);
                      // Listen for payment completion
                      const handleMessage = (event: MessageEvent) => {
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
