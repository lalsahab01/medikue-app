"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", password: "", age: "", gender: "", blood_group: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register/patient", {
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
      router.push("/doctors");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <h1 className="font-bold text-[#191c1b] text-lg">Patient Registration</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-8 max-w-md mx-auto w-full">
        <p className="text-[#54615b] text-sm mb-6">नया मरीज़ पंजीकरण · New Patient</p>

        {error && (
          <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {([
            { label: "Full Name / पूरा नाम", key: "name", type: "text", placeholder: "e.g. Ramesh Kumar" },
            { label: "Phone Number / मोबाइल नंबर", key: "phone", type: "tel", placeholder: "10-digit mobile" },
            { label: "Password / पासवर्ड", key: "password", type: "password", placeholder: "At least 6 characters" },
            { label: "Age / उम्र", key: "age", type: "number", placeholder: "Years" },
          ] as const).map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#191c1b] mb-1.5">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                required={key !== "age"}
                className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-[#191c1b] text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Gender / लिंग</label>
            <div className="flex gap-3">
              {["Male","Female","Other"].map(g => (
                <button key={g} type="button"
                  onClick={() => setForm(p => ({ ...p, gender: g }))}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${form.gender === g ? "bg-[#006c46] text-white border-[#006c46]" : "bg-white text-[#191c1b] border-[#bccabf]"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Blood Group / रक्त समूह</label>
            <div className="flex gap-2 flex-wrap">
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                <button key={bg} type="button"
                  onClick={() => setForm(p => ({ ...p, blood_group: bg }))}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${form.blood_group === bg ? "bg-[#006c46] text-white border-[#006c46]" : "bg-white text-[#191c1b] border-[#bccabf]"}`}>
                  {bg}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl mt-2 active:scale-[0.98] transition-all disabled:opacity-60">
            {loading ? "Registering..." : "Continue →"}
          </button>
        </form>

        <p className="text-center text-[#54615b] text-sm mt-6">
          Already registered? <Link href="/login" className="text-[#006c46] font-medium underline">Log in</Link>
        </p>
      </main>
    </div>
  );
}
