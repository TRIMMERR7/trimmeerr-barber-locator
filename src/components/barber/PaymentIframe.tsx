
import React, { useEffect, useRef } from 'react';
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    console.log('PaymentIframe: Component mounted', { paymentUrl, paymentLoading });
    
    // Listen for payment completion messages from Stripe
    const handleMessage = (event: MessageEvent) => {
      console.log('PaymentIframe: Received message', event);
      if (event.origin === 'https://checkout.stripe.com' || event.origin === 'https://js.stripe.com') {
        if (event.data.type === 'checkout.session.completed' || event.data === 'stripe_checkout_closed') {
          console.log('PaymentIframe: Payment completed or closed');
          onPaymentComplete();
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      console.log('PaymentIframe: Cleaning up message listener');
      window.removeEventListener('message', handleMessage);
    };
  }, [onPaymentComplete]);

  const handleIframeLoad = () => {
    console.log('PaymentIframe: Iframe loaded successfully');
    onPaymentLoad();
  };

  const handleIframeError = (error: any) => {
    console.error('PaymentIframe: Iframe error', error);
  };

  if (!paymentUrl) {
    console.log('PaymentIframe: No payment URL provided');
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600">No payment URL available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {paymentLoading && (
        <div className="flex items-center justify-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg mb-4 border border-red-100">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-red-600" />
            <span className="text-gray-700 font-medium">Loading secure payment page...</span>
          </div>
        </div>
      )}
      
      <div className="flex-1 rounded-lg overflow-hidden shadow-lg border border-gray-200" style={{ minHeight: '500px' }}>
        <iframe
          ref={iframeRef}
          src={paymentUrl}
          className="w-full h-full border-0"
          title="Secure Payment Checkout"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-top-navigation-by-user-activation allow-popups"
          allow="payment; camera; microphone"
          loading="eager"
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '500px',
            display: 'block',
            border: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default PaymentIframe;
