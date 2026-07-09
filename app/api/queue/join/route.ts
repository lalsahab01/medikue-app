import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidPhone } from "@/lib/auth/validate";
import { DEFAULT_CLINIC_ID, ACTIVE_QUEUE_STATUSES, startOfToday } from "@/lib/constants";

// Public: a patient joins a doctor's queue. The token number is computed on the
// server (never trusted from the client), scoped to the clinic and the current day.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { doctor_id, name, phone, reason } = body ?? {};
  const clinicId = (body?.clinic_id as string) || DEFAULT_CLINIC_ID;

  if (!doctor_id || typeof doctor_id !== "string") {
    return NextResponse.json({ error: "Please choose a doctor." }, { status: 400 });
  }
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Enter the patient's full name." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ error: "Enter a valid 10-digit mobile number." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Doctor must exist and belong to this clinic.
  const { data: doctor } = await supabase
    .from("doctors")
    .select("id, clinic_id, slot_duration_minutes")
    .eq("id", doctor_id)
    .maybeSingle();
  if (!doctor || doctor.clinic_id !== clinicId) {
    return NextResponse.json({ error: "That doctor is not available at this clinic." }, { status: 400 });
  }

  // Find-or-create a lightweight patient record (keyed by phone within the clinic).
  const { data: existingPatient } = await supabase
    .from("patients")
    .select("id")
    .eq("clinic_id", clinicId)
    .eq("phone", phone)
    .maybeSingle();

  let patientId = existingPatient?.id ?? null;
  if (!patientId) {
    const { data: newPatient } = await supabase
      .from("patients")
      .insert({ clinic_id: clinicId, name: name.trim(), phone })
      .select("id")
      .single();
    patientId = newPatient?.id ?? null;
  }

  // Next token for this clinic today.
  const { data: lastToken } = await supabase
    .from("queue_entries")
    .select("token_number")
    .eq("clinic_id", clinicId)
    .gte("created_at", startOfToday())
    .order("token_number", { ascending: false })
    .limit(1)
    .maybeSingle();
  const tokenNumber = (lastToken?.token_number ?? 0) + 1;

  // Patients currently ahead of this one on this doctor's list.
  const { count: aheadCount } = await supabase
    .from("queue_entries")
    .select("id", { count: "exact", head: true })
    .eq("clinic_id", clinicId)
    .eq("doctor_id", doctor_id)
    .gte("created_at", startOfToday())
    .in("status", ACTIVE_QUEUE_STATUSES as unknown as string[]);

  const estimatedWait = (aheadCount ?? 0) * (doctor.slot_duration_minutes ?? 15);

  const { data: entry, error: insertError } = await supabase
    .from("queue_entries")
    .insert({
      clinic_id: clinicId,
      doctor_id,
      patient_id: patientId,
      patient_name: name.trim(),
      patient_phone: phone,
      token_number: tokenNumber,
      reason: reason?.trim() || null,
      estimated_wait_minutes: estimatedWait,
      status: "waiting",
    })
    .select("id, token_number, clinic_id, doctor_id")
    .single();

  if (insertError || !entry) {
    return NextResponse.json({ error: "Could not join the queue. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    entry_id: entry.id,
    token_number: entry.token_number,
    clinic_id: entry.clinic_id,
    doctor_id: entry.doctor_id,
    patients_ahead: aheadCount ?? 0,
    estimated_wait_minutes: estimatedWait,
  });
}
