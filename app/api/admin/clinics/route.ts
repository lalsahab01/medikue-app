import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";

export async function GET() {
  const { error } = await requireRole(["admin"]);
  if (error) return error;

  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("clinics")
    .select("id, name, address, city, phone, created_at")
    .order("created_at", { ascending: true });
  if (dbError) return NextResponse.json({ error: "Could not load clinics." }, { status: 500 });

  return NextResponse.json({ clinics: data });
}

export async function POST(req: NextRequest) {
  const { error } = await requireRole(["admin"]);
  if (error) return error;

  const body = await req.json().catch(() => null);
  const { name, address, city, phone } = body ?? {};
  if (!name || !address || !phone) {
    return NextResponse.json({ error: "Enter clinic name, address, and phone." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("clinics")
    .insert({ name, address, city: city || "Delhi", phone })
    .select("id, name")
    .single();
  if (dbError || !data) return NextResponse.json({ error: "Could not create clinic." }, { status: 500 });

  return NextResponse.json({ clinic: data });
}
