import Link from "next/link";

const FEATURES = [
  { icon: "confirmation_number", title: "Digital Queue Tokens", desc: "Patients join from their phone and watch their turn in real time — no crowded waiting rooms." },
  { icon: "calendar_month", title: "Appointments & Walk-ins", desc: "Book a slot in advance or take a token on arrival. Both flow into one live queue." },
  { icon: "medical_services", title: "Doctor & Staff Consoles", desc: "Call the next patient, write prescriptions, and track the day — all in one place." },
  { icon: "insights", title: "Live Reports", desc: "Tokens served, revenue, and average wait time, updated as the day unfolds." },
];

const BENEFITS = [
  "No app install — works in any browser",
  "Hindi & English, built for Indian clinics",
  "Role-based access for admin, doctors & staff",
  "Your clinic data stays private & secure",
];

const LOGIN_LINKS = [
  { href: "/login?role=staff", label: "Clinical Staff", icon: "badge" },
  { href: "/login?role=doctor", label: "Doctor", icon: "stethoscope" },
  { href: "/login?role=admin", label: "Super Admin", icon: "admin_panel_settings" },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      {/* Top navigation: logo left, the three privileged logins right */}
      <header className="sticky top-0 z-20 border-b border-[#e0e3e1] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006c46]">
              <span className="material-symbols-outlined text-base text-white">local_hospital</span>
            </div>
            <span className="text-lg font-bold text-[#006c46]">MediKue<span className="text-[#24a872]">+</span></span>
          </div>

          <nav className="flex items-center gap-1.5 sm:gap-2">
            {LOGIN_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 rounded-full border border-[#cdd8d0] px-2.5 py-1.5 text-xs font-medium text-[#3d4a41] transition-colors hover:border-[#006c46] hover:text-[#006c46] sm:px-3.5 sm:text-sm"
              >
                <span className="material-symbols-outlined text-base">{l.icon}</span>
                <span className="hidden sm:inline">{l.label}</span>
                <span className="sm:hidden">{l.label.split(" ")[0]}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero: left = product story, right = patient primary CTA */}
      <main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_440px] lg:gap-14 lg:px-8 lg:py-16">
        {/* LEFT */}
        <section className="flex flex-col">
          <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#e8f5ee] px-3 py-1 text-xs font-medium text-[#006c46]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#006c46]" />
            Clinic Queue Operating System
          </span>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-[#191c1b] sm:text-5xl">
            Skip the wait.<br />
            <span className="text-[#006c46]">Run your clinic smarter.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#3d4a41] sm:text-lg">
            MediKue<span className="font-semibold text-[#006c46]">+</span> turns the chaos of a busy clinic into a calm,
            digital queue. Patients join from their phone; doctors and staff run the day from one live dashboard.
          </p>
          <p className="mt-1 max-w-xl font-[family-name:'Hind',sans-serif] text-sm text-[#54615b]">
            अपनी बारी का इंतज़ार अब स्मार्ट तरीके से।
          </p>

          {/* Features */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-[#e0e3e1] bg-white p-4 shadow-sm">
                <span className="material-symbols-outlined text-2xl text-[#006c46]">{f.icon}</span>
                <p className="mt-1.5 text-sm font-semibold text-[#191c1b]">{f.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#6d7a71]">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-[#3d4a41]">
                <span className="material-symbols-outlined text-lg text-[#24a872]">check_circle</span>
                {b}
              </li>
            ))}
          </ul>
        </section>

        {/* RIGHT: Patient primary CTA card */}
        <section className="lg:self-center">
          <div className="overflow-hidden rounded-3xl border border-[#e0e3e1] bg-white shadow-xl">
            <div className="bg-[#006c46] px-6 py-7 text-white">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                <span className="material-symbols-outlined text-3xl">confirmation_number</span>
              </div>
              <h2 className="text-2xl font-bold">Are you a patient?</h2>
              <p className="mt-1 text-sm text-[#a8ecc9]">
                Join the live queue or register in under a minute. No password, no app.
              </p>
            </div>

            <div className="flex flex-col gap-3 px-6 py-6">
              <Link
                href="/doctors"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#006c46] px-5 text-center text-base font-semibold text-white shadow-md transition-transform active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">confirmation_number</span>
                Join the Queue
              </Link>
              <Link
                href="/register"
                className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[#006c46] bg-white px-5 text-center text-base font-semibold text-[#006c46] transition-transform active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">person_add</span>
                Register as a Patient
              </Link>
              <Link
                href="/book"
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#e8f5ee] px-5 text-center text-sm font-medium text-[#006c46] transition-transform active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-lg">calendar_month</span>
                Book an Appointment
              </Link>

              <div className="mt-1 flex items-center gap-2 rounded-xl bg-[#f7faf8] px-3 py-2.5 text-xs text-[#54615b]">
                <span className="material-symbols-outlined text-base text-[#006c46]">schedule</span>
                Live wait times · SMS-ready · Track your token in real time
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[#6d7a71]">
            Are you a doctor?{" "}
            <Link href="/doctor-register" className="font-medium text-[#006c46] underline">
              Join with your clinic&apos;s invite code
            </Link>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e0e3e1] px-4 py-5 text-center text-xs text-[#6d7a71]">
        © {new Date().getFullYear()} MediKue+ · Made for Indian Clinics
      </footer>
    </div>
  );
}
