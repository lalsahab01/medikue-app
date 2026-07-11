import { NextResponse } from "next/server";

// TEMPORARY diagnostic — reports whether env vars are reaching the running process.
// Never exposes secret values, only presence + a short non-sensitive prefix. Remove after use.
export async function GET() {
  const show = (v: string | undefined) => (v ? `${v.slice(0, 6)}…(${v.length})` : null);
  return NextResponse.json({
    node_env: process.env.NODE_ENV ?? null,
    has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_url: show(process.env.NEXT_PUBLIC_SUPABASE_URL),
    has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    anon_key_prefix: show(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    has_service_role_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    service_key_prefix: show(process.env.SUPABASE_SERVICE_ROLE_KEY),
    has_session_secret: !!process.env.SESSION_SECRET,
    session_secret_len: process.env.SESSION_SECRET?.length ?? 0,
    payments_mode: process.env.PAYMENTS_MODE ?? null,
  });
}
