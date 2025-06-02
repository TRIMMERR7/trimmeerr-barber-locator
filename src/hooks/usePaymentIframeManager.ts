
import { useEffect } from 'react';

interface UsePaymentIframeManagerProps {
  iframe: HTMLIFrameElement | null;
  paymentUrl: string;
  onPaymentLoad: () => void;
  onPaymentComplete: () => void;
  setPaymentStatus: (status: 'loading' | 'ready' | 'processing' | 'complete') => void;
}

export const usePaymentIframeManager = ({
  iframe,
  paymentUrl,
  onPaymentLoad,
  onPaymentComplete,
  setPaymentStatus
}: UsePaymentIframeManagerProps) => {
  useEffect(() => {
    if (!iframe || !paymentUrl) return;

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
    
    return () => {
      console.log('PaymentIframe: Cleaning up iframe listeners');
      iframe.removeEventListener('load', handleLoad);
    };
  }, [iframe, paymentUrl, onPaymentLoad, onPaymentComplete, setPaymentStatus]);
};
