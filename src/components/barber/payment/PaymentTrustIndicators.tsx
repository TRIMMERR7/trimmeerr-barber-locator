
import React from 'react';

const PaymentTrustIndicators = () => {
  return (
    <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <p>🔒 Your payment information is encrypted and secure</p>
      <p className="mt-1">Powered by Stripe • PCI DSS Compliant</p>
    </div>
  );
};

export default PaymentTrustIndicators;
