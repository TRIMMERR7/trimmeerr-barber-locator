
import { useEffect } from 'react';

interface UsePaymentMessageHandlerProps {
  paymentUrl: string;
  onPaymentComplete: () => void;
  setPaymentStatus: (status: 'loading' | 'ready' | 'processing' | 'complete') => void;
}

export const usePaymentMessageHandler = ({
  paymentUrl,
  onPaymentComplete,
  setPaymentStatus
}: UsePaymentMessageHandlerProps) => {
  useEffect(() => {
    if (!paymentUrl) return;

    const handleMessage = (event: MessageEvent) => {
      console.log('PaymentIframe: Received message:', event.data, 'from:', event.origin);
      
      // Check if message is from Stripe
      if (event.origin.includes('stripe.com') || event.origin.includes('checkout.stripe.com')) {
        const messageData = event.data;
        
        // Handle different Stripe checkout events
        if (messageData.type === 'checkout.session.completed' || 
            messageData === 'checkout.session.completed' ||
            messageData.type === 'payment_intent.succeeded' ||
            messageData === 'payment_intent.succeeded') {
          console.log('PaymentIframe: Payment completed successfully');
          setPaymentStatus('complete');
          setTimeout(() => {
            onPaymentComplete();
          }, 1500);
        }
        
        if (messageData.type === 'checkout.session.async_payment_succeeded') {
          console.log('PaymentIframe: Async payment succeeded');
          setPaymentStatus('complete');
          setTimeout(() => {
            onPaymentComplete();
          }, 1500);
        }
        
        if (messageData === 'stripe_checkout_closed' || messageData.type === 'checkout.session.canceled') {
          console.log('PaymentIframe: Checkout closed/canceled');
          // Don't call onPaymentComplete for cancellation
        }
      }

      // Also listen for URL changes that might indicate success
      if (event.origin === window.location.origin) {
        if (event.data.url && (event.data.url.includes('success') || event.data.url.includes('payment-success'))) {
          console.log('PaymentIframe: Success URL detected');
          setPaymentStatus('complete');
          setTimeout(() => {
            onPaymentComplete();
          }, 1500);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      console.log('PaymentIframe: Cleaning up message listeners');
      window.removeEventListener('message', handleMessage);
    };
  }, [paymentUrl, onPaymentComplete, setPaymentStatus]);
};
