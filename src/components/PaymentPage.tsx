
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Smartphone, Loader2 } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentPageProps {
  onBack: () => void;
}

const PaymentPage = ({ onBack }: PaymentPageProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const paymentOptions = [
    {
      id: 'consultation',
      title: 'Premium Consultation',
      description: 'Get personalized barber recommendations',
      price: 999, // $9.99
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 'priority_booking',
      title: 'Priority Booking',
      description: 'Skip the queue and book instantly',
      price: 499, // $4.99
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      id: 'premium_search',
      title: 'AI-Powered Search',
      description: 'Advanced AI to find your perfect barber',
      price: 299, // $2.99
      icon: <Smartphone className="w-6 h-6" />
    }
  ];

  const handlePayment = async (option: typeof paymentOptions[0]) => {
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
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm border-b border-gray-800 p-4 flex-shrink-0 animate-fade-in">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack} 
              className="h-10 w-10 transition-all duration-200 hover:scale-105 hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
                alt="TRIMMERR Logo" 
                className="w-5 h-5 transition-transform duration-200 hover:scale-110"
              />
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                TRIMMERR
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide">
        <div className="max-w-2xl mx-auto space-y-6 p-4">
          {/* Hero Section */}
          <div className="text-center py-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 animate-scale-in">Premium Services</h1>
            <p className="text-lg text-gray-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Enhance your barber experience with our premium features
            </p>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            {paymentOptions.map((option, index) => (
              <Card 
                key={option.id} 
                className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in border-gray-200"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded-xl text-red-600 transition-all duration-300 group-hover:scale-110">
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600 animate-pulse">
                        ${(option.price / 100).toFixed(2)}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handlePayment(option)}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span className="animate-pulse">Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center transition-all duration-200">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay with Apple Pay / Google Pay
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Info */}
          <Card 
            className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg animate-fade-in transition-all duration-300 hover:shadow-xl"
            style={{ animationDelay: '0.6s' }}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl transition-transform duration-300 hover:scale-110">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Quick & Secure Payments</h4>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Pay securely with Apple Pay, Google Pay, or credit card. All transactions are encrypted and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bottom spacing for smooth scrolling */}
          <div className="h-6"></div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;
