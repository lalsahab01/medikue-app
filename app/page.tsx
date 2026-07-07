import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#006c46]">
              <span className="material-symbols-outlined text-base text-white">local_hospital</span>
            </div>
            <span className="text-lg font-bold text-[#006c46]">MediKue<span className="text-[#24a872]">+</span></span>
          </div>
          <Link href="/login" className="rounded-full border border-[#006c46] px-4 py-2 text-sm font-medium text-[#006c46] transition-colors hover:bg-[#006c46] hover:text-white">
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-12">
        <section className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#006c46] shadow-lg">
            <span className="material-symbols-outlined text-white" style={{fontSize:"48px"}}>queue</span>
          </div>

          <h1 className="mb-3 max-w-2xl text-4xl font-extrabold leading-tight text-[#191c1b] sm:text-5xl">
            Smart Queue for <span className="text-[#006c46]">Your Clinic</span>
          </h1>
          <p className="mb-8 max-w-xl text-base leading-relaxed text-[#3d4a41] sm:text-lg">
            Skip the wait. Join the digital queue, book appointments, and get reminders all from your phone.
            <br/><span className="font-[family-name:'Hind',sans-serif] text-sm text-[#54615b] sm:text-base">अपनी बारी का इंतज़ार स्मार्ट तरीके से करें</span>
          </p>

          {/* Primary CTA */}
          <div className="grid w-full max-w-md gap-3 sm:grid-cols-2 lg:max-w-xl">
            <Link
              href="/join-queue"
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#006c46] px-5 py-4 text-center text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98] sm:col-span-2"
            >
              <span className="material-symbols-outlined text-xl">confirmation_number</span>
              Get Token Number
            </Link>
            <Link
              href="/book"
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#006c46] bg-white px-5 py-4 text-center text-base font-semibold text-[#006c46] transition-transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">calendar_month</span>
              Book Appointment
            </Link>
            <Link
              href="/register"
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#e0e3e1] px-5 py-4 text-center text-base font-medium text-[#191c1b] transition-transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">person_add</span>
              Register
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="grid w-full grid-cols-2 gap-3 lg:self-center">
          {[
            { icon: "timer", title: "Live Wait Time", desc: "Know exactly when it is your turn" },
            { icon: "notifications", title: "Get Notified", desc: "SMS alert when your turn is near" },
            { icon: "receipt_long", title: "Digital Receipt", desc: "Prescription & bills on your phone" },
            { icon: "star", title: "Rate & Review", desc: "Share your clinic experience" },
          ].map((f) => (
            <div key={f.title} className="min-h-36 rounded-2xl border border-[#e0e3e1] bg-white p-4 shadow-sm">
              <span className="material-symbols-outlined text-[#006c46] text-2xl">{f.icon}</span>
              <p className="font-semibold text-[#191c1b] text-sm mt-1">{f.title}</p>
              <p className="text-[#6d7a71] text-xs mt-0.5">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 pb-6 pt-2 text-center text-xs text-[#6d7a71]">
        <p>© 2025 MediKue+ · Made for Indian Clinics</p>
        <p className="mt-1">
          Are you a doctor? <Link href="/doctor-register" className="text-[#006c46] underline">Join with your clinic&apos;s invite code</Link>
        </p>
      </footer>
    </div>
  );
}
