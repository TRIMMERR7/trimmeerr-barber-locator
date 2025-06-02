
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, serviceName, barberName, appointmentTime, amount, userPhone } = await req.json();

    console.log("Sending booking confirmation to:", email);

    // Send email confirmation
    const emailResponse = await resend.emails.send({
      from: "TRIMMERR <onboarding@resend.dev>",
      to: [email],
      subject: "Appointment Confirmed - TRIMMERR",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626; text-align: center;">Appointment Confirmed!</h1>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Booking Details</h2>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Barber:</strong> ${barberName}</p>
            <p><strong>Date & Time:</strong> ${appointmentTime}</p>
            <p><strong>Amount Paid:</strong> $${(amount / 100).toFixed(2)}</p>
          </div>
          <p>Thank you for choosing TRIMMERR! Your appointment has been confirmed and payment processed successfully.</p>
          <p style="color: #6b7280; font-size: 14px;">We'll send you a reminder 1 hour before your appointment.</p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #dc2626; font-weight: bold;">TRIMMERR</p>
            <p style="color: #6b7280; font-size: 12px;">Your trusted barber booking platform</p>
          </div>
        </div>
      `,
    });

    // Send SMS confirmation if phone number provided
    let smsResponse = null;
    if (userPhone) {
      try {
        const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
        const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
        const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

        if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
          const smsBody = `TRIMMERR: Your ${serviceName} appointment with ${barberName} at ${appointmentTime} is confirmed! Amount paid: $${(amount / 100).toFixed(2)}. Thank you!`;
          
          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
          const smsData = new URLSearchParams({
            To: userPhone,
            From: twilioPhoneNumber,
            Body: smsBody
          });

          const smsResult = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: smsData
          });

          if (smsResult.ok) {
            smsResponse = await smsResult.json();
            console.log("SMS sent successfully:", smsResponse.sid);
          } else {
            console.error("SMS sending failed:", await smsResult.text());
          }
        }
      } catch (smsError) {
        console.error("SMS error:", smsError);
      }
    }

    return new Response(JSON.stringify({ 
      emailSent: !!emailResponse,
      smsSent: !!smsResponse,
      emailId: emailResponse?.id,
      smsId: smsResponse?.sid
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Confirmation sending error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
