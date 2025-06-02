
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
    <>
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .payment-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .payment-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .pulse-glow {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
      
      <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-red-600/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-red-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Header */}
        <div className="glass-effect border-b border-gray-800/50 p-4 flex-shrink-0 animate-fade-in relative z-10">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack} 
                className="h-10 w-10 transition-all duration-300 hover:scale-110 hover:bg-gray-800/50 hover:rotate-12"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
              <div className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/2c7510e8-8ef4-48d7-b2e9-8ee1afed1e54.png" 
                  alt="TRIMMERR Logo" 
                  className="w-5 h-5 transition-transform duration-300 hover:scale-110 animate-pulse"
                />
                <h1 className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent animate-shimmer">
                  TRIMMERR
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white scrollbar-hide relative z-10">
          <div className="max-w-2xl mx-auto space-y-8 p-6">
            {/* Hero Section */}
            <div className="text-center py-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-scale-in">
                Premium Services
              </h1>
              <p className="text-xl text-gray-600 animate-fade-in leading-relaxed" style={{ animationDelay: '0.4s' }}>
                Enhance your barber experience with our premium features
              </p>
              <div className="mt-6 w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto rounded-full animate-scale-in" style={{ animationDelay: '0.6s' }}></div>
            </div>

            {/* Payment Options */}
            <div className="space-y-6">
              {paymentOptions.map((option, index) => (
                <Card 
                  key={option.id} 
                  className="payment-card border-2 border-gray-200/50 hover:border-red-300 animate-fade-in bg-white/80 backdrop-blur-sm overflow-hidden group"
                  style={{ animationDelay: `${0.8 + index * 0.2}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl text-red-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                          {option.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-red-700 transition-colors duration-300">
                            {option.title}
                          </h3>
                          <p className="text-gray-600 text-base mt-2 group-hover:text-gray-700 transition-colors duration-300">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600 pulse-glow">
                          ${(option.price / 100).toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">one-time</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Button 
                      onClick={() => handlePayment(option)}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          <span className="animate-pulse">Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center transition-all duration-300 group-hover:gap-3 gap-2">
                          <CreditCard className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                          <span>Pay with Apple Pay / Google Pay</span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Info */}
            <Card 
              className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 shadow-xl animate-fade-in transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] overflow-hidden group"
              style={{ animationDelay: '1.4s' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="pt-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-3 text-xl">Quick & Secure Payments</h4>
                    <p className="text-blue-700 leading-relaxed">
                      Pay securely with Apple Pay, Google Pay, or credit card. All transactions are encrypted and secure with industry-standard protection.
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-sm text-blue-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>SSL Encrypted • PCI Compliant</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom spacing for smooth scrolling */}
            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
