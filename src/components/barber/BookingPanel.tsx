
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, CreditCard } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface BookingPanelProps {
  barber: Barber;
}

const BookingPanel = ({ barber }: BookingPanelProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const availableTimes = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  const handleBookingAndPayment = async () => {
    if (!selectedTime) {
      alert('Please select a time slot');
      return;
    }
    
    if (!user) {
      alert('Please sign in to book an appointment');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      // Convert price string to amount in cents (e.g., "$35" -> 3500)
      const priceAmount = parseInt(barber.price.replace('$', '')) * 100;
      
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: priceAmount,
          currency: 'usd',
          serviceType: `barber_service_${barber.id}`,
          barberName: barber.name,
          appointmentTime: selectedTime
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open payment in new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to Payment",
          description: `Complete payment for your ${selectedTime} appointment with ${barber.name}`,
        });
        
        setIsOpen(false);
        setSelectedTime('');
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

  const totalPrice = parseFloat(barber.price.replace('$', '')).toFixed(2);

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
          <span className="text-gray-600 text-sm">Service Price</span>
          <span className="font-bold text-lg text-red-600">{barber.price}</span>
        </div>
      </div>

      {/* Book Now Button with Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-lg font-semibold rounded-xl shadow-lg"
          >
            Book Now
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              Book with {barber.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Time Selection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Available Today</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
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

            {/* Service Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Service</span>
                <span className="font-semibold">{barber.specialty}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 text-sm">Time</span>
                <span className="font-semibold">{selectedTime || 'Select time'}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-red-600 border-t pt-2">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {/* Book & Pay Button */}
            <Button 
              onClick={handleBookingAndPayment}
              disabled={!selectedTime || !user || isProcessingPayment}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>Processing...</>
              ) : !user ? (
                'Sign In to Book'
              ) : selectedTime ? (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Book & Pay ${totalPrice}
                </>
              ) : (
                'Select Time'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingPanel;
