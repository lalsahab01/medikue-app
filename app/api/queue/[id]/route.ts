import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";

const ALLOWED_STATUSES = ["waiting", "called", "with_doctor", "done", "skipped", "cancelled"] as const;
type QueueStatus = (typeof ALLOWED_STATUSES)[number];

// Staff/Doctor/Admin: advance a queue entry (call, start, complete, skip, cancel).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { session, error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status as QueueStatus | undefined;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Confirm the entry exists and (for non-admins) belongs to the caller's clinic.
  const { data: entry } = await supabase
    .from("queue_entries")
    .select("id, clinic_id, called_at")
    .eq("id", id)
    .maybeSingle();
  if (!entry) return NextResponse.json({ error: "Queue entry not found." }, { status: 404 });
  if (session.clinicId && entry.clinic_id !== session.clinicId) {
    return NextResponse.json({ error: "That patient is not in your clinic's queue." }, { status: 403 });
  }

  const patch: Record<string, unknown> = { status };
  if ((status === "called" || status === "with_doctor") && !entry.called_at) {
    patch.called_at = new Date().toISOString();
  }
  if (status === "done") patch.done_at = new Date().toISOString();

  const { data: updated, error: dbError } = await supabase
    .from("queue_entries")
    .update(patch)
    .eq("id", id)
    .select("id, token_number, status, called_at, done_at")
    .single();

  if (dbError || !updated) return NextResponse.json({ error: "Could not update the queue entry." }, { status: 500 });

  return NextResponse.json({ ok: true, entry: updated });
}
