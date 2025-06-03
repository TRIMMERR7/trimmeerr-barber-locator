
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, DollarSign, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface BarberAccount {
  id: string;
  stripe_account_id: string | null;
  account_status: string;
  onboarding_completed: boolean;
  details_submitted: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
}

const BankAccountPage = () => {
  const [account, setAccount] = useState<BarberAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchBarberAccount();
    }
  }, [user]);

  const fetchBarberAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('barber_accounts')
        .select('*')
        .eq('barber_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setAccount(data);
    } catch (error) {
      console.error('Error fetching barber account:', error);
      toast({
        title: "Error",
        description: "Failed to load account information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createStripeAccount = async () => {
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-account', {
        body: { barber_id: user?.id }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Stripe",
          description: "Complete your account setup in the new tab",
        });
      }
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      toast({
        title: "Error",
        description: "Failed to create Stripe account",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const openStripeDashboard = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('stripe-dashboard-link', {
        body: { stripe_account_id: account?.stripe_account_id }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening Stripe dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to open Stripe dashboard",
        variant: "destructive",
      });
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading account information...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Bank Account & Payments</h1>
        <p className="text-gray-400">Connect your bank account to receive payments from clients</p>
      </div>

      {!account?.stripe_account_id ? (
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
              onClick={createStripeAccount}
              disabled={connecting}
              className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
            >
              {connecting ? 'Connecting...' : 'Connect Bank Account'}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                onClick={openStripeDashboard}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Open Stripe Dashboard
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

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
        </div>
      )}
    </div>
  );
};

export default BankAccountPage;
