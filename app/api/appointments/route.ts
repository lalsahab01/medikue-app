import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";
import { isValidPhone } from "@/lib/auth/validate";
import { DEFAULT_CLINIC_ID } from "@/lib/constants";

// Staff/Doctor/Admin: list appointments for a clinic (optionally filtered by date).
export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const clinicId = session.clinicId || req.nextUrl.searchParams.get("clinic_id") || DEFAULT_CLINIC_ID;
  const date = req.nextUrl.searchParams.get("date");

  const supabase = createAdminClient();
  let query = supabase
    .from("appointments")
    .select("id, patient_name, patient_phone, appointment_date, slot_time, status, reason, doctor_id, doctors(name, specialization)")
    .eq("clinic_id", clinicId)
    .order("appointment_date", { ascending: true })
    .order("slot_time", { ascending: true })
    .limit(100);
  if (date) query = query.eq("appointment_date", date);

  const { data, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: "Could not load appointments." }, { status: 500 });
  return NextResponse.json({ appointments: data });
}

// Public: a patient books an appointment slot.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { doctor_id, name, phone, appointment_date, slot_time, reason } = body ?? {};
  const clinicId = (body?.clinic_id as string) || DEFAULT_CLINIC_ID;

  if (!doctor_id || !name || typeof name !== "string" || !isValidPhone(phone) || !appointment_date || !slot_time) {
    return NextResponse.json(
      { error: "Choose a doctor, date and time, and enter a name and valid 10-digit mobile number." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: doctor } = await supabase
    .from("doctors")
    .select("id, clinic_id")
    .eq("id", doctor_id)
    .maybeSingle();
  if (!doctor || doctor.clinic_id !== clinicId) {
    return NextResponse.json({ error: "That doctor is not available at this clinic." }, { status: 400 });
  }

  const { data, error: dbError } = await supabase
    .from("appointments")
    .insert({
      clinic_id: clinicId,
      doctor_id,
      patient_name: name.trim(),
      patient_phone: phone,
      appointment_date,
      slot_time,
      reason: reason?.trim() || null,
      status: "scheduled",
    })
    .select("id, appointment_date, slot_time")
    .single();

  if (dbError || !data) return NextResponse.json({ error: "Could not book the appointment." }, { status: 500 });
  return NextResponse.json({ ok: true, appointment: data });
}
