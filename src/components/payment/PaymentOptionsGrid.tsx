
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Loader2 } from "lucide-react";

interface PaymentOption {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: React.ReactNode;
}

interface PaymentOptionsGridProps {
  loading: boolean;
  onPayment: (option: PaymentOption) => void;
}

const PaymentOptionsGrid = ({ loading, onPayment }: PaymentOptionsGridProps) => {
  const paymentOptions: PaymentOption[] = [
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

  return (
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
              onClick={() => onPayment(option)}
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
  );
};

export default PaymentOptionsGrid;
