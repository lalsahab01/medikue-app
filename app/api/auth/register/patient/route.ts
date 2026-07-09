import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidPhone } from "@/lib/auth/validate";
import { DEFAULT_CLINIC_ID } from "@/lib/constants";

// Public, passwordless patient registration (MVP). Patients do not get a login —
// they are identified by phone within a clinic. This creates/updates their record so
// staff can see them; the browser keeps a lightweight copy for the profile screen.
//
// FUTURE: when Supabase Phone-OTP is enabled, verify the number here and attach the
// resulting auth user id to this patient row — no other flow needs to change.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, phone, age, gender, blood_group } = body ?? {};
  const clinicId = (body?.clinic_id as string) || DEFAULT_CLINIC_ID;

  if (!name || typeof name !== "string" || !isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Enter your name and a valid 10-digit mobile number." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  // Idempotent by (clinic, phone): update the existing record or create a new one.
  const { data: existing } = await supabase
    .from("patients")
    .select("id")
    .eq("clinic_id", clinicId)
    .eq("phone", phone)
    .maybeSingle();

  const fields = {
    clinic_id: clinicId,
    name: name.trim(),
    phone,
    age: age ? Number(age) : null,
    gender: gender || null,
    blood_group: blood_group || null,
  };

  const result = existing
    ? await supabase.from("patients").update(fields).eq("id", existing.id).select("id").single()
    : await supabase.from("patients").insert(fields).select("id").single();

  if (result.error || !result.data) {
    return NextResponse.json({ error: "Could not save your registration." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, patient_id: result.data.id });
}
