import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";
import { DEFAULT_CLINIC_ID, startOfToday } from "@/lib/constants";

// Staff/Doctor/Admin: today's operational summary for a clinic.
export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const clinicId = session.clinicId || req.nextUrl.searchParams.get("clinic_id") || DEFAULT_CLINIC_ID;
  const since = startOfToday();
  const supabase = createAdminClient();

  const [{ data: queue }, { data: payments }, { data: appts }] = await Promise.all([
    supabase.from("queue_entries").select("status, called_at, done_at").eq("clinic_id", clinicId).gte("created_at", since),
    supabase.from("payments").select("amount, status").eq("clinic_id", clinicId).gte("created_at", since),
    supabase.from("appointments").select("status").eq("clinic_id", clinicId).eq("appointment_date", since.slice(0, 10)),
  ]);

  const q = queue ?? [];
  const waiting = q.filter((e) => e.status === "waiting" || e.status === "called").length;
  const withDoctor = q.filter((e) => e.status === "with_doctor").length;
  const done = q.filter((e) => e.status === "done").length;
  const skipped = q.filter((e) => e.status === "skipped" || e.status === "cancelled").length;

  // Average consult wait (called_at -> done_at) across completed entries, in minutes.
  const completed = q.filter((e) => e.called_at && e.done_at);
  const avgWait =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, e) => sum + (new Date(e.done_at!).getTime() - new Date(e.called_at!).getTime()), 0) /
            completed.length /
            60000
        )
      : 0;

  const revenue = (payments ?? [])
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  return NextResponse.json({
    report: {
      clinic_id: clinicId,
      total_tokens: q.length,
      waiting,
      with_doctor: withDoctor,
      done,
      skipped,
      appointments: (appts ?? []).length,
      revenue,
      avg_consult_minutes: avgWait,
    },
  });
}
