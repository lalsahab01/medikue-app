"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";

type StatusResponse = {
  entry: {
    id: string;
    token_number: number;
    patient_name: string;
    status: string;
    reason: string | null;
    doctors: { name: string; specialization: string } | { name: string; specialization: string }[] | null;
  };
  now_serving: number | null;
  patients_ahead: number;
};

const STATUS_STEPS = ["Registered", "Waiting", "Called", "With Doctor", "Done"];

function stepForStatus(status: string): number {
  switch (status) {
    case "waiting": return 1;
    case "called": return 2;
    case "with_doctor": return 3;
    case "done": return 4;
    default: return 1;
  }
}

function doctorLabel(entry: StatusResponse["entry"]): string {
  const d = Array.isArray(entry.doctors) ? entry.doctors[0] : entry.doctors;
  return d ? `${d.name} · ${d.specialization}` : "";
}

function QueueTrackInner() {
  const params = useSearchParams();
  const entryId = params.get("id");
  const clinic = params.get("clinic") ?? undefined;
  const legacyToken = params.get("token");

  const [data, setData] = useState<StatusResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const qs = new URLSearchParams();
    if (entryId) qs.set("id", entryId);
    else if (legacyToken) qs.set("token", legacyToken.replace(/\D/g, ""));
    if (clinic) qs.set("clinic_id", clinic);
    if (!entryId && !legacyToken) { setLoading(false); return; }

    try {
      const res = await fetch(`/api/queue/status?${qs.toString()}`);
      const body = await res.json();
      if (!res.ok) { setError(body.error || "Could not load status."); setData(null); }
      else { setData(body); setError(""); }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }, [entryId, legacyToken, clinic]);

  // Poll every 8s for a live view.
  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);

  const entry = data?.entry;
  const token = entry?.token_number ?? null;
  const ahead = data?.patients_ahead ?? 0;
  const serving = data?.now_serving ?? null;
  const waitMins = ahead * 5;
  const currentStep = entry ? stepForStatus(entry.status) : 1;

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">home</span>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#191c1b] text-lg">Queue Status</h1>
          <p className="text-xs text-[#54615b]">आपकी बारी का हाल</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#006c46] font-medium">
          <span className="w-1.5 h-1.5 bg-[#006c46] rounded-full animate-pulse"></span>
          Live
        </div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-8 max-w-md mx-auto w-full">
        {loading && <p className="text-center text-[#54615b]">Loading your token…</p>}

        {!loading && error && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#e0e3e1] shadow-sm">
            <span className="material-symbols-outlined text-[#ba1a1a] text-4xl">error</span>
            <p className="text-[#54615b] mt-2 text-sm">{error}</p>
            <Link href="/doctors" className="inline-block mt-4 text-[#006c46] font-medium underline">Join a queue</Link>
          </div>
        )}

        {!loading && entry && (
          <>
            {/* Big token display */}
            <div className="bg-[#006c46] rounded-3xl p-8 text-center mb-6 shadow-lg">
              <p className="text-[#81f9bc] text-sm font-medium uppercase tracking-widest mb-1">Your Token</p>
              <p className="text-white text-8xl font-extrabold leading-none">#{token}</p>
              <p className="text-[#64dca1] mt-2 text-sm">{doctorLabel(entry)}</p>
            </div>

            {/* Status */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-2xl p-3 text-center border border-[#e0e3e1] shadow-sm">
                <p className="text-2xl font-bold text-[#006c46]">{ahead}</p>
                <p className="text-xs text-[#54615b] mt-0.5">Ahead of you</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center border border-[#e0e3e1] shadow-sm">
                <p className="text-2xl font-bold text-[#191c1b]">{serving ? `#${serving}` : "—"}</p>
                <p className="text-xs text-[#54615b] mt-0.5">Now serving</p>
              </div>
              <div className="bg-white rounded-2xl p-3 text-center border border-[#e0e3e1] shadow-sm">
                <p className="text-2xl font-bold text-[#191c1b]">{waitMins}m</p>
                <p className="text-xs text-[#54615b] mt-0.5">Est. wait</p>
              </div>
            </div>

            {/* Progress stepper */}
            <div className="bg-white rounded-2xl p-4 border border-[#e0e3e1] shadow-sm mb-4">
              <div className="flex items-center justify-between">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center flex-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < currentStep ? "bg-[#006c46] text-white" : i === currentStep ? "bg-[#24a872] text-white ring-4 ring-[#006c46]/20" : "bg-[#e0e3e1] text-[#6d7a71]"}`}>
                      {i < currentStep ? "✓" : i + 1}
                    </div>
                    <p className={`text-[10px] mt-1 text-center ${i <= currentStep ? "text-[#006c46] font-medium" : "text-[#6d7a71]"}`}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fff9e6] border border-[#f9a825]/30 rounded-2xl p-4 flex gap-3 mb-6">
              <span className="material-symbols-outlined text-[#f9a825]">notifications</span>
              <p className="text-sm text-[#3d4a41]">Keep this page open — your position updates automatically as the queue moves.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function QueuePage() {
  return <Suspense><QueueTrackInner /></Suspense>;
}
