
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, CreditCard, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ServiceSelection from './ServiceSelection';

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
  const availableTimes = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

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
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: selectedService.price * 100, // Convert to cents
          currency: 'usd',
          serviceType: `barber_service_${barber.id}`,
          serviceName: selectedService.name,
          barberName: barber.name,
          appointmentTime: selectedTime,
          userPhone: userPhone
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Redirect to payment page
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
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Booking Error",
        description: "Failed to process booking. Please try again.",
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

  const currentPrice = selectedService ? selectedService.price : parseInt(barber.price.replace('$', ''));

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
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">
            {selectedService ? selectedService.name : 'Service Price'}
          </span>
          <span className="font-bold text-lg text-red-600">
            ${currentPrice}
          </span>
        </div>
      </div>

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
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Available Today</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`p-3 text-center rounded-lg border-2 transition-all font-medium text-sm ${
                        selectedTime === time 
                          ? 'border-red-600 bg-red-50 text-red-700' 
                          : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Final Details */}
            {step === 'details' && (
              <>
                {/* Phone Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4" />
                    Phone Number (for SMS confirmation)
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Optional - We'll send appointment confirmations</p>
                </div>

                {/* Service Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Service</span>
                    <span className="font-semibold">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Duration</span>
                    <span className="font-semibold">{selectedService?.duration}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 text-sm">Time</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold text-red-600 border-t pt-2">
                    <span>Total</span>
                    <span>${selectedService?.price}</span>
                  </div>
                </div>

                {/* Book & Pay Button */}
                <Button 
                  onClick={handleBookingAndPayment}
                  disabled={!selectedService || !selectedTime || !user || isProcessingPayment}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>Processing...</>
                  ) : !user ? (
                    'Sign In to Book'
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Book & Pay ${selectedService?.price}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingPanel;
