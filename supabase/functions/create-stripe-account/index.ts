
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Enhanced input validation
const validateUserId = (userId: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
};

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>'"&]/g, (char) => {
    const entityMap: { [key: string]: string } = {
      '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;'
    };
    return entityMap[char] || char;
  }).trim();
};

// Rate limiting storage
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const isRateLimited = (userId: string, maxRequests: number = 5, windowMs: number = 300000): boolean => {
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

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
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

    const { barber_id } = requestData;

    // Enhanced input validation
    if (!barber_id || typeof barber_id !== 'string') {
      console.error("Missing or invalid barber_id");
      return new Response(JSON.stringify({ error: "Missing required field: barber_id" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (!validateUserId(barber_id)) {
      console.error("Invalid barber_id format:", barber_id);
      return new Response(JSON.stringify({ error: "Invalid barber_id format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify user is creating account for themselves
    if (userData.user.id !== barber_id) {
      console.error("User attempting to create account for different user:", {
        requestingUser: userData.user.id,
        targetBarber: barber_id
      });
      return new Response(JSON.stringify({ error: "Unauthorized - cannot create account for another user" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
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

    // Check if account already exists
    const { data: existingAccount, error: checkError } = await supabaseClient
      .from("barber_accounts")
      .select("stripe_account_id")
      .eq("barber_id", barber_id)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking existing account:", checkError);
      return new Response(JSON.stringify({ error: "Database error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    if (existingAccount?.stripe_account_id) {
      console.warn("Account already exists for barber:", barber_id);
      return new Response(JSON.stringify({ error: "Stripe account already exists for this barber" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 409,
      });
    }

    // Create Stripe Connect account with enhanced security
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

    // Store account in database with proper error handling
    const { error: insertError } = await supabaseClient.from("barber_accounts").upsert({
      barber_id: sanitizeInput(barber_id),
      stripe_account_id: account.id,
      account_status: "pending",
      onboarding_completed: false,
      details_submitted: false,
      charges_enabled: false,
      payouts_enabled: false,
    });

    if (insertError) {
      console.error("Error storing account in database:", insertError);
      // Try to delete the Stripe account if database insert failed
      try {
        await stripe.accounts.del(account.id);
      } catch (deleteError) {
        console.error("Failed to cleanup Stripe account after database error:", deleteError);
      }
      return new Response(JSON.stringify({ error: "Failed to store account information" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Create account link for onboarding with proper validation
    const origin = req.headers.get("origin");
    if (!origin || (!origin.includes('lovable.app') && !origin.includes('localhost'))) {
      console.error("Invalid or missing origin header:", origin);
      return new Response(JSON.stringify({ error: "Invalid request origin" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${origin}/barber-dashboard?tab=bank`,
      return_url: `${origin}/barber-dashboard?tab=bank`,
      type: "account_onboarding",
    });

    console.log("Successfully created Stripe account for barber:", barber_id);

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Unexpected error creating Stripe account:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
