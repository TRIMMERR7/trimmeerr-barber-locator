
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

  console.log('PaymentIframe: Setting up payment iframe', { paymentUrl });

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
          <p className="text-gray-600">No payment URL available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 space-y-4 flex-shrink-0">
        <PaymentSecurityNotice />
        <PaymentStatusDisplay paymentStatus={paymentStatus} paymentLoading={paymentLoading} />
      </div>
      
      <div className="flex-1 p-4">
        <PaymentIframeContainer paymentUrl={paymentUrl} onIframeRef={setIframeRef} />
      </div>
      
      <div className="p-4 flex-shrink-0">
        <PaymentTrustIndicators />
      </div>
    </div>
  );
};

export default PaymentIframe;
