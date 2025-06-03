
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const PaymentCanceled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black/80 via-gray-900/60 to-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-500/20 backdrop-blur-sm rounded-full w-fit border border-red-400/30">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-400">
            Booking Canceled
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-white/80">
              Your appointment booking was canceled. No charges were made to your account.
            </p>
            <p className="text-sm text-white/60">
              You can try booking again or return to browse other barbers.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/90 hover:to-red-800/90 backdrop-blur-sm border border-red-500/30"
            >
              Return to App
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCanceled;
