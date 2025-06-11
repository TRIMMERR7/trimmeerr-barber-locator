
import Stripe from "https://esm.sh/stripe@14.21.0";

export const createStripeAccount = async (): Promise<Stripe.Account> => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  return await stripe.accounts.create({
    type: "express",
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    settings: {
      payouts: {
        schedule: {
          interval: "daily",
        },
      },
    },
  });
};

export const createAccountLink = async (accountId: string, origin: string): Promise<Stripe.AccountLink> => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/barber-dashboard?tab=bank`,
    return_url: `${origin}/barber-dashboard?tab=bank`,
    type: "account_onboarding",
  });
};

export const deleteStripeAccount = async (accountId: string): Promise<void> => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });

  try {
    await stripe.accounts.del(accountId);
  } catch (deleteError) {
    console.error("Failed to cleanup Stripe account after database error:", deleteError);
  }
};
