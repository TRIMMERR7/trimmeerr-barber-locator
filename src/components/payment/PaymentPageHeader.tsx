
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PaymentPageHeaderProps {
  onBack: () => void;
}

const PaymentPageHeader = ({ onBack }: PaymentPageHeaderProps) => {
  return (
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
  );
};

export default PaymentPageHeader;
