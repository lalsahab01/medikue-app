"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function QueueTrackInner() {
  const params = useSearchParams();
  const token = params.get("token") ?? "22";
  const serving = 14;
  const ahead = Math.max(0, parseInt(token) - serving - 1);
  const waitMins = ahead * 5;
  const [progress, setProgress] = useState(ahead);

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.max(0, p - 1)), 30000);
    return () => clearInterval(t);
  }, []);

  const statusSteps = ["Registered", "Waiting", "Called", "With Doctor", "Done"];
  const currentStep = ahead > 3 ? 1 : ahead > 0 ? 2 : 3;

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">home</span>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#191c1b] text-lg">Queue Status</h1>
          <p className="text-xs text-[#54615b]">आपकी बारी का हाल</p>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#006c46] font-medium">
          <span className="w-1.5 h-1.5 bg-[#006c46] rounded-full animate-pulse"></span>
          Live
        </div>
      </header>

      <main className="flex-1 px-6 pt-8 pb-8 max-w-md mx-auto w-full">
        {/* Big token display */}
        <div className="bg-[#006c46] rounded-3xl p-8 text-center mb-6 shadow-lg">
          <p className="text-[#81f9bc] text-sm font-medium uppercase tracking-widest mb-1">Your Token</p>
          <p className="text-white text-8xl font-extrabold leading-none">#{token}</p>
          <p className="text-[#64dca1] mt-2 text-sm">Dr. Priya Sharma · General Physician</p>
        </div>

        {/* Status */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-3 text-center border border-[#e0e3e1] shadow-sm">
            <p className="text-2xl font-bold text-[#006c46]">{ahead}</p>
            <p className="text-xs text-[#54615b] mt-0.5">Ahead of you</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-[#e0e3e1] shadow-sm">
            <p className="text-2xl font-bold text-[#191c1b]">#{serving}</p>
            <p className="text-xs text-[#54615b] mt-0.5">Now serving</p>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-[#e0e3e1] shadow-sm">
            <p className="text-2xl font-bold text-[#191c1b]">{waitMins}m</p>
            <p className="text-xs text-[#54615b] mt-0.5">Est. wait</p>
          </div>
        </div>

        {/* Progress stepper */}
        <div className="bg-white rounded-2xl p-4 border border-[#e0e3e1] shadow-sm mb-4">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < currentStep ? "bg-[#006c46] text-white" : i === currentStep ? "bg-[#24a872] text-white ring-4 ring-[#006c46]/20" : "bg-[#e0e3e1] text-[#6d7a71]"}`}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <p className={`text-[10px] mt-1 text-center ${i <= currentStep ? "text-[#006c46] font-medium" : "text-[#6d7a71]"}`}>{step}</p>
                {i < statusSteps.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#fff9e6] border border-[#f9a825]/30 rounded-2xl p-4 flex gap-3 mb-6">
          <span className="material-symbols-outlined text-[#f9a825]">notifications</span>
          <p className="text-sm text-[#3d4a41]">You will receive an SMS when 3 patients are ahead of you.</p>
        </div>

        <button className="w-full border border-[#ba1a1a] text-[#ba1a1a] font-medium py-3 rounded-2xl text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-base">cancel</span>
          Leave Queue
        </button>
      </main>
    </div>
  );
}

export default function QueuePage() {
  return <Suspense><QueueTrackInner /></Suspense>;
}
