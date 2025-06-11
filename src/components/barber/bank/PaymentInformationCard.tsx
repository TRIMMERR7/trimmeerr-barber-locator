
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

interface BarberAccount {
  id: string;
  stripe_account_id: string | null;
  account_status: string;
  onboarding_completed: boolean;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
}

interface PaymentInformationCardProps {
  account: BarberAccount;
}

const PaymentInformationCard = ({ account }: PaymentInformationCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {account.charges_enabled ? (
          <Alert className="bg-green-900/20 border-green-500/30">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">
              Your account is ready to accept payments! Clients can now book and pay for your services.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-yellow-900/20 border-yellow-500/30">
            <AlertCircle className="h-4 w-4 text-yellow-400" />
            <AlertDescription className="text-yellow-300">
              Complete your account setup to start accepting payments from clients.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 text-sm text-gray-300">
          <h3 className="font-semibold text-white">Payment Details:</h3>
          <ul className="space-y-1">
            <li>• Payments are processed securely through Stripe</li>
            <li>• Funds are typically available in 2-7 business days</li>
            <li>• Transaction fees: 2.9% + 30¢ per successful payment</li>
            <li>• No monthly fees or setup costs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInformationCard;
