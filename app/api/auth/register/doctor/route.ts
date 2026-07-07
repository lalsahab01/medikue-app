import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { isValidPhone, isValidPassword } from "@/lib/auth/validate";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, phone, password, specialization, qualification, invite_code } = body ?? {};

  if (
    !name || typeof name !== "string" ||
    !specialization || typeof specialization !== "string" ||
    !isValidPhone(phone) || !isValidPassword(password) ||
    !invite_code || typeof invite_code !== "string"
  ) {
    return NextResponse.json(
      { error: "Enter your name, specialization, a valid 10-digit mobile number, a password of at least 6 characters, and your clinic's invite code." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: existingCred } = await supabase
    .from("app_credentials")
    .select("id")
    .eq("login_id", phone)
    .maybeSingle();
  if (existingCred) {
    return NextResponse.json({ error: "An account with this mobile number already exists. Try logging in." }, { status: 409 });
  }

  const { data: invite } = await supabase
    .from("clinic_invite_codes")
    .select("id, clinic_id, active, role")
    .eq("code", invite_code.trim())
    .maybeSingle();
  if (!invite || !invite.active || invite.role !== "doctor") {
    return NextResponse.json({ error: "Invalid or inactive clinic invite code. Ask your clinic admin for the correct code." }, { status: 400 });
  }

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .insert({
      clinic_id: invite.clinic_id,
      name,
      specialization,
      qualification: qualification || "MBBS",
    })
    .select("id")
    .single();
  if (doctorError || !doctor) {
    return NextResponse.json({ error: "Could not create doctor record." }, { status: 500 });
  }

  const { hash, salt } = await hashPassword(password);
  const { data: cred, error: credError } = await supabase
    .from("app_credentials")
    .insert({
      login_id: phone,
      name,
      password_hash: hash,
      password_salt: salt,
      role: "doctor",
      clinic_id: invite.clinic_id,
      doctor_id: doctor.id,
    })
    .select("id")
    .single();
  if (credError || !cred) {
    return NextResponse.json({ error: "Could not create login credentials." }, { status: 500 });
  }

  await setSessionCookie({ credId: cred.id, loginId: phone, role: "doctor", clinicId: invite.clinic_id, name });

  return NextResponse.json({ ok: true, role: "doctor" });
}
