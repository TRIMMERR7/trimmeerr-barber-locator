
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { sanitizeInput } from "./validation.ts";

export const checkExistingAccount = async (supabaseClient: SupabaseClient, barberId: string) => {
  const { data: existingAccount, error: checkError } = await supabaseClient
    .from("barber_accounts")
    .select("stripe_account_id")
    .eq("barber_id", barberId)
    .maybeSingle();

  if (checkError) {
    throw new Error("Database error");
  }

  if (existingAccount?.stripe_account_id) {
    throw new Error("Stripe account already exists for this barber");
  }
};

export const storeBarberAccount = async (
  supabaseClient: SupabaseClient, 
  barberId: string, 
  stripeAccountId: string
) => {
  const { error: insertError } = await supabaseClient.from("barber_accounts").upsert({
    barber_id: sanitizeInput(barberId),
    stripe_account_id: stripeAccountId,
    account_status: "pending",
    onboarding_completed: false,
    details_submitted: false,
    charges_enabled: false,
    payouts_enabled: false,
  });

  if (insertError) {
    throw new Error("Failed to store account information");
  }
};
