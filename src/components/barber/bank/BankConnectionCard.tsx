
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface BankConnectionCardProps {
  connecting: boolean;
  onCreateAccount: () => void;
}

const BankConnectionCard = ({ connecting, onCreateAccount }: BankConnectionCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Connect Your Bank Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-900/20 border-blue-500/30">
          <AlertCircle className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            To receive payments from clients, you need to connect your bank account through Stripe.
            This is a secure process that ensures you get paid quickly and safely.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <h3 className="text-white font-semibold">What you'll need:</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Valid government-issued ID
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Bank account details
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Social Security Number (US) or equivalent
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Business address (can be home address)
            </li>
          </ul>
        </div>

        <Button
          onClick={onCreateAccount}
          disabled={connecting}
          className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
        >
          {connecting ? 'Connecting...' : 'Connect Bank Account'}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default BankConnectionCard;
