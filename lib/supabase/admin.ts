import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Accept either name for the service-role secret. Supabase's newer key format calls
// it the "secret key" (SUPABASE_SECRET_KEY); the classic name is SUPABASE_SERVICE_ROLE_KEY.
// Reading both means the deployment works regardless of which name is set in the host env.
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

/**
 * Service-role client for server-only code (API routes). Bypasses RLS, so it must
 * never be imported into a "use client" component or exposed to the browser.
 */
export function createAdminClient() {
  return createSupabaseClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
