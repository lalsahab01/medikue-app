"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type QueueRow = {
  id: string;
  token_number: number;
  patient_name: string;
  patient_phone: string;
  reason: string | null;
  status: string;
  doctor_id: string;
};

const STATUS_COLOR: Record<string, string> = {
  with_doctor: "bg-[#006c46] text-white",
  called: "bg-[#24a872] text-white",
  waiting: "bg-[#e0e3e1] text-[#191c1b]",
};
const STATUS_LABEL: Record<string, string> = {
  with_doctor: "With Doctor",
  called: "Called",
  waiting: "Waiting",
};

export default function DashboardPage() {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [doneToday, setDoneToday] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/queue");
      if (res.status === 401) { router.push("/login"); return; }
      const data = await res.json();
      const rows: QueueRow[] = data.queue ?? [];
      setQueue(rows);
      setDoneToday(rows.filter((r) => r.status === "done").length);
    } catch {
      /* keep last known queue on transient errors */
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetch("/api/auth/me").then(res => res.json()).then(data => setRole(data?.session?.role ?? null)).catch(() => {});
  }, []);

  // Poll the live queue.
  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [load]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/queue/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const active = queue.filter(q => q.status !== "done" && q.status !== "skipped" && q.status !== "cancelled");
  const serving = active.find(q => q.status === "with_doctor");

  // Complete the current patient and pull the next token in.
  const callNext = async () => {
    if (serving) await setStatus(serving.id, "done");
    const next = queue
      .filter(q => q.id !== serving?.id && (q.status === "called" || q.status === "waiting"))
      .sort((a, b) => a.token_number - b.token_number)[0];
    if (next) await setStatus(next.id, "with_doctor");
    await load();
  };

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 bg-[#006c46] text-white sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#81f9bc]">local_hospital</span>
            <div>
              <p className="font-bold text-base leading-none">MediKue<span className="text-[#81f9bc]">+</span></p>
              <p className="text-[10px] text-[#64dca1]">{role === "doctor" ? "Doctor" : "Staff"} Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-[#81f9bc] rounded-full animate-pulse"></span>
              <span className="text-xs">Live</span>
            </div>
            <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-8 max-w-2xl mx-auto w-full">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "In Queue", value: active.length, icon: "queue", color: "text-[#006c46]" },
            { label: "Serving", value: serving ? `#${serving.token_number}` : "-", icon: "confirmation_number", color: "text-[#24a872]" },
            { label: "Done Today", value: doneToday, icon: "check_circle", color: "text-[#54615b]" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-[#e0e3e1]">
              <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#54615b]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Currently serving */}
        {serving && (
          <div className="bg-[#006c46] rounded-2xl p-4 mb-4 flex items-center justify-between text-white shadow-md">
            <div>
              <p className="text-[#81f9bc] text-xs uppercase tracking-wide">Now With Doctor</p>
              <p className="font-bold text-xl mt-0.5">#{serving.token_number} · {serving.patient_name}</p>
              <p className="text-[#64dca1] text-sm">{serving.reason || "—"}</p>
            </div>
            <button onClick={callNext}
              className="bg-white text-[#006c46] font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">skip_next</span>
              Next
            </button>
          </div>
        )}

        {/* If nobody is with the doctor yet, offer to call the first patient */}
        {!serving && active.length > 0 && (
          <button onClick={callNext}
            className="w-full bg-[#006c46] text-white font-semibold py-3 rounded-2xl mb-4 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">play_arrow</span>
            Call First Patient
          </button>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { href: "/dashboard/patients", icon: "person_add", label: "Manual Register", sub: "Walk-in patient" },
            { href: "/dashboard/reports", icon: "bar_chart", label: "Daily Report", sub: "View today's stats" },
            ...(role === "doctor" ? [{ href: "/dashboard/staff/new", icon: "badge", label: "Add Staff", sub: "Create a staff login" }] : []),
          ].map(a => (
            <Link key={a.href} href={a.href} className="bg-white rounded-2xl p-4 border border-[#e0e3e1] shadow-sm flex items-center gap-3 hover:bg-[#f2f4f2] transition">
              <div className="w-10 h-10 bg-[#e8f5ee] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006c46]">{a.icon}</span>
              </div>
              <div>
                <p className="font-semibold text-[#191c1b] text-sm">{a.label}</p>
                <p className="text-xs text-[#54615b]">{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Queue list */}
        <div className="bg-white rounded-2xl border border-[#e0e3e1] shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e0e3e1] flex items-center justify-between">
            <h2 className="font-semibold text-[#191c1b]">Live Queue</h2>
            <span className="text-xs text-[#54615b]">{active.length} patients</span>
          </div>
          <div className="divide-y divide-[#e0e3e1]">
            {loading && active.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-[#54615b]">Loading queue…</p>
            )}
            {!loading && active.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-[#54615b]">No patients in the queue right now.</p>
            )}
            {active.map(q => (
              <div key={q.id} className="px-4 py-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${q.status === "with_doctor" ? "bg-[#006c46] text-white" : q.status === "called" ? "bg-[#24a872] text-white" : "bg-[#e0e3e1] text-[#191c1b]"}`}>
                  #{q.token_number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#191c1b] text-sm">{q.patient_name}</p>
                  <p className="text-xs text-[#54615b] truncate">{q.reason || "—"} · {q.patient_phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[q.status] ?? "bg-[#e0e3e1] text-[#191c1b]"}`}>{STATUS_LABEL[q.status] ?? q.status}</span>
                  {role === "doctor" && (
                    <Link href={`/dashboard/prescription?patient=${encodeURIComponent(q.patient_name)}&token=${q.token_number}&entry=${q.id}`}
                      className="w-8 h-8 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#006c46] text-base">description</span>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
