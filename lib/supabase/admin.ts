import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client for server-only code (API routes). Bypasses RLS, so it must
 * never be imported into a "use client" component or exposed to the browser.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
