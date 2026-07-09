import Link from "next/link";

// Kept intentionally short — three quick proof points, not a feature dump.
const HIGHLIGHTS = [
  { icon: "bolt", label: "Instant token", sub: "Join in seconds" },
  { icon: "schedule", label: "Live wait time", sub: "Know your turn" },
  { icon: "smartphone", label: "No app needed", sub: "Works in any browser" },
];

const LOGIN_LINKS = [
  { href: "/login?role=staff", label: "Staff", icon: "badge" },
  { href: "/login?role=doctor", label: "Doctor", icon: "stethoscope" },
  { href: "/login?role=admin", label: "Admin", icon: "admin_panel_settings" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f7faf8] flex flex-col">
      {/* Soft decorative accents for depth (kept subtle) */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#24a872]/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-[#006c46]/5 blur-3xl" />

      {/* Top navigation */}
      <header className="relative z-20 border-b border-[#e0e3e1]/70 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006c46] shadow-sm">
              <span className="material-symbols-outlined text-base text-white">local_hospital</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-[#006c46]">MediKue<span className="text-[#24a872]">+</span></span>
          </div>

          {/* Staff logins: present but understated, so they never compete with the patient action */}
          <nav className="flex items-center gap-1">
            <span className="mr-1 hidden text-xs font-medium text-[#6d7a71] sm:inline">Log in as</span>
            {LOGIN_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-[#3d4a41] transition-colors hover:bg-[#e8f5ee] hover:text-[#006c46]"
              >
                <span className="material-symbols-outlined text-base">{l.icon}</span>
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_400px] lg:gap-16 lg:px-8 lg:py-20">
        {/* LEFT — story, kept airy */}
        <section className="flex flex-col">
          <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#cde8d9] bg-white/60 px-3 py-1 text-xs font-medium text-[#006c46]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#24a872]" />
            Clinic Queue Operating System
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-[#191c1b] sm:text-5xl lg:text-6xl">
            Skip the wait.
            <br />
            <span className="text-[#006c46]">Run your clinic smarter.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-[#3d4a41]">
            Join the queue from your phone and watch your turn in real time.
          </p>
          <p className="mt-1 font-[family-name:'Hind',sans-serif] text-sm text-[#6d7a71]">
            फ़ोन से लाइन में लगें · अपनी बारी लाइव देखें
          </p>

          {/* Compact proof strip — replaces the old card grid */}
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ee]">
                  <span className="material-symbols-outlined text-xl text-[#006c46]">{h.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#191c1b]">{h.label}</p>
                  <p className="text-xs text-[#6d7a71]">{h.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT — the one thing a patient should do */}
        <section className="lg:self-center">
          <div className="overflow-hidden rounded-3xl border border-[#e0e3e1] bg-white shadow-[0_20px_60px_-20px_rgba(0,108,70,0.25)]">
            <div className="bg-gradient-to-br from-[#006c46] to-[#00583a] px-7 py-8 text-white">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <span className="material-symbols-outlined text-2xl">confirmation_number</span>
              </div>
              <h2 className="text-2xl font-bold">Get your token</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[#a8ecc9]">
                No password, no app — just your name and phone number.
              </p>
            </div>

            <div className="flex flex-col gap-3 px-6 py-6">
              {/* Primary action — deliberately the loudest element on the page */}
              <Link
                href="/doctors"
                className="group flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#006c46] px-5 text-base font-semibold text-white shadow-md transition-all hover:bg-[#00583a] active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">confirmation_number</span>
                Join the Queue
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-0.5">arrow_forward</span>
              </Link>

              {/* Secondary actions — smaller, side by side */}
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/register"
                  className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl border border-[#e0e3e1] bg-white py-2.5 text-center text-[#006c46] transition-colors hover:border-[#006c46]"
                >
                  <span className="material-symbols-outlined text-xl">person_add</span>
                  <span className="text-xs font-semibold">Register</span>
                </Link>
                <Link
                  href="/book"
                  className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl border border-[#e0e3e1] bg-white py-2.5 text-center text-[#006c46] transition-colors hover:border-[#006c46]"
                >
                  <span className="material-symbols-outlined text-xl">calendar_month</span>
                  <span className="text-xs font-semibold">Book slot</span>
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[#6d7a71]">
            Are you a doctor?{" "}
            <Link href="/doctor-register" className="font-medium text-[#006c46] underline underline-offset-2">
              Join with your clinic&apos;s invite code
            </Link>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#e0e3e1]/70 px-4 py-5 text-center text-xs text-[#6d7a71]">
        © {new Date().getFullYear()} MediKue+ · Made for Indian clinics
      </footer>
    </div>
  );
}
