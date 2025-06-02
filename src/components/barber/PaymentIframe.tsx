
import React, { useEffect, useRef } from 'react';
import { Loader2, Shield, CreditCard } from 'lucide-react';

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
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Security Notice */}
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

      {/* Loading Indicator */}
      {paymentLoading && (
        <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="text-blue-800 font-medium">Loading secure payment...</p>
              <p className="text-sm text-blue-600">This may take a few seconds</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Frame */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white" style={{ minHeight: '600px' }}>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800">Secure Checkout</span>
            <div className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
              SSL Encrypted
            </div>
          </div>
        </div>
        
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
            height: 'calc(100% - 60px)',
            minHeight: '540px',
            display: 'block',
            border: 'none',
            backgroundColor: 'white'
          }}
        />
      </div>

      {/* Trust Indicators */}
      <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <p>🔒 Your payment information is encrypted and secure</p>
        <p className="mt-1">Powered by Stripe • PCI DSS Compliant</p>
      </div>
    </div>
  );
};

export default PaymentIframe;
