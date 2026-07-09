"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  total_tokens: number;
  waiting: number;
  with_doctor: number;
  done: number;
  skipped: number;
  appointments: number;
  revenue: number;
  avg_consult_minutes: number;
};

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    fetch("/api/reports")
      .then(r => r.json())
      .then(data => setReport(data.report ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = report
    ? [
        { label: "Total Tokens", value: String(report.total_tokens), sub: `${report.done} completed`, icon: "group", color: "text-[#006c46]" },
        { label: "Appointments", value: String(report.appointments), sub: "booked today", icon: "calendar_month", color: "text-[#24a872]" },
        { label: "In Queue", value: String(report.waiting + report.with_doctor), sub: `${report.skipped} skipped`, icon: "person_add", color: "text-[#54615b]" },
        { label: "Revenue", value: `₹${report.revenue.toLocaleString("en-IN")}`, sub: `avg ${report.avg_consult_minutes}m/consult`, icon: "payments", color: "text-[#006c46]" },
      ]
    : [];

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-bold text-[#191c1b] text-lg">Daily Report</h1>
          <p className="text-xs text-[#54615b]">Today · {today}</p>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-8 max-w-lg mx-auto w-full">
        {loading && <p className="text-center text-[#54615b] py-8">Loading report…</p>}

        {!loading && report && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {stats.map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#e0e3e1] shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
                  </div>
                  <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-sm font-medium text-[#191c1b] mt-0.5">{s.label}</p>
                  <p className="text-xs text-[#6d7a71] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#e0e3e1] shadow-sm overflow-hidden mb-4">
              <div className="px-4 py-3 border-b border-[#e0e3e1]">
                <h2 className="font-semibold text-[#191c1b]">Queue Breakdown</h2>
              </div>
              <div className="divide-y divide-[#e0e3e1]">
                {[
                  { label: "Waiting / Called", value: report.waiting },
                  { label: "With Doctor", value: report.with_doctor },
                  { label: "Completed", value: report.done },
                  { label: "Skipped / Cancelled", value: report.skipped },
                ].map(row => (
                  <div key={row.label} className="px-4 py-3 flex items-center justify-between">
                    <p className="text-sm text-[#191c1b]">{row.label}</p>
                    <p className="font-semibold text-[#006c46]">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!loading && !report && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#e0e3e1] shadow-sm">
            <span className="material-symbols-outlined text-[#6d7a71] text-4xl">bar_chart</span>
            <p className="text-[#54615b] mt-2 text-sm">No report data available.</p>
          </div>
        )}
      </main>
    </div>
  );
}
