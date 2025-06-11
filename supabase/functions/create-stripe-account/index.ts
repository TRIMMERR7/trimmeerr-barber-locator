
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

    // Create Stripe Connect account
    const account = await createStripeAccount();

    // Store account in database with proper error handling
    try {
      await storeBarberAccount(supabaseClient, barber_id, account.id);
    } catch (error) {
      console.error("Error storing account in database:", error);
      // Try to delete the Stripe account if database insert failed
      await deleteStripeAccount(account.id);
      return createErrorResponse("Failed to store account information", 500);
    }

    // Create account link for onboarding with proper validation
    const origin = req.headers.get("origin");
    validateOrigin(origin);

    const accountLink = await createAccountLink(account.id, origin!);

    console.log("Successfully created Stripe account for barber:", barber_id);

    return createSuccessResponse({ url: accountLink.url });
  } catch (error) {
    console.error("Error in create-stripe-account:", error);
    
    // Handle specific error types
    if (error.message.includes("Unauthorized")) {
      return createErrorResponse(error.message, 401);
    }
    if (error.message.includes("Missing required field") || error.message.includes("Invalid")) {
      return createErrorResponse(error.message, 400);
    }
    if (error.message.includes("cannot create account for another user")) {
      return createErrorResponse(error.message, 403);
    }
    if (error.message.includes("already exists")) {
      return createErrorResponse(error.message, 409);
    }
    
    return createErrorResponse("Internal server error", 500);
  }
});
