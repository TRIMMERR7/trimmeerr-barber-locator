
import Stripe from "https://esm.sh/stripe@14.21.0";

export const createStripeAccount = async (): Promise<Stripe.Account> => {
  console.log("🔄 Initializing Stripe client...");
  
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  
  console.log("🔑 Using Stripe key:", stripeKey.substring(0, 7) + "***");
  
  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });

  console.log("🔄 Creating Stripe Express account...");
  
  try {
    const account = await stripe.accounts.create({
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
    
    console.log("✅ Stripe account created:", account.id);
    return account;
  } catch (error) {
    console.error("🚨 Stripe account creation failed:", error);
    throw error;
  }
};

export const createAccountLink = async (accountId: string, origin: string): Promise<Stripe.AccountLink> => {
  console.log("🔄 Creating account link for:", accountId);
  
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  
  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });

  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/barber-dashboard?tab=bank`,
      return_url: `${origin}/barber-dashboard?tab=bank`,
      type: "account_onboarding",
    });
    
    console.log("✅ Account link created:", accountLink.url);
    return accountLink;
  } catch (error) {
    console.error("🚨 Account link creation failed:", error);
    throw error;
  }
};

export const deleteStripeAccount = async (accountId: string): Promise<void> => {
  console.log("🔄 Deleting Stripe account:", accountId);
  
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeKey) {
    console.error("Cannot delete account - STRIPE_SECRET_KEY not available");
    return;
  }
  
  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
  });

  try {
    await stripe.accounts.del(accountId);
    console.log("✅ Stripe account deleted successfully");
  } catch (deleteError) {
    console.error("🚨 Failed to cleanup Stripe account after database error:", deleteError);
  }
};
