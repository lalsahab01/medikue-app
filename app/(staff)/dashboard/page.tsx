"use client";
import { useState } from "react";
import Link from "next/link";

const QUEUE = [
  { token: 15, name: "Suresh Yadav", phone: "9876543210", reason: "Fever & cold", wait: "Now", status: "with_doctor" },
  { token: 16, name: "Kavya Mehta", phone: "9812345678", reason: "Back pain", wait: "5 min", status: "called" },
  { token: 17, name: "Ravi Sharma", phone: "9900112233", reason: "Follow-up", wait: "15 min", status: "waiting" },
  { token: 18, name: "Anita Patel", phone: "9765432100", reason: "Checkup", wait: "20 min", status: "waiting" },
  { token: 19, name: "Mohan Das", phone: "9654321099", reason: "Headache", wait: "25 min", status: "waiting" },
  { token: 20, name: "Priti Singh", phone: "9543210988", reason: "Diabetes review", wait: "30 min", status: "waiting" },
];

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
  const [queue, setQueue] = useState(QUEUE);
  const serving = queue.find(q => q.status === "with_doctor");

  const callNext = () => {
    setQueue(prev => {
      const updated = [...prev];
      const withDocIdx = updated.findIndex(q => q.status === "with_doctor");
      if (withDocIdx >= 0) updated[withDocIdx].status = "done";
      const calledIdx = updated.findIndex(q => q.status === "called");
      if (calledIdx >= 0) updated[calledIdx].status = "with_doctor";
      else {
        const waitIdx = updated.findIndex(q => q.status === "waiting");
        if (waitIdx >= 0) updated[waitIdx].status = "with_doctor";
      }
      return updated;
    });
  };

  const active = queue.filter(q => q.status !== "done" && q.status !== "skipped");

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 bg-[#006c46] text-white sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#81f9bc]">local_hospital</span>
            <div>
              <p className="font-bold text-base leading-none">MediKue<span className="text-[#81f9bc]">+</span></p>
              <p className="text-[10px] text-[#64dca1]">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-[#81f9bc] rounded-full animate-pulse"></span>
              <span className="text-xs">Live</span>
            </div>
            <Link href="/login" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">logout</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-8 max-w-2xl mx-auto w-full">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "In Queue", value: active.length, icon: "queue", color: "text-[#006c46]" },
            { label: "Serving", value: serving?.token ?? "-", icon: "confirmation_number", color: "text-[#24a872]" },
            { label: "Done Today", value: 24, icon: "check_circle", color: "text-[#54615b]" },
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
              <p className="font-bold text-xl mt-0.5">#{serving.token} · {serving.name}</p>
              <p className="text-[#64dca1] text-sm">{serving.reason}</p>
            </div>
            <button onClick={callNext}
              className="bg-white text-[#006c46] font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">skip_next</span>
              Next
            </button>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { href: "/dashboard/patients", icon: "person_add", label: "Manual Register", sub: "Walk-in patient" },
            { href: "/dashboard/reports", icon: "bar_chart", label: "Daily Report", sub: "View today's stats" },
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
            {active.map(q => (
              <div key={q.token} className="px-4 py-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${q.status === "with_doctor" ? "bg-[#006c46] text-white" : q.status === "called" ? "bg-[#24a872] text-white" : "bg-[#e0e3e1] text-[#191c1b]"}`}>
                  #{q.token}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#191c1b] text-sm">{q.name}</p>
                  <p className="text-xs text-[#54615b] truncate">{q.reason} · {q.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[q.status]}`}>{STATUS_LABEL[q.status]}</span>
                  <Link href={`/dashboard/prescription?patient=${q.name}&token=${q.token}`}
                    className="w-8 h-8 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#006c46] text-base">description</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
