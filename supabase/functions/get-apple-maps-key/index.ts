
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('get-apple-maps-key: Function called')
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    console.log('get-apple-maps-key: Creating Supabase client')
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the Authorization header
    const authHeader = req.headers.get('Authorization')
    console.log('get-apple-maps-key: Auth header present:', !!authHeader)
    
    if (!authHeader) {
      console.log('get-apple-maps-key: No authorization header')
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    console.log('get-apple-maps-key: User verification result:', { 
      hasUser: !!user, 
      userError: userError?.message 
    })

    if (userError || !user) {
      console.log('get-apple-maps-key: User verification failed')
      return new Response(
        JSON.stringify({ error: 'Unauthorized: ' + (userError?.message || 'Invalid token') }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the Apple Maps API key from environment
    const appleApiKey = Deno.env.get('APPLE_MAPS_API_KEY')
    console.log('get-apple-maps-key: Apple API key present:', !!appleApiKey)

    if (!appleApiKey) {
      console.log('get-apple-maps-key: No Apple Maps API key configured')
      return new Response(
        JSON.stringify({ error: 'Apple Maps API key not configured' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('get-apple-maps-key: Returning API key successfully')
    return new Response(
      JSON.stringify({ apiKey: appleApiKey }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('get-apple-maps-key: Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
