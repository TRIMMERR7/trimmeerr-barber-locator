
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface BankConnectionCardProps {
  connecting: boolean;
  onCreateAccount: () => void;
  resetMode?: boolean;
}

const BankConnectionCard = ({ connecting, onCreateAccount, resetMode = false }: BankConnectionCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {resetMode ? <RefreshCw className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
          {resetMode ? 'Reset & Connect New Bank Account' : 'Connect Your Bank Account'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resetMode ? (
          <Alert className="bg-orange-900/20 border-orange-500/30">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-orange-300">
              Your previous account was created in test mode but we're now in live mode. 
              Click below to create a fresh live account and complete the real onboarding process.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-blue-900/20 border-blue-500/30">
            <AlertCircle className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-300">
              To receive payments from clients, you need to connect your bank account through Stripe.
              This is a secure process that ensures you get paid quickly and safely.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h3 className="text-white font-semibold">
            {resetMode ? "What you'll need for live account setup:" : "What you'll need:"}
          </h3>
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
              Business information (can be personal info for sole proprietors)
            </li>
            {resetMode && (
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300">Real business documents (this is live mode)</span>
              </li>
            )}
          </ul>
        </div>

        <Button
          onClick={onCreateAccount}
          disabled={connecting}
          className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
        >
          {connecting ? 'Setting up...' : resetMode ? 'Reset & Create New Account' : 'Connect Bank Account'}
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>

        {resetMode && (
          <p className="text-sm text-gray-400 text-center">
            This will create a completely new Stripe account for live payments
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BankConnectionCard;
