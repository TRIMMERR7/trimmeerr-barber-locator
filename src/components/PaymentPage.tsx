
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PaymentPageStyles from './payment/PaymentPageStyles';
import PaymentPageHeader from './payment/PaymentPageHeader';
import PaymentHeroSection from './payment/PaymentHeroSection';
import PaymentOptionsGrid from './payment/PaymentOptionsGrid';
import PaymentInfoCard from './payment/PaymentInfoCard';
import PaymentAnimatedBackground from './payment/PaymentAnimatedBackground';

interface PaymentPageProps {
  onBack: () => void;
}

interface PaymentOption {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: React.ReactNode;
}

const PaymentPage = ({ onBack }: PaymentPageProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (option: PaymentOption) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: option.price,
          currency: 'usd',
          serviceType: option.id
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open payment in new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PaymentPageStyles />
      
      <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-hidden relative">
        <PaymentAnimatedBackground />

        <PaymentPageHeader onBack={onBack} />

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white scrollbar-hide relative z-10">
          <div className="max-w-2xl mx-auto space-y-8 p-6">
            <PaymentHeroSection />

            <PaymentOptionsGrid 
              loading={loading}
              onPayment={handlePayment}
            />

            <PaymentInfoCard />

            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
