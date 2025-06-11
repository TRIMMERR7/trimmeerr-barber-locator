
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export const validateAuthentication = async (authHeader: string | null) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized - missing token");
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
  
  if (userError || !userData.user) {
    throw new Error("Unauthorized - invalid token");
  }

  return { userData, supabaseClient };
};

export const validateUserPermissions = (requestingUserId: string, targetBarberId: string) => {
  if (requestingUserId !== targetBarberId) {
    throw new Error("Unauthorized - cannot create account for another user");
  }
};
