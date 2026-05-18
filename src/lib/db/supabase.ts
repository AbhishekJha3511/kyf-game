import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Defensive verification block: Ensure the environment runtime is properly configured
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "[Database Error] Critical connection environment variables are missing. " +
    "Verify NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY inside your local configuration env."
  );
}

/**
 * Singleton server-side Supabase client wrapper.
 * Initialized via the high-privilege Service Role token to safely process data mutations
 * exclusively inside protected Next.js Server contexts.
 */
export const db = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false, // Bypasses client cookie tracking overhead for stateless operations
    autoRefreshToken: false,
  },
});