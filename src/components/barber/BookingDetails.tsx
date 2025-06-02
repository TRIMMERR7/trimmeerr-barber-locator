
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CreditCard, Clock, User, Loader2 } from "lucide-react";

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
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/[^\d]/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return phoneNumber;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setUserPhone(formatted);
  };

  return (
    <div className="space-y-6">
      {/* User Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-800">Booking For</span>
        </div>
        <p className="text-blue-700">{user?.email}</p>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Phone className="w-4 h-4" />
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="(555) 123-4567"
          value={userPhone}
          onChange={handlePhoneChange}
          className="w-full transition-all focus:ring-2 focus:ring-red-500 focus:border-red-500"
          maxLength={14}
        />
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>Optional - We'll send appointment confirmations</span>
        </p>
      </div>

      {/* Service Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-600" />
          Booking Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Service</span>
            <span className="font-semibold text-gray-900">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Duration</span>
            <span className="font-semibold text-gray-900">{selectedService?.duration}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Time</span>
            <span className="font-semibold text-gray-900">{selectedTime}</span>
          </div>
          <div className="flex justify-between items-center pt-3 text-lg">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-red-600 text-xl">${selectedService?.price}</span>
          </div>
        </div>
      </div>

      {/* Book & Pay Button */}
      <Button 
        onClick={onBookingAndPayment}
        disabled={!selectedService || !selectedTime || !user || isProcessingPayment}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isProcessingPayment ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : !user ? (
          'Sign In to Book'
        ) : (
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <span>Secure Checkout - ${selectedService?.price}</span>
          </div>
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <span>🔒</span>
          <span>Secure payment powered by Stripe</span>
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;
