import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_CLINIC_ID, ACTIVE_QUEUE_STATUSES, startOfToday } from "@/lib/constants";

// Public: a patient checks their live position by token number (no login required).
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const clinicId = params.get("clinic_id") || DEFAULT_CLINIC_ID;
  const tokenParam = params.get("token");
  const entryId = params.get("id");

  if (!tokenParam && !entryId) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("queue_entries")
    .select("id, token_number, patient_name, status, doctor_id, reason, estimated_wait_minutes, created_at, doctors(name, specialization, slot_duration_minutes)")
    .eq("clinic_id", clinicId)
    .gte("created_at", startOfToday());

  query = entryId ? query.eq("id", entryId) : query.eq("token_number", Number(tokenParam));

  const { data: entry, error } = await query.maybeSingle();
  if (error) {
    return NextResponse.json({ error: "Could not load queue status." }, { status: 500 });
  }
  if (!entry) {
    return NextResponse.json({ error: "No active token found. It may have been for a previous day." }, { status: 404 });
  }

  // Currently-serving token and patients ahead, for this entry's doctor.
  const { data: serving } = await supabase
    .from("queue_entries")
    .select("token_number, patient_name")
    .eq("clinic_id", clinicId)
    .eq("doctor_id", entry.doctor_id)
    .eq("status", "with_doctor")
    .gte("created_at", startOfToday())
    .order("called_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let patientsAhead = 0;
  if (entry.status === "waiting" || entry.status === "called") {
    const { count } = await supabase
      .from("queue_entries")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .eq("doctor_id", entry.doctor_id)
      .gte("created_at", startOfToday())
      .in("status", ACTIVE_QUEUE_STATUSES as unknown as string[])
      .lt("token_number", entry.token_number);
    patientsAhead = count ?? 0;
  }

  return NextResponse.json({
    entry,
    now_serving: serving?.token_number ?? null,
    patients_ahead: patientsAhead,
  });
}
