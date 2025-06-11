
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BankAccountHeader from './bank/BankAccountHeader';
import BankConnectionCard from './bank/BankConnectionCard';
import AccountStatusCard from './bank/AccountStatusCard';
import PaymentInformationCard from './bank/PaymentInformationCard';

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
  const [needsReset, setNeedsReset] = useState(false);
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

  const resetAndCreateNewAccount = async () => {
    setConnecting(true);
    try {
      // First, delete the old account record
      if (account?.stripe_account_id) {
        await supabase
          .from('barber_accounts')
          .delete()
          .eq('barber_id', user?.id);
      }

      // Create a fresh Stripe account
      const { data, error } = await supabase.functions.invoke('create-stripe-account', {
        body: { barber_id: user?.id }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Creating New Account",
          description: "Opening Stripe setup in a new tab. Complete the onboarding to connect your bank account.",
        });
        
        // Refresh the page data after a short delay
        setTimeout(() => {
          fetchBarberAccount();
          setNeedsReset(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating new Stripe account:', error);
      toast({
        title: "Error",
        description: "Failed to create new Stripe account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
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

      if (error) {
        // Check if this is a test/live mode mismatch
        if (error.message?.includes('testmode') || error.message?.includes('test mode')) {
          setNeedsReset(true);
          toast({
            title: "Account Needs Update",
            description: "Your account was created in test mode but we're now in live mode. Please reset and create a new account.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening Stripe dashboard:', error);
      setNeedsReset(true);
      toast({
        title: "Dashboard Access Issue",
        description: "There's an issue with your account. Please reset and create a new one.",
        variant: "destructive",
      });
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
      <BankAccountHeader />

      {/* Show reset option if there's an account but it needs to be reset */}
      {(needsReset || (!account?.stripe_account_id)) ? (
        <BankConnectionCard 
          connecting={connecting}
          onCreateAccount={account?.stripe_account_id ? resetAndCreateNewAccount : createStripeAccount}
          resetMode={!!account?.stripe_account_id}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountStatusCard 
            account={account}
            onOpenDashboard={openStripeDashboard}
            onReset={() => setNeedsReset(true)}
          />
          <PaymentInformationCard account={account} />
        </div>
      )}
    </div>
  );
};

export default BankAccountPage;
