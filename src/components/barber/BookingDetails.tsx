
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CreditCard } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface BookingDetailsProps {
  selectedService: Service | null;
  selectedTime: string;
  userPhone: string;
  setUserPhone: (phone: string) => void;
  onBookingAndPayment: () => void;
  isProcessingPayment: boolean;
  user: any;
}

const BookingDetails = ({ 
  selectedService, 
  selectedTime, 
  userPhone, 
  setUserPhone, 
  onBookingAndPayment, 
  isProcessingPayment, 
  user 
}: BookingDetailsProps) => {
  return (
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
        onClick={onBookingAndPayment}
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
  );
};

export default BookingDetails;
