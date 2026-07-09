"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM"];

type DoctorInfo = { id: string; name: string; specialization: string; consultation_fee: number };

// Convert a "9:30 AM" label to a 24h "HH:MM" time for the DB.
function to24h(label: string): string {
  const [time, meridiem] = label.split(" ");
  const [hStr, mStr] = time.split(":");
  let h = Number(hStr);
  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${mStr}`;
}

function BookInner() {
  const params = useSearchParams();
  const doctorId = params.get("doctor") ?? "";
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<{ date: string; slot: string } | null>(null);
  const [dateLimits] = useState(() => {
    const now = new Date();
    const max = new Date(now);
    max.setDate(now.getDate() + 7);
    return { today: now.toISOString().split("T")[0], maxDate: max.toISOString().split("T")[0] };
  });

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((data) => {
        const list: DoctorInfo[] = data.doctors ?? [];
        setDoctor(list.find((d) => d.id === doctorId) ?? list[0] ?? null);
      })
      .catch(() => setDoctor(null));
  }, [doctorId]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!slot || !doctor) { setError("Choose a doctor and a time slot."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctor.id, name, phone, appointment_date: date, slot_time: to24h(slot) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not book the appointment."); setLoading(false); return; }
      localStorage.setItem("mk_patient", JSON.stringify({ name, phone }));
      setConfirmed({ date, slot });
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  if (confirmed) {
    return (
      <div className="min-h-dvh bg-[#f7faf8] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[#006c46] text-4xl">event_available</span>
        </div>
        <h2 className="text-2xl font-bold text-[#191c1b] text-center mb-1">Appointment Booked</h2>
        <p className="text-[#54615b] text-center mb-2">{doctor?.name}</p>
        <p className="text-[#006c46] font-semibold text-center mb-8">{confirmed.date} · {confirmed.slot}</p>
        <Link href="/" className="w-full max-w-xs bg-[#006c46] text-white font-semibold py-4 rounded-2xl text-center">Back to Home</Link>
      </div>
    );
  }

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
            <p className="font-semibold text-[#191c1b]">{doctor ? doctor.name : "Loading…"}</p>
            <p className="text-sm text-[#54615b]">{doctor ? `${doctor.specialization} · ₹${doctor.consultation_fee}` : ""}</p>
          </div>
        </div>

        {error && <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

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
            <input required type="date" value={date} onChange={e => setDate(e.target.value)} min={dateLimits.today} max={dateLimits.maxDate}
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] transition" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-2">Select Time Slot *</label>
            <div className="grid grid-cols-3 gap-2">
              {SLOTS.map(s => (
                <button key={s} type="button" onClick={() => setSlot(s)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition ${slot === s ? "bg-[#006c46] text-white" : "bg-white border border-[#bccabf] text-[#191c1b] hover:border-[#006c46]"}`}>
                  {s}
                </button>
              ))}
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
