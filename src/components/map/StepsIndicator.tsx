
import React from 'react';

interface StepsIndicatorProps {
  currentStep: number;
}

const StepsIndicator = ({ currentStep }: StepsIndicatorProps) => {
  const steps = [
    { number: 1, label: 'Find' },
    { number: 2, label: 'Select' },
    { number: 3, label: 'Book' }
  ];

  return (
    <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-sm rounded-2xl p-4 z-10 shadow-xl">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                step.number <= currentStep 
                  ? 'bg-white text-black' 
                  : 'bg-gray-600 text-gray-400'
              }`}>
                {step.number <= currentStep ? (step.number === currentStep ? step.number : '✓') : step.number}
              </div>
              <span className={`font-medium hidden sm:inline ${
                step.number <= currentStep ? 'text-white' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-gray-600"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepsIndicator;
