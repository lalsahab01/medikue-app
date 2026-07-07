import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/require";

// PAYMENTS_MODE=dummy: no real payment gateway is wired up yet, so every payment is
// recorded as immediately "completed" (e.g. cash/manual collection at the counter).
// Swap this for a real gateway (Razorpay etc.) by creating an order here, returning
// its id to the client, and only marking the row "completed" once the gateway's
// webhook confirms payment.
export async function GET(req: NextRequest) {
  const { error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const clinicId = req.nextUrl.searchParams.get("clinic_id");
  const supabase = createAdminClient();
  let query = supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(50);
  if (clinicId) query = query.eq("clinic_id", clinicId);

  const { data, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: "Could not load payments." }, { status: 500 });

  return NextResponse.json({ payments: data });
}

export async function POST(req: NextRequest) {
  const { error } = await requireRole(["doctor", "staff", "admin"]);
  if (error) return error;

  const body = await req.json().catch(() => null);
  const { clinic_id, patient_id, patient_name, amount, method, appointment_id, queue_entry_id, notes } = body ?? {};

  if (!clinic_id || !patient_name || !amount || !method) {
    return NextResponse.json({ error: "clinic_id, patient_name, amount, and method are required." }, { status: 400 });
  }

  const dummyMode = process.env.PAYMENTS_MODE !== "live";

  const supabase = createAdminClient();
  const { data, error: dbError } = await supabase
    .from("payments")
    .insert({
      clinic_id,
      patient_id: patient_id || null,
      patient_name,
      amount,
      method,
      appointment_id: appointment_id || null,
      queue_entry_id: queue_entry_id || null,
      notes: notes || null,
      status: dummyMode ? "completed" : "pending",
    })
    .select("*")
    .single();
  if (dbError || !data) return NextResponse.json({ error: "Could not record payment." }, { status: 500 });

  return NextResponse.json({ payment: data, dummy: dummyMode });
}
