
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingAnimationsProps {
  children: React.ReactNode;
  step: 'service' | 'time' | 'details' | 'payment';
}

const BookingAnimations = ({ children, step }: BookingAnimationsProps) => {
  const stepVariants = {
    initial: { opacity: 0, x: 50, scale: 0.95 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingAnimations;
