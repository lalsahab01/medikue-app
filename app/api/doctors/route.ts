import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_CLINIC_ID, ACTIVE_QUEUE_STATUSES, startOfToday } from "@/lib/constants";

// Public: list doctors for a clinic with a live "patients ahead" count and a rough
// wait estimate (based on each doctor's slot duration). Used by the patient doctor list.
export async function GET(req: NextRequest) {
  const clinicId = req.nextUrl.searchParams.get("clinic_id") || DEFAULT_CLINIC_ID;
  const supabase = createAdminClient();

  const { data: doctors, error } = await supabase
    .from("doctors")
    .select("id, name, specialization, qualification, experience_years, consultation_fee, is_available, photo_url, slot_duration_minutes")
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Could not load doctors." }, { status: 500 });
  }

  // Count today's still-active queue entries per doctor in one query.
  const { data: active } = await supabase
    .from("queue_entries")
    .select("doctor_id, status")
    .eq("clinic_id", clinicId)
    .gte("created_at", startOfToday())
    .in("status", ACTIVE_QUEUE_STATUSES as unknown as string[]);

  const aheadByDoctor = new Map<string, number>();
  for (const row of active ?? []) {
    aheadByDoctor.set(row.doctor_id, (aheadByDoctor.get(row.doctor_id) ?? 0) + 1);
  }

  const result = (doctors ?? []).map((d) => {
    const ahead = aheadByDoctor.get(d.id) ?? 0;
    const waitMinutes = ahead * (d.slot_duration_minutes ?? 15);
    return { ...d, tokens_ahead: ahead, estimated_wait_minutes: waitMinutes };
  });

  return NextResponse.json({ doctors: result });
}
