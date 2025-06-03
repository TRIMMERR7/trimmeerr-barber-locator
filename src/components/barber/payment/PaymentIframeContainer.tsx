
import React, { useEffect, useRef } from 'react';
import { createSecurePostMessageHandler } from '@/utils/securityHelpers';

interface PaymentIframeContainerProps {
  paymentUrl: string;
  onPaymentComplete: () => void;
  onPaymentLoad: () => void;
}

const PaymentIframeContainer = ({ 
  paymentUrl, 
  onPaymentComplete, 
  onPaymentLoad 
}: PaymentIframeContainerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Enhanced security for postMessage handling
    const allowedOrigins = [
      'https://checkout.stripe.com',
      'https://js.stripe.com'
    ];

    const secureMessageHandler = createSecurePostMessageHandler(allowedOrigins);

    const handleMessage = (event: MessageEvent) => {
      const validatedData = secureMessageHandler(event);
      
      if (!validatedData) return;

      console.log('PaymentIframe: Received validated message:', validatedData);

      // Handle specific payment events
      if (validatedData.type === 'payment_success' || validatedData.event === 'checkout.session.completed') {
        console.log('PaymentIframe: Payment completed successfully');
        onPaymentComplete();
      }

      if (validatedData.type === 'payment_loaded' || validatedData.event === 'checkout.session.loaded') {
        console.log('PaymentIframe: Payment form loaded');
        onPaymentLoad();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onPaymentComplete, onPaymentLoad]);

  // Enhanced iframe security
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        src={paymentUrl}
        className="w-full h-full border-0"
        title="Secure Payment"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
        onLoad={() => {
          console.log('PaymentIframe: Iframe loaded successfully');
          onPaymentLoad();
        }}
        onError={(e) => {
          console.error('PaymentIframe: Failed to load payment form', e);
        }}
      />
    </div>
  );
};

export default PaymentIframeContainer;
