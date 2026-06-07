import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-white shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#006c46] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-base">local_hospital</span>
          </div>
          <span className="font-bold text-[#006c46] text-lg">MediKue<span className="text-[#24a872]">+</span></span>
        </div>
        <Link href="/login" className="text-sm font-medium text-[#006c46] border border-[#006c46] px-4 py-1.5 rounded-full hover:bg-[#006c46] hover:text-white transition-colors">
          Staff Login
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-8 max-w-md mx-auto w-full">
        <div className="w-24 h-24 bg-[#006c46] rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <span className="material-symbols-outlined text-white" style={{fontSize:"48px"}}>queue</span>
        </div>

        <h1 className="text-3xl font-extrabold text-[#191c1b] text-center leading-tight mb-2">
          Smart Queue for<br/>
          <span className="text-[#006c46]">Your Clinic</span>
        </h1>
        <p className="text-[#3d4a41] text-center text-base mb-8 leading-relaxed">
          Skip the wait. Join the digital queue, book appointments, and get reminders — all from your phone.
          <br/><span className="text-sm text-[#54615b] font-[family-name:'Hind',sans-serif]">अपनी बारी का इंतज़ार स्मार्ट तरीके से करें</span>
        </p>

        {/* Primary CTA */}
        <Link
          href="/join-queue"
          className="w-full bg-[#006c46] text-white font-semibold text-base py-4 rounded-2xl text-center mb-3 shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">confirmation_number</span>
          Get Token Number
        </Link>
        <Link
          href="/book"
          className="w-full bg-white text-[#006c46] font-semibold text-base py-4 rounded-2xl text-center mb-3 border border-[#006c46] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-xl">calendar_month</span>
          Book Appointment
        </Link>
        <Link
          href="/register"
          className="w-full bg-[#e0e3e1] text-[#191c1b] font-medium text-base py-4 rounded-2xl text-center flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-xl">person_add</span>
          New Patient Registration
        </Link>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3 mt-8 w-full">
          {[
            { icon: "timer", title: "Live Wait Time", desc: "Know exactly when it is your turn" },
            { icon: "notifications", title: "Get Notified", desc: "SMS alert when your turn is near" },
            { icon: "receipt_long", title: "Digital Receipt", desc: "Prescription & bills on your phone" },
            { icon: "star", title: "Rate & Review", desc: "Share your clinic experience" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-4 shadow-sm border border-[#e0e3e1]">
              <span className="material-symbols-outlined text-[#006c46] text-2xl">{f.icon}</span>
              <p className="font-semibold text-[#191c1b] text-sm mt-1">{f.title}</p>
              <p className="text-[#6d7a71] text-xs mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#6d7a71] pb-6 pt-2">
        © 2025 MediKue+ · Made for Indian Clinics
      </footer>
    </div>
  );
}
