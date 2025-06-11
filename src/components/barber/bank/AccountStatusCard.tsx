
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface BarberAccount {
  id: string;
  stripe_account_id: string | null;
  account_status: string;
  onboarding_completed: boolean;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
}

interface AccountStatusCardProps {
  account: BarberAccount;
  onOpenDashboard: () => void;
  onReset: () => void;
}

const AccountStatusCard = ({ account, onOpenDashboard, onReset }: AccountStatusCardProps) => {
  const getStatusBadge = () => {
    if (account.charges_enabled && account.payouts_enabled) {
      return <Badge className="bg-green-600 text-white">Active</Badge>;
    } else if (account.details_submitted) {
      return <Badge className="bg-yellow-600 text-white">Under Review</Badge>;
    } else {
      return <Badge className="bg-red-600 text-white">Setup Required</Badge>;
    }
  };

  const getStatusIcon = () => {
    if (account.charges_enabled && account.payouts_enabled) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {getStatusIcon()}
          Account Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Status:</span>
          {getStatusBadge()}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Can Accept Payments:</span>
            <span className={account.charges_enabled ? 'text-green-400' : 'text-red-400'}>
              {account.charges_enabled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Can Receive Payouts:</span>
            <span className={account.payouts_enabled ? 'text-green-400' : 'text-red-400'}>
              {account.payouts_enabled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Details Submitted:</span>
            <span className={account.details_submitted ? 'text-green-400' : 'text-yellow-400'}>
              {account.details_submitted ? 'Yes' : 'Pending'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onOpenDashboard}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Open Stripe Dashboard
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Account
          </Button>
        </div>

        <div className="text-sm text-gray-400">
          <p>Having issues? Try resetting your account to create a fresh connection.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountStatusCard;
