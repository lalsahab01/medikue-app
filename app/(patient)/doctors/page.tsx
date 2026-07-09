import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEFAULT_CLINIC_ID, ACTIVE_QUEUE_STATUSES, startOfToday } from "@/lib/constants";

export const dynamic = "force-dynamic";

type DoctorCard = {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  consultation_fee: number;
  is_available: boolean;
  slot_duration_minutes: number;
  tokens_ahead: number;
  wait_label: string;
};

async function getDoctors(clinicId: string): Promise<DoctorCard[]> {
  const supabase = createAdminClient();
  const [{ data: doctors }, { data: active }] = await Promise.all([
    supabase
      .from("doctors")
      .select("id, name, specialization, qualification, experience_years, consultation_fee, is_available, slot_duration_minutes")
      .eq("clinic_id", clinicId)
      .order("created_at", { ascending: true }),
    supabase
      .from("queue_entries")
      .select("doctor_id")
      .eq("clinic_id", clinicId)
      .gte("created_at", startOfToday())
      .in("status", ACTIVE_QUEUE_STATUSES as unknown as string[]),
  ]);

  const ahead = new Map<string, number>();
  for (const row of active ?? []) ahead.set(row.doctor_id, (ahead.get(row.doctor_id) ?? 0) + 1);

  return (doctors ?? []).map((d) => {
    const tokens = ahead.get(d.id) ?? 0;
    const mins = tokens * (d.slot_duration_minutes ?? 15);
    return {
      ...d,
      tokens_ahead: tokens,
      wait_label: tokens === 0 ? "No wait" : `~${mins} min`,
    };
  });
}

export default async function DoctorsPage() {
  const doctors = await getDoctors(DEFAULT_CLINIC_ID);

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#191c1b] text-lg">Select Doctor</h1>
          <p className="text-xs text-[#54615b]">डॉक्टर चुनें</p>
        </div>
        <div className="flex items-center gap-1 bg-[#e8f5ee] px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-[#006c46] rounded-full animate-pulse"></span>
          <span className="text-xs text-[#006c46] font-medium">Clinic Open</span>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-8 max-w-lg mx-auto w-full">
        {doctors.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#e0e3e1] shadow-sm">
            <span className="material-symbols-outlined text-[#6d7a71] text-4xl">person_off</span>
            <p className="text-[#54615b] mt-2 text-sm">No doctors are available at this clinic yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#e0e3e1]">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#006c46] text-3xl">stethoscope</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-[#191c1b] text-base">{doc.name}</h3>
                      {!doc.is_available && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a]">Off duty</span>
                      )}
                    </div>
                    <p className="text-sm text-[#54615b]">{doc.specialization} · {doc.experience_years} yrs</p>
                    <p className="text-sm font-semibold text-[#006c46] mt-0.5">₹{doc.consultation_fee}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e0e3e1]">
                  <div className="flex items-center gap-4 text-xs text-[#54615b]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">confirmation_number</span>
                      {doc.tokens_ahead} ahead
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      {doc.wait_label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/book?doctor=${doc.id}`}
                      className="px-3 py-1.5 rounded-xl border border-[#006c46] text-[#006c46] text-xs font-medium">
                      Book
                    </Link>
                    <Link href={`/join-queue?doctor=${doc.id}`}
                      className="px-3 py-1.5 rounded-xl bg-[#006c46] text-white text-xs font-medium">
                      Join Queue
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
