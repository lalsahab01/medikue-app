import Link from "next/link";

const DOCTORS = [
  { id: "1", name: "Dr. Priya Sharma", spec: "General Physician", exp: "12 yrs", fee: 300, rating: 4.8, tokens: 8, wait: "~25 min", photo: null },
  { id: "2", name: "Dr. Ramesh Patel", spec: "Orthopedics", exp: "15 yrs", fee: 500, rating: 4.6, tokens: 3, wait: "~10 min", photo: null },
  { id: "3", name: "Dr. Anita Singh", spec: "Pediatrics", exp: "8 yrs", fee: 350, rating: 4.9, tokens: 12, wait: "~40 min", photo: null },
  { id: "4", name: "Dr. Suresh Kumar", spec: "Cardiology", exp: "20 yrs", fee: 700, rating: 4.7, tokens: 5, wait: "~15 min", photo: null },
];

export default function DoctorsPage() {
  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#191c1b] text-lg">Select Doctor</h1>
          <p className="text-xs text-[#54615b]">डॉक्टर चुनें</p>
        </div>
        <div className="flex items-center gap-1 bg-[#e8f5ee] px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-[#006c46] rounded-full animate-pulse"></span>
          <span className="text-xs text-[#006c46] font-medium">Clinic Open</span>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-8 max-w-lg mx-auto w-full">
        {/* Search */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7a71] text-xl">search</span>
          <input placeholder="Search doctor or specialty..." className="w-full bg-white border border-[#bccabf] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#006c46]" />
        </div>

        <div className="flex flex-col gap-3">
          {DOCTORS.map(doc => (
            <div key={doc.id} className="bg-white rounded-2xl p-4 shadow-sm border border-[#e0e3e1]">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#e8f5ee] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#006c46] text-3xl">stethoscope</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#191c1b] text-base">{doc.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[#f9a825] text-base icon-fill">star</span>
                      <span className="text-sm font-medium text-[#191c1b]">{doc.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#54615b]">{doc.spec} · {doc.exp}</p>
                  <p className="text-sm font-semibold text-[#006c46] mt-0.5">₹{doc.fee}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e0e3e1]">
                <div className="flex items-center gap-4 text-xs text-[#54615b]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">confirmation_number</span>
                    {doc.tokens} ahead
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    {doc.wait}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/book?doctor=${doc.id}`}
                    className="px-3 py-1.5 rounded-xl border border-[#006c46] text-[#006c46] text-xs font-medium">
                    Book
                  </Link>
                  <Link href={`/join-queue?doctor=${doc.id}`}
                    className="px-3 py-1.5 rounded-xl bg-[#006c46] text-white text-xs font-medium">
                    Join Queue
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
