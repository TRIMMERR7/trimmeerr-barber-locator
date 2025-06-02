
import React from 'react';
import { Loader2 } from 'lucide-react';

interface PaymentIframeProps {
  paymentUrl: string;
  paymentLoading: boolean;
  onPaymentLoad: () => void;
  onPaymentComplete: () => void;
}

const PaymentIframe = ({ 
  paymentUrl, 
  paymentLoading, 
  onPaymentLoad, 
  onPaymentComplete 
}: PaymentIframeProps) => {
  const handleIframeLoad = () => {
    onPaymentLoad();
    
    // Listen for payment completion
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'https://checkout.stripe.com') {
        if (event.data.type === 'checkout.session.completed') {
          onPaymentComplete();
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {paymentLoading && (
        <div className="flex items-center justify-center p-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg mb-4 border border-red-100">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <span className="text-gray-700 font-medium">Loading secure payment page...</span>
          </div>
        </div>
      )}
      
      {paymentUrl && (
        <div className="flex-1 min-h-[500px] rounded-lg overflow-hidden shadow-2xl border border-gray-200">
          <iframe
            src={paymentUrl}
            className="w-full h-full border-0"
            title="Secure Payment Checkout"
            onLoad={handleIframeLoad}
            sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
          />
        </div>
      )}
    </div>
  );
};

export default PaymentIframe;
