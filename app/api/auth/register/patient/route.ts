import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { isValidPhone, isValidPassword } from "@/lib/auth/validate";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, phone, password, age, gender, blood_group } = body ?? {};

  if (!name || typeof name !== "string" || !isValidPhone(phone) || !isValidPassword(password)) {
    return NextResponse.json(
      { error: "Enter your name, a valid 10-digit mobile number, and a password of at least 6 characters." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("app_credentials")
    .select("id")
    .eq("login_id", phone)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "An account with this mobile number already exists. Try logging in." }, { status: 409 });
  }

  const { data: patient, error: patientError } = await supabase
    .from("patients")
    .insert({ name, phone, age: age || null, gender: gender || null, blood_group: blood_group || null })
    .select("id")
    .single();
  if (patientError || !patient) {
    return NextResponse.json({ error: "Could not create patient record." }, { status: 500 });
  }

  const { hash, salt } = await hashPassword(password);
  const { data: cred, error: credError } = await supabase
    .from("app_credentials")
    .insert({
      login_id: phone,
      name,
      password_hash: hash,
      password_salt: salt,
      role: "patient",
      patient_id: patient.id,
    })
    .select("id")
    .single();
  if (credError || !cred) {
    return NextResponse.json({ error: "Could not create login credentials." }, { status: 500 });
  }

  await setSessionCookie({ credId: cred.id, loginId: phone, role: "patient", clinicId: null, name });

  return NextResponse.json({ ok: true, role: "patient" });
}
