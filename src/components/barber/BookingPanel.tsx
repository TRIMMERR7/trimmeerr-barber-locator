
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, ArrowLeft } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ServiceSelection from './ServiceSelection';
import TimeSelection from './TimeSelection';
import BookingDetails from './BookingDetails';
import PriceDisplay from './PriceDisplay';

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

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface BookingPanelProps {
  barber: Barber;
}

const BookingPanel = ({ barber }: BookingPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [step, setStep] = useState<'service' | 'time' | 'details'>('service');

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
        
        // More specific error messages
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
        console.log('Redirecting to payment URL:', data.url);
        window.location.href = data.url;
        
        toast({
          title: "Redirecting to Payment",
          description: `Complete payment for your ${selectedTime} ${selectedService.name} with ${barber.name}`,
        });
        
        setIsOpen(false);
        setSelectedService(null);
        setSelectedTime('');
        setUserPhone('');
        setStep('service');
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
    setStep('service');
  };

  return (
    <div className="w-full lg:w-96 bg-white/95 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200 p-4 lg:p-6 flex-shrink-0 shadow-xl">
      {/* Quick Info */}
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-5 h-5 text-red-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Book Appointment</h3>
          <p className="text-sm text-gray-600">with {barber.name}</p>
        </div>
      </div>
      
      {/* Price Display */}
      <PriceDisplay selectedService={selectedService} barber={barber} />

      {/* Book Now Button with Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetBooking();
      }}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-lg font-semibold rounded-xl shadow-lg"
          >
            Book Now
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {step !== 'service' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    if (step === 'time') setStep('service');
                    if (step === 'details') setStep('time');
                  }}
                  className="p-1 h-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <Calendar className="w-5 h-5 text-red-600" />
              Book with {barber.name}
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingPanel;
