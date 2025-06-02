
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = "usd", serviceType = "barber_service", serviceName, barberName, appointmentTime, userPhone } = await req.json();

    // Initialize Stripe with better error handling
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    console.log("Stripe key status:", stripeSecretKey ? "Key found" : "Key missing");
    
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key is not configured");
    }

    if (!stripeSecretKey.startsWith("sk_")) {
      throw new Error("Invalid Stripe secret key format. Must start with 'sk_'");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user if authenticated
    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    if (!user?.email) {
      throw new Error("User authentication required");
    }

    // Check if customer exists or create new one
    let customerId;
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
    }

    // Create service description
    const serviceDescription = serviceName && barberName && appointmentTime 
      ? `${serviceName} with ${barberName} at ${appointmentTime}`
      : "Barber Service Payment";

    // Create payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: { 
              name: serviceName || "Barber Service",
              description: serviceDescription
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}&barber=${encodeURIComponent(barberName || '')}&service=${encodeURIComponent(serviceName || '')}&time=${encodeURIComponent(appointmentTime || '')}`,
      cancel_url: `${req.headers.get("origin")}/payment-canceled`,
      metadata: {
        service_name: serviceName || '',
        barber_name: barberName || '',
        appointment_time: appointmentTime || '',
        user_email: user.email,
        user_phone: userPhone || ''
      }
    });

    // Record payment in database
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabaseService.from("payments").insert({
      user_id: user.id,
      stripe_session_id: session.id,
      amount: amount,
      currency: currency,
      service_type: serviceType,
      status: "pending",
    });

    console.log("Payment session created successfully:", session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
