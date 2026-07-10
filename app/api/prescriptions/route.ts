import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";
import { DEFAULT_CLINIC_ID } from "@/lib/constants";

interface MedicationInput {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}

// Staff/Doctor/Admin: recent prescriptions for the clinic.
export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const clinicId = session.clinicId || req.nextUrl.searchParams.get("clinic_id") || DEFAULT_CLINIC_ID;
  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("prescriptions")
    .select("id, patient_name, diagnosis, notes, follow_up_date, created_at, medications(name, dosage, frequency, duration, instructions)")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (dbError) return NextResponse.json({ error: "Could not load prescriptions." }, { status: 500 });
  return NextResponse.json({ prescriptions: data });
}

// Doctor only: write a prescription (with its medications) for a patient.
export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(["doctor"]);
  if (error) return error;

  const body = await req.json().catch(() => null);
  const { patient_name, patient_id, queue_entry_id, diagnosis, notes, follow_up_date, medications } = body ?? {};

  if (!patient_name || typeof patient_name !== "string" || !diagnosis || typeof diagnosis !== "string") {
    return NextResponse.json({ error: "Patient name and diagnosis are required." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Resolve the doctor's own doctor_id from their credential.
  const { data: cred } = await supabase
    .from("app_credentials")
    .select("doctor_id, clinic_id")
    .eq("id", session.credId)
    .maybeSingle();
  if (!cred?.doctor_id || !cred.clinic_id) {
    return NextResponse.json({ error: "Your account isn't linked to a doctor profile." }, { status: 400 });
  }

  const { data: prescription, error: pError } = await supabase
    .from("prescriptions")
    .insert({
      clinic_id: cred.clinic_id,
      doctor_id: cred.doctor_id,
      patient_id: patient_id || null,
      patient_name: patient_name.trim(),
      queue_entry_id: queue_entry_id || null,
      diagnosis: diagnosis.trim(),
      notes: notes?.trim() || null,
      follow_up_date: follow_up_date || null,
    })
    .select("id")
    .single();

  if (pError || !prescription) {
    return NextResponse.json({ error: "Could not save the prescription." }, { status: 500 });
  }

  const meds = (Array.isArray(medications) ? medications : [])
    .filter((m: MedicationInput) => m?.name && m?.dosage && m?.frequency && m?.duration)
    .map((m: MedicationInput) => ({
      prescription_id: prescription.id,
      name: m.name!.trim(),
      dosage: m.dosage!.trim(),
      frequency: m.frequency!.trim(),
      duration: m.duration!.trim(),
      instructions: m.instructions?.trim() || null,
    }));

  if (meds.length > 0) {
    const { error: mError } = await supabase.from("medications").insert(meds);
    if (mError) {
      return NextResponse.json({ error: "Prescription saved, but medications failed to save." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, prescription_id: prescription.id, medications_saved: meds.length });
}
