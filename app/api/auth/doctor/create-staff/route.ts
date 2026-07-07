import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/auth/password";
import { requireRole } from "@/lib/auth/require";
import { isValidPhone, isValidPassword } from "@/lib/auth/validate";

// A doctor can create a clinical-staff login scoped to their own clinic (no admin needed).
export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(["doctor"]);
  if (error) return error;
  if (!session.clinicId) {
    return NextResponse.json({ error: "Your account isn't linked to a clinic." }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  const { name, phone, password, staff_role } = body ?? {};

  if (!name || !isValidPhone(phone) || !isValidPassword(password)) {
    return NextResponse.json(
      { error: "Enter a valid name, 10-digit mobile number, and a password of at least 6 characters." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase.from("app_credentials").select("id").eq("login_id", phone).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "An account with this mobile number already exists." }, { status: 409 });
  }

  const { data: staff, error: staffError } = await supabase
    .from("staff_profiles")
    .insert({ clinic_id: session.clinicId, name, phone, role: staff_role || "receptionist" })
    .select("id")
    .single();
  if (staffError || !staff) return NextResponse.json({ error: "Could not create staff record." }, { status: 500 });

  const { hash, salt } = await hashPassword(password);
  const { error: credError } = await supabase.from("app_credentials").insert({
    login_id: phone,
    name,
    password_hash: hash,
    password_salt: salt,
    role: "staff",
    clinic_id: session.clinicId,
    staff_id: staff.id,
    created_by: session.credId,
  });
  if (credError) return NextResponse.json({ error: "Could not create login credentials." }, { status: 500 });

  return NextResponse.json({ ok: true, login_id: phone });
}
