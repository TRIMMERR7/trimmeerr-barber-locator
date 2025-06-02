
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Shield, CreditCard, CheckCircle } from 'lucide-react';

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
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'ready' | 'processing' | 'complete'>('loading');

  useEffect(() => {
    console.log('PaymentIframe: Setting up payment iframe', { paymentUrl });
    
    if (!paymentUrl) return;

    // Listen for messages from Stripe checkout
    const handleMessage = (event: MessageEvent) => {
      console.log('PaymentIframe: Received message:', event.data, 'from:', event.origin);
      
      // Check if message is from Stripe
      if (event.origin.includes('stripe.com') || event.origin.includes('checkout.stripe.com')) {
        const data = event.data;
        
        // Handle different Stripe checkout events
        if (data.type === 'checkout.session.completed' || 
            data === 'checkout.session.completed' ||
            data.type === 'payment_intent.succeeded' ||
            data === 'payment_intent.succeeded') {
          console.log('PaymentIframe: Payment completed successfully');
          setPaymentStatus('complete');
          setTimeout(() => {
            onPaymentComplete();
          }, 1000);
        }
        
        if (data.type === 'checkout.session.async_payment_succeeded') {
          console.log('PaymentIframe: Async payment succeeded');
          setPaymentStatus('complete');
          setTimeout(() => {
            onPaymentComplete();
          }, 1000);
        }
        
        if (data === 'stripe_checkout_closed' || data.type === 'checkout.session.canceled') {
          console.log('PaymentIframe: Checkout closed/canceled');
          // Don't call onPaymentComplete for cancellation
        }
      }

      // Also listen for URL changes that might indicate success
      if (event.origin === window.location.origin) {
        if (data.url && (data.url.includes('success') || data.url.includes('payment-success'))) {
          console.log('PaymentIframe: Success URL detected');
          setPaymentStatus('complete');
          setTimeout(() => {
            onPaymentComplete();
          }, 1000);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Set up iframe load handler
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        console.log('PaymentIframe: Iframe loaded');
        setPaymentStatus('ready');
        onPaymentLoad();
        
        // Try to detect success page navigation
        try {
          const checkForSuccess = () => {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (iframeDoc && iframeDoc.URL.includes('success')) {
                console.log('PaymentIframe: Success page detected in iframe');
                setPaymentStatus('complete');
                setTimeout(() => {
                  onPaymentComplete();
                }, 1000);
              }
            } catch (e) {
              // Cross-origin restrictions - this is expected
            }
          };
          
          // Check periodically for success page
          const interval = setInterval(checkForSuccess, 2000);
          
          // Clean up interval after 5 minutes
          setTimeout(() => clearInterval(interval), 300000);
        } catch (e) {
          console.log('PaymentIframe: Cannot access iframe content (expected for cross-origin)');
        }
      };
      
      iframe.addEventListener('load', handleLoad);
    }
    
    return () => {
      console.log('PaymentIframe: Cleaning up');
      window.removeEventListener('message', handleMessage);
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, [paymentUrl, onPaymentLoad, onPaymentComplete]);

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

      {/* Payment Status */}
      {paymentStatus === 'complete' && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-800">Payment Successful!</h3>
              <p className="text-sm text-green-700">Redirecting you back...</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {(paymentLoading || paymentStatus === 'loading') && (
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
          sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-top-navigation-by-user-activation allow-popups allow-popups-to-escape-sandbox"
          allow="payment; camera; microphone"
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
