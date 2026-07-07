import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/auth/password";
import { requireRole } from "@/lib/auth/require";
import { isValidPhone, isValidPassword } from "@/lib/auth/validate";

// Admin creates a doctor or staff login directly (no self-registration/invite code needed).
export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(["admin"]);
  if (error) return error;

  const body = await req.json().catch(() => null);
  const { role, name, phone, password, clinic_id, specialization, qualification, staff_role } = body ?? {};

  if (!isValidPhone(phone) || !isValidPassword(password) || !name || !clinic_id || (role !== "doctor" && role !== "staff")) {
    return NextResponse.json(
      { error: "Enter a valid name, 10-digit mobile number, password (6+ chars), clinic, and role (doctor or staff)." },
      { status: 400 }
    );
  }
  if (role === "doctor" && !specialization) {
    return NextResponse.json({ error: "Specialization is required for a doctor account." }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase.from("app_credentials").select("id").eq("login_id", phone).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "An account with this mobile number already exists." }, { status: 409 });
  }

  let doctorId: string | null = null;
  let staffId: string | null = null;

  if (role === "doctor") {
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .insert({ clinic_id, name, specialization, qualification: qualification || "MBBS" })
      .select("id")
      .single();
    if (doctorError || !doctor) return NextResponse.json({ error: "Could not create doctor record." }, { status: 500 });
    doctorId = doctor.id;
  } else {
    const { data: staff, error: staffError } = await supabase
      .from("staff_profiles")
      .insert({ clinic_id, name, phone, role: staff_role || "receptionist" })
      .select("id")
      .single();
    if (staffError || !staff) return NextResponse.json({ error: "Could not create staff record." }, { status: 500 });
    staffId = staff.id;
  }

  const { hash, salt } = await hashPassword(password);
  const { data: cred, error: credError } = await supabase
    .from("app_credentials")
    .insert({
      login_id: phone,
      name,
      password_hash: hash,
      password_salt: salt,
      role,
      clinic_id,
      doctor_id: doctorId,
      staff_id: staffId,
      created_by: session.credId,
    })
    .select("id")
    .single();
  if (credError || !cred) return NextResponse.json({ error: "Could not create login credentials." }, { status: 500 });

  return NextResponse.json({ ok: true, login_id: phone });
}
