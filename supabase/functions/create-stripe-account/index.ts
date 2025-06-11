
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { validateAuthentication, validateUserPermissions } from "./auth.ts";
import { validateRequestData, validateOrigin } from "./validation.ts";
import { isRateLimited } from "./rateLimiting.ts";
import { checkExistingAccount, storeBarberAccount } from "./database.ts";
import { createStripeAccount, createAccountLink, deleteStripeAccount } from "./stripe.ts";
import { createErrorResponse, createSuccessResponse, corsHeaders } from "./errorHandling.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("🔑 Checking Stripe secret key availability...");
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("❌ STRIPE_SECRET_KEY environment variable is not set");
      return createErrorResponse("Stripe configuration error: Secret key not found", 500);
    }
    
    if (!stripeKey.startsWith("sk_")) {
      console.error("❌ Invalid Stripe secret key format. Key should start with 'sk_'");
      return createErrorResponse("Stripe configuration error: Invalid secret key format", 500);
    }
    
    console.log("✅ Stripe secret key format is valid:", stripeKey.substring(0, 7) + "***");

    // Enhanced authentication validation
    const authHeader = req.headers.get("Authorization");
    const { userData, supabaseClient } = await validateAuthentication(authHeader);

    // Parse and validate request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Invalid JSON in request body:", e);
      return createErrorResponse("Invalid request format", 400);
    }

    const { barber_id } = validateRequestData(requestData);

    // Verify user is creating account for themselves
    validateUserPermissions(userData.user.id, barber_id);

    // Rate limiting
    if (isRateLimited(userData.user.id)) {
      console.error("Rate limit exceeded for user:", userData.user.id);
      return createErrorResponse("Too many requests. Please try again later.", 429);
    }

    // Check if account already exists
    await checkExistingAccount(supabaseClient, barber_id);

    // Create Stripe Connect account with enhanced error logging
    console.log("🔄 Creating Stripe Connect account...");
    const account = await createStripeAccount();
    console.log("✅ Stripe account created successfully:", account.id);

    // Store account in database with proper error handling
    try {
      await storeBarberAccount(supabaseClient, barber_id, account.id);
      console.log("✅ Account stored in database successfully");
    } catch (error) {
      console.error("Error storing account in database:", error);
      // Try to delete the Stripe account if database insert failed
      await deleteStripeAccount(account.id);
      return createErrorResponse("Failed to store account information", 500);
    }

    // Create account link for onboarding with proper validation
    const origin = req.headers.get("origin");
    validateOrigin(origin);

    console.log("🔄 Creating account onboarding link...");
    const accountLink = await createAccountLink(account.id, origin!);
    console.log("✅ Account link created successfully");

    console.log("Successfully created Stripe account for barber:", barber_id);

    return createSuccessResponse({ url: accountLink.url });
  } catch (error) {
    console.error("🚨 Error in create-stripe-account:", error);
    
    // Enhanced error handling with more specific messages
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes("Invalid API Key") || errorMessage.includes("No such")) {
      console.error("🔑 Stripe API Key issue detected");
      return createErrorResponse("Stripe configuration error: Please check your API key settings", 401);
    }
    if (errorMessage.includes("Unauthorized")) {
      return createErrorResponse(errorMessage, 401);
    }
    if (errorMessage.includes("Missing required field") || errorMessage.includes("Invalid")) {
      return createErrorResponse(errorMessage, 400);
    }
    if (errorMessage.includes("cannot create account for another user")) {
      return createErrorResponse(errorMessage, 403);
    }
    if (errorMessage.includes("already exists")) {
      return createErrorResponse(errorMessage, 409);
    }
    
    return createErrorResponse("Internal server error", 500);
  }
});
