"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM"];
const UNAVAILABLE = ["9:00 AM","10:00 AM","11:30 AM","2:00 PM","4:00 PM"];

function BookInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slot) return;
    setLoading(true);
    sessionStorage.setItem("appointment", JSON.stringify({ name, phone, date, slot }));
    router.push("/queue?appointment=1&token=A1");
  };

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/doctors" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-bold text-[#191c1b] text-lg">Book Appointment</h1>
          <p className="text-xs text-[#54615b]">अपॉइंटमेंट बुक करें</p>
        </div>
      </header>

      <main className="flex-1 px-6 pt-6 pb-8 max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl p-4 border border-[#e0e3e1] shadow-sm mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#e8f5ee] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#006c46] text-2xl">stethoscope</span>
          </div>
          <div>
            <p className="font-semibold text-[#191c1b]">Dr. Priya Sharma</p>
            <p className="text-sm text-[#54615b]">General Physician · ₹300</p>
          </div>
        </div>

        <form onSubmit={handleBook} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Patient Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Phone Number *</label>
            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="10-digit"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Date *</label>
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} min={today} max={maxDate}
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-2">Select Time Slot *</label>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map(s => {
                const unavail = UNAVAILABLE.includes(s);
                return (
                  <button key={s} type="button" disabled={unavail}
                    onClick={() => setSlot(s)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition ${unavail ? "bg-[#e0e3e1] text-[#bccabf] cursor-not-allowed" : slot === s ? "bg-[#006c46] text-white" : "bg-white border border-[#bccabf] text-[#191c1b] hover:border-[#006c46]"}`}>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <button type="submit" disabled={loading || !slot}
            className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl mt-2 flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60">
            <span className="material-symbols-outlined">calendar_month</span>
            {loading ? "Booking..." : "Confirm Appointment"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default function BookPage() {
  return <Suspense><BookInner /></Suspense>;
}
