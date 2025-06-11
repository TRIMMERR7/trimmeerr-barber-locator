
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone } from "lucide-react";

const PaymentInfoCard = () => {
  return (
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
  );
};

export default PaymentInfoCard;
