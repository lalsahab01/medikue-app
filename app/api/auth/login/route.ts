import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie, roleHomePath, Role } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { login_id, password } = body ?? {};

  if (!login_id || typeof login_id !== "string" || !password || typeof password !== "string") {
    return NextResponse.json({ error: "Enter your ID and password." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: cred, error: dbError } = await supabase
    .from("app_credentials")
    .select("id, name, password_hash, password_salt, role, status, clinic_id")
    .eq("login_id", login_id.trim())
    .maybeSingle();

  if (dbError) {
    console.error("auth/login db error:", dbError.message);
    return NextResponse.json({ error: "Server error - has the database migration been run yet?" }, { status: 500 });
  }

  if (!cred || cred.status !== "active") {
    return NextResponse.json({ error: "Invalid ID or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, cred.password_hash, cred.password_salt);
  if (!valid) {
    return NextResponse.json({ error: "Invalid ID or password." }, { status: 401 });
  }

  const role = cred.role as Role;
  await setSessionCookie({
    credId: cred.id,
    loginId: login_id.trim(),
    role,
    clinicId: cred.clinic_id,
    name: cred.name,
  });

  return NextResponse.json({ ok: true, role, redirect: roleHomePath(role) });
}
