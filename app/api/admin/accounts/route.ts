import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";

export async function GET() {
  const { error } = await requireRole(["admin"]);
  if (error) return error;

  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("app_credentials")
    .select("id, login_id, name, role, status, clinic_id, created_at, clinics(name)")
    .neq("role", "patient")
    .order("created_at", { ascending: false });
  if (dbError) return NextResponse.json({ error: "Could not load accounts." }, { status: 500 });

  return NextResponse.json({ accounts: data });
}
