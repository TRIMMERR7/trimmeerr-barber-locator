
import React from 'react';

const PaymentAnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-red-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-red-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};

export default PaymentAnimatedBackground;
