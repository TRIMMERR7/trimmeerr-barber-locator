
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

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
}

const AccountStatusCard = ({ account, onOpenDashboard }: AccountStatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled': return 'bg-green-500';
      case 'restricted': return 'bg-yellow-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-red-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'enabled': return 'Active';
      case 'restricted': return 'Restricted';
      case 'pending': return 'Pending';
      default: return 'Inactive';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Account Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Status</span>
          <Badge className={`${getStatusColor(account.account_status)} text-white`}>
            {getStatusText(account.account_status)}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Onboarding</span>
            <div className="flex items-center gap-2">
              {account.onboarding_completed ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-sm text-gray-300">
                {account.onboarding_completed ? 'Complete' : 'Incomplete'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Details Submitted</span>
            <div className="flex items-center gap-2">
              {account.details_submitted ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-400" />
              )}
              <span className="text-sm text-gray-300">
                {account.details_submitted ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Can Accept Payments</span>
            <div className="flex items-center gap-2">
              {account.charges_enabled ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm text-gray-300">
                {account.charges_enabled ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Can Receive Payouts</span>
            <div className="flex items-center gap-2">
              {account.payouts_enabled ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm text-gray-300">
                {account.payouts_enabled ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        <Button
          onClick={onOpenDashboard}
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Open Stripe Dashboard
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountStatusCard;
