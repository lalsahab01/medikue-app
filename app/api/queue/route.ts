import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";
import { DEFAULT_CLINIC_ID, startOfToday } from "@/lib/constants";

// Staff/Doctor/Admin: today's queue for a clinic. Doctors and staff are always scoped
// to their own clinic; an admin may pass ?clinic_id= to view any clinic.
export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const clinicId = session.clinicId || req.nextUrl.searchParams.get("clinic_id") || DEFAULT_CLINIC_ID;
  const doctorId = req.nextUrl.searchParams.get("doctor_id");

  const supabase = createAdminClient();
  let query = supabase
    .from("queue_entries")
    .select("id, token_number, patient_name, patient_phone, status, reason, doctor_id, estimated_wait_minutes, called_at, done_at, created_at, doctors(name, specialization)")
    .eq("clinic_id", clinicId)
    .gte("created_at", startOfToday())
    .order("token_number", { ascending: true });
  if (doctorId) query = query.eq("doctor_id", doctorId);

  const { data, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: "Could not load the queue." }, { status: 500 });

  return NextResponse.json({ queue: data, clinic_id: clinicId });
}
