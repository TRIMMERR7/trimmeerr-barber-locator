
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
    <div className="w-full h-full flex flex-col space-y-4">
      <PaymentSecurityNotice />
      <PaymentStatusDisplay paymentStatus={paymentStatus} paymentLoading={paymentLoading} />
      <PaymentIframeContainer paymentUrl={paymentUrl} onIframeRef={setIframeRef} />
      <PaymentTrustIndicators />
    </div>
  );
};

export default PaymentIframe;
