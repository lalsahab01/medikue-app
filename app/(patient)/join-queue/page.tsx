"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function JoinQueueInner() {
  const router = useRouter();
  const params = useSearchParams();
  const doctorId = params.get("doctor") ?? "1";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = Math.floor(Math.random() * 50) + 1;
    sessionStorage.setItem("queue_token", JSON.stringify({ token, name, doctorId, time: new Date().toISOString() }));
    router.push(`/queue?token=${token}&doctor=${doctorId}`);
  };

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/doctors" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-bold text-[#191c1b] text-lg">Join Queue</h1>
          <p className="text-xs text-[#54615b]">कतार में जुड़ें</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-8 max-w-md mx-auto w-full">
        {/* Live queue info */}
        <div className="bg-[#e8f5ee] rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#006c46] text-3xl">confirmation_number</span>
          <div>
            <p className="font-semibold text-[#006c46]">Currently serving: Token #14</p>
            <p className="text-sm text-[#3d4a41]">8 patients ahead · ~25 min wait</p>
          </div>
        </div>

        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Patient Name / नाम *</label>
            <input required value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter full name"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Phone Number / मोबाइल *</label>
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="10-digit number"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Reason for Visit (optional)</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              rows={3} placeholder="Brief description of your concern..."
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition resize-none" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl mt-2 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60">
            <span className="material-symbols-outlined">confirmation_number</span>
            {loading ? "Getting token..." : "Get My Token"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function JoinQueuePage() {
  return <Suspense><JoinQueueInner /></Suspense>;
}
