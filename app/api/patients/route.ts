import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";
import { isValidPhone } from "@/lib/auth/validate";
import { DEFAULT_CLINIC_ID } from "@/lib/constants";

// Staff/Doctor/Admin: list patients for the clinic.
export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const clinicId = session.clinicId || req.nextUrl.searchParams.get("clinic_id") || DEFAULT_CLINIC_ID;
  const search = req.nextUrl.searchParams.get("q")?.trim();

  const supabase = createAdminClient();
  let query = supabase
    .from("patients")
    .select("id, name, phone, age, gender, blood_group, created_at")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%`);

  const { data, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: "Could not load patients." }, { status: 500 });

  return NextResponse.json({ patients: data });
}

// Staff/Doctor/Admin: register a walk-in patient at the counter.
export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const body = await req.json().catch(() => null);
  const { name, phone, age, gender, blood_group } = body ?? {};
  const clinicId = session.clinicId || body?.clinic_id || DEFAULT_CLINIC_ID;

  if (!name || typeof name !== "string" || !isValidPhone(phone)) {
    return NextResponse.json({ error: "Enter a name and a valid 10-digit mobile number." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("patients")
    .insert({
      clinic_id: clinicId,
      name: name.trim(),
      phone,
      age: age ? Number(age) : null,
      gender: gender || null,
      blood_group: blood_group || null,
    })
    .select("id, name, phone")
    .single();

  if (dbError || !data) return NextResponse.json({ error: "Could not create patient." }, { status: 500 });

  return NextResponse.json({ patient: data });
}
