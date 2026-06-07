"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ManualRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", age: "", gender: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<number|null>(null);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const t = Math.floor(Math.random() * 30) + 15;
    setToken(t);
    setLoading(false);
  };

  if (token) {
    return (
      <div className="min-h-dvh bg-[#f7faf8] flex flex-col items-center justify-center px-6">
        <div className="bg-[#006c46] rounded-3xl p-8 text-center w-full max-w-sm mb-6 shadow-lg">
          <p className="text-[#81f9bc] text-sm uppercase tracking-widest mb-1">Token Issued</p>
          <p className="text-white text-8xl font-extrabold">#{token}</p>
          <p className="text-[#64dca1] mt-2">{form.name} · {form.phone}</p>
        </div>
        <button onClick={() => { setToken(null); setForm({ name:"",phone:"",age:"",gender:"",reason:"" }); }}
          className="w-full max-w-sm bg-white border border-[#006c46] text-[#006c46] font-semibold py-4 rounded-2xl mb-3">
          Register Another
        </button>
        <Link href="/dashboard" className="w-full max-w-sm bg-[#006c46] text-white font-semibold py-4 rounded-2xl text-center block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-bold text-[#191c1b] text-lg">Walk-in Registration</h1>
          <p className="text-xs text-[#54615b]">Staff: Add patient to queue</p>
        </div>
      </header>
      <main className="flex-1 px-6 pt-6 pb-8 max-w-md mx-auto w-full">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Patient Name *</label>
            <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Full name"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Phone *</label>
            <input required type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="10-digit"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Age</label>
            <input type="number" value={form.age} onChange={e => set("age", e.target.value)} placeholder="Years"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Gender</label>
            <div className="flex gap-3">
              {["Male","Female","Other"].map(g => (
                <button key={g} type="button" onClick={() => set("gender", g)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${form.gender === g ? "bg-[#006c46] text-white border-[#006c46]" : "bg-white text-[#191c1b] border-[#bccabf]"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Reason for Visit</label>
            <textarea value={form.reason} onChange={e => set("reason", e.target.value)} rows={2} placeholder="Chief complaint..."
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] resize-none transition" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60">
            <span className="material-symbols-outlined">confirmation_number</span>
            {loading ? "Issuing..." : "Issue Token"}
          </button>
        </form>
      </main>
    </div>
  );
}
