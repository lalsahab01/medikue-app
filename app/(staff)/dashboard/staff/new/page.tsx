"use client";
import { useState } from "react";
import Link from "next/link";

export default function AddStaffPage() {
  const [form, setForm] = useState({ name: "", phone: "", password: "", staff_role: "receptionist" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/doctor/create-staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create staff account.");
        setLoading(false);
        return;
      }
      setMessage(`Staff account created. Share this login ID with them: ${data.login_id}`);
      setForm({ name: "", phone: "", password: "", staff_role: "receptionist" });
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <h1 className="font-bold text-[#191c1b] text-lg">Add Clinical Staff</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-8 max-w-md mx-auto w-full">
        {message && <div className="bg-[#d7f5e3] text-[#006c46] text-sm px-4 py-3 rounded-xl mb-4">{message}</div>}
        {error && <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Full Name</label>
            <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Mobile Number</label>
            <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="10-digit mobile"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Temporary Password</label>
            <input required type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="At least 6 characters"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Role</label>
            <select value={form.staff_role} onChange={e => setForm(p => ({ ...p, staff_role: e.target.value }))}
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base">
              <option value="receptionist">Receptionist</option>
              <option value="nurse">Nurse</option>
              <option value="pharmacist">Pharmacist</option>
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl mt-2 disabled:opacity-60">
            {loading ? "Creating..." : "Create Staff Login →"}
          </button>
        </form>
      </main>
    </div>
  );
}
