
import React, { useRef } from 'react';
import { CreditCard } from 'lucide-react';

interface PaymentIframeContainerProps {
  paymentUrl: string;
  onIframeRef: (ref: HTMLIFrameElement | null) => void;
}

const PaymentIframeContainer = ({ paymentUrl, onIframeRef }: PaymentIframeContainerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRef = (ref: HTMLIFrameElement | null) => {
    iframeRef.current = ref;
    onIframeRef(ref);
  };

  return (
    <div className="w-full h-full flex flex-col rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-800">Secure Checkout</span>
          <div className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
            SSL Encrypted
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative min-h-0">
        <iframe
          ref={handleRef}
          src={paymentUrl}
          className="absolute inset-0 w-full h-full border-0"
          title="Secure Payment Checkout"
          sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-top-navigation-by-user-activation allow-popups allow-popups-to-escape-sandbox"
          allow="payment; camera; microphone"
          style={{ 
            border: 'none',
            backgroundColor: 'white',
            minHeight: '500px'
          }}
          onLoad={() => {
            console.log('PaymentIframe: Iframe loaded successfully');
          }}
        />
      </div>
    </div>
  );
};

export default PaymentIframeContainer;
