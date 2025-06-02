
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CreditCard, Clock, User, Loader2, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';
import AnimatedButton from './AnimatedButton';

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
    const phoneNumber = value.replace(/[^\d]/g, '');
    
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
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* User Info */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-blue-800">Booking For</span>
        </div>
        <p className="text-blue-700 font-medium">{user?.email}</p>
      </motion.div>

      {/* Phone Number Input */}
      <motion.div 
        className="space-y-2"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
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
          className="w-full h-12 transition-all focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
          maxLength={14}
        />
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>📱 Optional - We'll send appointment confirmations</span>
        </p>
      </motion.div>

      {/* Service Summary */}
      <motion.div 
        className="bg-gradient-to-r from-gray-50 to-red-50 rounded-xl p-6 border border-gray-200 relative overflow-hidden"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full -mr-10 -mt-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-100 rounded-full -ml-8 -mb-8 opacity-50" />
        
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-600" />
          Booking Summary
        </h3>
        
        <div className="space-y-3 relative z-10">
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
          <motion.div 
            className="flex justify-between items-center pt-3 text-lg"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-red-600 text-2xl">${selectedService?.price}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Book & Pay Button */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatedButton 
          onClick={onBookingAndPayment}
          disabled={!selectedService || !selectedTime || !user || isProcessingPayment}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-16 text-lg font-semibold rounded-xl shadow-lg disabled:opacity-50 transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed relative overflow-hidden"
        >
          {isProcessingPayment ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating secure checkout...</span>
            </div>
          ) : !user ? (
            'Sign In to Book'
          ) : (
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <CreditCard className="w-5 h-5" />
              </motion.div>
              <span>Secure Checkout - ${selectedService?.price}</span>
              <Sparkles className="w-4 h-4" />
            </div>
          )}
          
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "linear",
              repeatDelay: 2 
            }}
          />
        </AnimatedButton>
      </motion.div>

      {/* Security Notice */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
          <span>🔒</span>
          <span>Secure payment powered by Stripe • Your data is protected</span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default BookingDetails;
