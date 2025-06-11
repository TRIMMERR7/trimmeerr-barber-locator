
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from token
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { amount, currency = 'usd', serviceType, serviceName, barberName, appointmentTime, userPhone, barberId } = await req.json()

    // Enhanced validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Security: Maximum payment limit ($1000)
    if (amount > 100000) {
      return new Response(
        JSON.stringify({ error: 'Amount exceeds maximum limit' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate required fields including barberId
    if (!serviceType || !serviceName || !barberName || !appointmentTime || !barberId) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking information' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get barber's Stripe account ID
    const { data: barberAccount, error: barberAccountError } = await supabaseClient
      .from('barber_accounts')
      .select('stripe_account_id, charges_enabled')
      .eq('barber_id', barberId)
      .single()

    if (barberAccountError || !barberAccount?.stripe_account_id || !barberAccount.charges_enabled) {
      return new Response(
        JSON.stringify({ error: 'Barber payment account not available' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      console.error('Stripe key not found')
      return new Response(
        JSON.stringify({ error: 'Payment service unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate platform fee (10% of transaction)
    const platformFeeAmount = Math.round(amount * 0.10)
    
    console.log('Creating payment with Connect account:', {
      barberAccountId: barberAccount.stripe_account_id,
      amount,
      platformFee: platformFeeAmount
    })

    // Create Stripe checkout session with Connect account
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Account': barberAccount.stripe_account_id,
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price_data][currency]': currency,
        'line_items[0][price_data][product_data][name]': `${serviceName} with ${barberName}`,
        'line_items[0][price_data][product_data][description]': `Appointment: ${appointmentTime}`,
        'line_items[0][price_data][unit_amount]': amount.toString(),
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${req.headers.get('origin') || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}&barber=${encodeURIComponent(barberName)}&service=${encodeURIComponent(serviceName)}&time=${encodeURIComponent(appointmentTime)}`,
        'cancel_url': `${req.headers.get('origin') || 'http://localhost:3000'}/payment-canceled`,
        'payment_intent_data[application_fee_amount]': platformFeeAmount.toString(),
        'metadata[user_id]': user.id,
        'metadata[service_type]': serviceType,
        'metadata[user_phone]': userPhone || '',
        'metadata[barber_id]': barberId,
      }),
    })

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text()
      console.error('Stripe API error:', errorText)
      return new Response(
        JSON.stringify({ error: 'Payment processing failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const session = await stripeResponse.json()
    console.log('Payment session created successfully:', session.id)

    // Store payment record with user validation
    const { error: dbError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user.id,
        amount,
        currency,
        service_type: serviceType,
        stripe_session_id: session.id,
        status: 'pending'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue anyway as Stripe session is created
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
