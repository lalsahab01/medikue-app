"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type DoctorInfo = {
  id: string;
  name: string;
  specialization: string;
  tokens_ahead: number;
  estimated_wait_minutes: number;
};

function JoinQueueInner() {
  const router = useRouter();
  const params = useSearchParams();
  const doctorId = params.get("doctor") ?? "";
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the chosen doctor (and their live wait) for the header card.
  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((data) => {
        const list: DoctorInfo[] = data.doctors ?? [];
        setDoctor(list.find((d) => d.id === doctorId) ?? list[0] ?? null);
      })
      .catch(() => setDoctor(null));
  }, [doctorId]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!doctor) {
      setError("Please pick a doctor first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/queue/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctor.id, name, phone, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not join the queue.");
        setLoading(false);
        return;
      }
      // Remember this patient locally for the profile screen (no login in the MVP).
      localStorage.setItem("mk_patient", JSON.stringify({ name, phone }));
      router.push(`/queue?id=${data.entry_id}&clinic=${data.clinic_id}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
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
            <p className="font-semibold text-[#006c46]">
              {doctor ? doctor.name : "Loading doctor…"}
            </p>
            <p className="text-sm text-[#3d4a41]">
              {doctor
                ? `${doctor.tokens_ahead} ahead · ~${doctor.estimated_wait_minutes} min wait`
                : "Fetching live wait time"}
            </p>
          </div>
        </div>

        {error && <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

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
