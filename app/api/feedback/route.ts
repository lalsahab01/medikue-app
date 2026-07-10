import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_CLINIC_ID } from "@/lib/constants";

// Public: a patient rates their visit.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { rating, comment, patient_name, doctor_id, queue_entry_id } = body ?? {};
  const clinicId = (body?.clinic_id as string) || DEFAULT_CLINIC_ID;

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return NextResponse.json({ error: "Please give a rating between 1 and 5." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("feedback").insert({
    clinic_id: clinicId,
    patient_name: (patient_name as string)?.trim() || "Anonymous",
    doctor_id: doctor_id || null,
    queue_entry_id: queue_entry_id || null,
    rating: numericRating,
    comment: (comment as string)?.trim() || null,
  });

  if (error) return NextResponse.json({ error: "Could not submit feedback." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
