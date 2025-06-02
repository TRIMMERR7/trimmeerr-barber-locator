
import React from 'react';
import { CheckCircle, Loader2, CreditCard } from 'lucide-react';

interface PaymentStatusDisplayProps {
  paymentStatus: 'loading' | 'ready' | 'processing' | 'complete';
  paymentLoading: boolean;
}

const PaymentStatusDisplay = ({ paymentStatus, paymentLoading }: PaymentStatusDisplayProps) => {
  if (paymentStatus === 'complete') {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-800">Payment Successful!</h3>
            <p className="text-sm text-green-700">Redirecting you back...</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentLoading || paymentStatus === 'loading') {
    return (
      <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <div className="text-center">
            <p className="text-blue-800 font-medium">Loading secure payment...</p>
            <p className="text-sm text-blue-600">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentStatusDisplay;
