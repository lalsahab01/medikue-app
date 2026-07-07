import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";

export async function GET() {
  const { error } = await requireRole(["admin"]);
  if (error) return error;

  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("clinic_invite_codes")
    .select("id, code, role, active, created_at, clinic_id, clinics(name)")
    .order("created_at", { ascending: false });
  if (dbError) return NextResponse.json({ error: "Could not load invite codes." }, { status: 500 });

  return NextResponse.json({ codes: data });
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(["admin"]);
  if (error) return error;

  const body = await req.json().catch(() => null);
  const { clinic_id, role } = body ?? {};
  if (!clinic_id || (role !== "doctor" && role !== "staff")) {
    return NextResponse.json({ error: "Choose a clinic and a role (doctor or staff)." }, { status: 400 });
  }

  const code = `MEDIKUE-${randomBytes(4).toString("hex").toUpperCase()}`;
  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("clinic_invite_codes")
    .insert({ clinic_id, role, code, created_by: session.credId })
    .select("id, code, role")
    .single();
  if (dbError || !data) return NextResponse.json({ error: "Could not create invite code." }, { status: 500 });

  return NextResponse.json({ invite: data });
}
