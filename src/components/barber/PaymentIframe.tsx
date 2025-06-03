
import React, { useState, useRef, useEffect } from 'react';
import { usePaymentMessageHandler } from '@/hooks/usePaymentMessageHandler';
import PaymentSecurityNotice from './payment/PaymentSecurityNotice';
import PaymentStatusDisplay from './payment/PaymentStatusDisplay';
import PaymentTrustIndicators from './payment/PaymentTrustIndicators';
import { CreditCard, Loader2 } from 'lucide-react';

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
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'ready' | 'processing' | 'complete'>('loading');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  console.log('PaymentIframe: Rendering with URL:', paymentUrl);

  usePaymentMessageHandler({
    paymentUrl,
    onPaymentComplete,
    setPaymentStatus
  });

  useEffect(() => {
    if (!iframeRef.current || !paymentUrl) return;

    const iframe = iframeRef.current;

    const handleLoad = () => {
      console.log('PaymentIframe: Iframe loaded successfully');
      setIframeLoaded(true);
      setPaymentStatus('ready');
      onPaymentLoad();
    };

    iframe.addEventListener('load', handleLoad);
    
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [paymentUrl, onPaymentLoad]);

  if (!paymentUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Setting up payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Security Notice - Fixed at top */}
      <div className="flex-shrink-0 p-4 bg-white border-b">
        <PaymentSecurityNotice />
        <PaymentStatusDisplay paymentStatus={paymentStatus} paymentLoading={paymentLoading} />
      </div>
      
      {/* Payment Iframe Container - Takes remaining space */}
      <div className="flex-1 p-4 min-h-0">
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
            {!iframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Loading secure payment...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                </div>
              </div>
            )}
            
            <iframe
              ref={iframeRef}
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
            />
          </div>
        </div>
      </div>
      
      {/* Trust Indicators - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 bg-white border-t">
        <PaymentTrustIndicators />
      </div>
    </div>
  );
};

export default PaymentIframe;
