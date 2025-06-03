
import React from 'react';
import { Clock } from "lucide-react";
import { motion } from 'framer-motion';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  popular: boolean;
  description: string;
}

interface BookingSummaryCardProps {
  selectedService: Service | null;
  selectedTime: string;
}

const BookingSummaryCard = ({ selectedService, selectedTime }: BookingSummaryCardProps) => {
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-2xl rounded-xl p-6 border border-white/20 relative overflow-hidden shadow-lg"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/20 rounded-full -mr-10 -mt-10 opacity-50" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500/20 rounded-full -ml-8 -mb-8 opacity-50" />
      
      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-red-400" />
        Booking Summary
      </h3>
      
      <div className="space-y-3 relative z-10">
        <div className="flex justify-between items-center py-2 border-b border-white/20">
          <span className="text-white/70">Service</span>
          <span className="font-semibold text-white">{selectedService?.name}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/20">
          <span className="text-white/70">Duration</span>
          <span className="font-semibold text-white">{selectedService?.duration}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/20">
          <span className="text-white/70">Time</span>
          <span className="font-semibold text-white">{selectedTime}</span>
        </div>
        <motion.div 
          className="flex justify-between items-center pt-3 text-lg"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="font-bold text-white">Total</span>
          <span className="font-bold text-red-400 text-2xl">${selectedService?.price}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookingSummaryCard;
