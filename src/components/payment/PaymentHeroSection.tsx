
import React from 'react';

const PaymentHeroSection = () => {
  return (
    <div className="text-center py-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-scale-in">
        Premium Services
      </h1>
      <p className="text-xl text-gray-600 animate-fade-in leading-relaxed" style={{ animationDelay: '0.4s' }}>
        Enhance your barber experience with our premium features
      </p>
      <div className="mt-6 w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full animate-scale-in" style={{ animationDelay: '0.6s' }}></div>
    </div>
  );
};

export default PaymentHeroSection;
