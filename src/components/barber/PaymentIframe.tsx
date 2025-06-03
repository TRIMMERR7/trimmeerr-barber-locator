
import React, { useState } from 'react';
import { usePaymentMessageHandler } from '@/hooks/usePaymentMessageHandler';
import { usePaymentIframeManager } from '@/hooks/usePaymentIframeManager';
import PaymentSecurityNotice from './payment/PaymentSecurityNotice';
import PaymentStatusDisplay from './payment/PaymentStatusDisplay';
import PaymentIframeContainer from './payment/PaymentIframeContainer';
import PaymentTrustIndicators from './payment/PaymentTrustIndicators';

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
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);

  console.log('PaymentIframe: Rendering with URL:', paymentUrl);

  usePaymentMessageHandler({
    paymentUrl,
    onPaymentComplete,
    setPaymentStatus
  });

  usePaymentIframeManager({
    iframe: iframeRef,
    paymentUrl,
    onPaymentLoad,
    onPaymentComplete,
    setPaymentStatus
  });

  if (!paymentUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600">Loading payment...</p>
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
      
      {/* Payment Iframe - Takes remaining space */}
      <div className="flex-1 p-4 min-h-0">
        <PaymentIframeContainer paymentUrl={paymentUrl} onIframeRef={setIframeRef} />
      </div>
      
      {/* Trust Indicators - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 bg-white border-t">
        <PaymentTrustIndicators />
      </div>
    </div>
  );
};

export default PaymentIframe;
