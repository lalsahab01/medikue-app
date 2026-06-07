"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Demo: any credentials work until Supabase is connected
    if (email && password) {
      sessionStorage.setItem("staff_logged_in", "1");
      router.push("/dashboard");
    } else {
      setError("Please enter email and password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-[#006c46] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[#006c46] text-2xl">local_hospital</span>
          </div>
          <div>
            <p className="text-white font-extrabold text-2xl leading-none">MediKue<span className="text-[#81f9bc]">+</span></p>
            <p className="text-[#64dca1] text-xs">Staff Portal</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="font-bold text-[#191c1b] text-xl mb-1">Sign In</h2>
          <p className="text-sm text-[#54615b] mb-6">Staff & Doctor Login</p>

          {error && (
            <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Email / ईमेल</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="staff@clinic.com"
                className="w-full bg-[#f7faf8] border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Password / पासवर्ड</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f7faf8] border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl mt-1 active:scale-[0.98] transition-all disabled:opacity-60">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#81f9bc] text-xs mt-6">
          Patient? <Link href="/" className="underline">Go to patient portal</Link>
        </p>
      </div>
    </div>
  );
}
