import Link from "next/link";

const STATS = [
  { label: "Total Patients", value: "47", change: "+8 vs yesterday", icon: "group", color: "text-[#006c46]" },
  { label: "Appointments", value: "19", change: "12 completed", icon: "calendar_month", color: "text-[#24a872]" },
  { label: "Walk-ins", value: "28", change: "4 pending", icon: "person_add", color: "text-[#54615b]" },
  { label: "Revenue", value: "₹14,200", change: "+₹2,800 vs yesterday", icon: "payments", color: "text-[#006c46]" },
];

const RECENT = [
  { name: "Suresh Yadav", time: "11:42 AM", doctor: "Dr. Priya Sharma", fee: 300 },
  { name: "Kavya Mehta", time: "11:20 AM", doctor: "Dr. Ramesh Patel", fee: 500 },
  { name: "Ravi Sharma", time: "10:58 AM", doctor: "Dr. Anita Singh", fee: 350 },
  { name: "Anita Patel", time: "10:32 AM", doctor: "Dr. Priya Sharma", fee: 300 },
  { name: "Mohan Das", time: "10:15 AM", doctor: "Dr. Suresh Kumar", fee: 700 },
];

export default function ReportsPage() {
  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-bold text-[#191c1b] text-lg">Daily Report</h1>
          <p className="text-xs text-[#54615b]">Today · {new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</p>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-8 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {STATS.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-[#e0e3e1] shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className={`material-symbols-outlined ${s.color}`}>{s.icon}</span>
              </div>
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-sm font-medium text-[#191c1b] mt-0.5">{s.label}</p>
              <p className="text-xs text-[#6d7a71] mt-0.5">{s.change}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[#e0e3e1] shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-[#e0e3e1]">
            <h2 className="font-semibold text-[#191c1b]">Recent Patients</h2>
          </div>
          <div className="divide-y divide-[#e0e3e1]">
            {RECENT.map((p, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#191c1b] text-sm">{p.name}</p>
                  <p className="text-xs text-[#54615b]">{p.doctor} · {p.time}</p>
                </div>
                <p className="font-semibold text-[#006c46]">₹{p.fee}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#e8f5ee] rounded-2xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#006c46] text-3xl">download</span>
          <div>
            <p className="font-semibold text-[#191c1b] text-sm">Export Report</p>
            <p className="text-xs text-[#54615b]">Download as PDF or Excel</p>
          </div>
        </div>
      </main>
    </div>
  );
}
