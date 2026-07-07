"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const initialForm = { name: "", phone: "", password: "", specialization: "", qualification: "", invite_code: "" };

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof initialForm, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/login" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <h1 className="font-bold text-[#191c1b] text-lg">Doctor Registration</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-8 max-w-md mx-auto w-full">
        <p className="text-[#54615b] text-sm mb-6">Ask your clinic admin for an invite code before you begin.</p>

        {error && (
          <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {([
            { label: "Full Name", key: "name", type: "text", placeholder: "e.g. Dr. Priya Sharma" },
            { label: "Mobile Number", key: "phone", type: "tel", placeholder: "10-digit mobile" },
            { label: "Password", key: "password", type: "password", placeholder: "At least 6 characters" },
            { label: "Specialization", key: "specialization", type: "text", placeholder: "e.g. General Physician" },
            { label: "Qualification", key: "qualification", type: "text", placeholder: "e.g. MBBS, MD" },
            { label: "Clinic Invite Code", key: "invite_code", type: "text", placeholder: "e.g. MEDIKUE-XXXX" },
          ] as const).map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#191c1b] mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                required={key !== "qualification"}
                className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-[#191c1b] text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition"
              />
            </div>
          ))}

          <button type="submit" disabled={loading}
            className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl mt-2 active:scale-[0.98] transition-all disabled:opacity-60">
            {loading ? "Creating account..." : "Create Doctor Account →"}
          </button>
        </form>
      </main>
    </div>
  );
}
