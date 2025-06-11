
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enhanced validation functions
const validateStripeAccountId = (accountId: string): boolean => {
  const stripeAccountRegex = /^acct_[a-zA-Z0-9]{16}$/;
  return stripeAccountRegex.test(accountId);
};

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>'"&]/g, (char) => {
    const entityMap: { [key: string]: string } = {
      '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;'
    };
    return entityMap[char] || char;
  }).trim();
};

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const isRateLimited = (userId: string, maxRequests: number = 10, windowMs: number = 300000): boolean => {
  const now = Date.now();
  const userRequests = requestCounts.get(userId);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(userId, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (userRequests.count >= maxRequests) {
    return true;
  }
  
  userRequests.count++;
  return false;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Enhanced authentication validation
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized - missing token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    
    // Determine if we're in test or live mode based on the secret key
    const isTestMode = stripeSecretKey.startsWith("sk_test_");
    console.log("Operating in mode:", isTestMode ? "test" : "live");

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Invalid user token:", userError?.message);
      return new Response(JSON.stringify({ error: "Unauthorized - invalid token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Parse and validate request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Invalid JSON in request body:", e);
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { stripe_account_id } = requestData;

    // Enhanced input validation
    if (!stripe_account_id || typeof stripe_account_id !== 'string') {
      console.error("Missing or invalid stripe_account_id");
      return new Response(JSON.stringify({ error: "Missing required field: stripe_account_id" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!validateStripeAccountId(stripe_account_id)) {
      console.error("Invalid stripe_account_id format:", stripe_account_id);
      return new Response(JSON.stringify({ error: "Invalid Stripe account ID format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Rate limiting
    if (isRateLimited(userData.user.id)) {
      console.error("Rate limit exceeded for user:", userData.user.id);
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 429,
      });
    }

    // Verify user owns this Stripe account
    const { data: accountData, error: accountError } = await supabaseClient
      .from("barber_accounts")
      .select("barber_id")
      .eq("stripe_account_id", sanitizeInput(stripe_account_id))
      .eq("barber_id", userData.user.id)
      .maybeSingle();

    if (accountError) {
      console.error("Error verifying account ownership:", accountError);
      return new Response(JSON.stringify({ error: "Database error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (!accountData) {
      console.error("User attempting to access account they don't own:", {
        user: userData.user.id,
        account: stripe_account_id
      });
      return new Response(JSON.stringify({ error: "Unauthorized - account not found or access denied" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    try {
      // First, check the account status to provide better error messages
      const account = await stripe.accounts.retrieve(stripe_account_id);
      
      console.log("Account details:", {
        id: account.id,
        details_submitted: account.details_submitted,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled
      });

      // Check if account onboarding is complete
      if (!account.details_submitted) {
        console.log("Account onboarding not completed, redirecting to onboarding");
        
        // Create account link for onboarding instead of login link
        const accountLink = await stripe.accountLinks.create({
          account: stripe_account_id,
          refresh_url: `${req.headers.get("origin")}/dashboard`,
          return_url: `${req.headers.get("origin")}/dashboard`,
          type: 'account_onboarding',
        });

        return new Response(JSON.stringify({ 
          url: accountLink.url,
          message: "Completing account setup..."
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Create login link for the connected account
      const loginLink = await stripe.accounts.createLoginLink(stripe_account_id);

      // Validate the returned URL
      if (!loginLink.url || !loginLink.url.startsWith('https://connect.stripe.com/')) {
        console.error("Invalid login link URL received from Stripe:", loginLink.url);
        return new Response(JSON.stringify({ error: "Invalid login link generated" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      console.log("Successfully created dashboard link for account:", stripe_account_id);

      return new Response(JSON.stringify({ url: loginLink.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } catch (stripeError: any) {
      console.error("Stripe API error:", stripeError);
      
      // Handle specific Stripe errors with helpful messages
      if (stripeError.message?.includes("testmode key")) {
        return new Response(JSON.stringify({ 
          error: "This account was created in test mode but you're now using live mode. Please create a new Stripe account or switch back to test mode.",
          needsNewAccount: true
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      
      if (stripeError.message?.includes("not completed onboarding")) {
        return new Response(JSON.stringify({ 
          error: "Account setup is incomplete. Please complete your Stripe onboarding first.",
          needsOnboarding: true
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      return new Response(JSON.stringify({ 
        error: "Failed to access Stripe dashboard. Please try again or contact support.",
        details: stripeError.message
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

  } catch (error) {
    console.error("Unexpected error creating dashboard link:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
