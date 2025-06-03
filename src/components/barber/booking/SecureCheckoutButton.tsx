
import React from 'react';
import { CreditCard, Loader2, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';
import AnimatedButton from '../AnimatedButton';
import type { Service } from '@/types/booking';

interface SecureCheckoutButtonProps {
  selectedService: Service | null;
  selectedTime: string;
  user: any;
  isProcessingPayment: boolean;
  onBookingAndPayment: () => void;
}

const SecureCheckoutButton = ({
  selectedService,
  selectedTime,
  user,
  isProcessingPayment,
  onBookingAndPayment
}: SecureCheckoutButtonProps) => {
  return (
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
  );
};

export default SecureCheckoutButton;
