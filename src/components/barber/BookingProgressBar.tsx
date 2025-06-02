
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface BookingProgressBarProps {
  step: 'service' | 'time' | 'details' | 'payment';
}

const BookingProgressBar = ({ step }: BookingProgressBarProps) => {
  const steps = [
    { key: 'service', label: 'Service', number: 1 },
    { key: 'time', label: 'Time', number: 2 },
    { key: 'details', label: 'Details', number: 3 },
    { key: 'payment', label: 'Payment', number: 4 }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.key === step);
  };

  const currentStepIndex = getCurrentStepIndex();

  if (step === 'payment') return null;

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto">
      {steps.slice(0, -1).map((stepItem, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        
        return (
          <React.Fragment key={stepItem.key}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted ? '#dc2626' : isCurrent ? '#dc2626' : '#e5e7eb'
                }}
                transition={{ duration: 0.3 }}
                className="relative w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <span className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-gray-600'}`}>
                    {stepItem.number}
                  </span>
                )}
              </motion.div>
              <span className={`text-xs mt-1 font-medium ${isCurrent ? 'text-red-600' : 'text-gray-500'}`}>
                {stepItem.label}
              </span>
            </div>
            
            {index < steps.length - 2 && (
              <div className="flex-1 mx-2">
                <div className="h-0.5 bg-gray-200 relative overflow-hidden rounded">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: isCompleted ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full bg-red-600 absolute left-0 top-0"
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BookingProgressBar;
