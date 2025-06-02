
import React from 'react';
import { Shield } from 'lucide-react';

const PaymentSecurityNotice = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-full">
          <Shield className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-green-800">Secure Payment</h3>
          <p className="text-sm text-green-700">Your payment is processed securely by Stripe</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSecurityNotice;
