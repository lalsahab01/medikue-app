"use client";
import { useState } from "react";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PrescriptionInner() {
  const params = useSearchParams();
  const patient = params.get("patient") ?? "Patient";
  const token = params.get("token") ?? "1";
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [meds, setMeds] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [saved, setSaved] = useState(false);

  const addMed = () => setMeds(m => [...m, { name: "", dosage: "", frequency: "", duration: "" }]);
  const updateMed = (i: number, key: string, val: string) =>
    setMeds(m => m.map((med, idx) => idx === i ? { ...med, [key]: val } : med));

  if (saved) {
    return (
      <div className="min-h-dvh bg-[#f7faf8] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[#006c46] text-4xl">check_circle</span>
        </div>
        <h2 className="text-xl font-bold text-[#191c1b] mb-2">Prescription Saved</h2>
        <p className="text-[#54615b] text-center mb-8">Patient will receive their prescription.</p>
        <Link href="/dashboard" className="w-full max-w-xs bg-[#006c46] text-white font-semibold py-4 rounded-2xl text-center block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/dashboard" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <div className="flex-1">
          <h1 className="font-bold text-[#191c1b] text-lg">Prescription</h1>
          <p className="text-xs text-[#54615b]">Token #{token} - {patient}</p>
        </div>
      </header>
      <main className="flex-1 px-4 pt-4 pb-8 max-w-lg mx-auto w-full">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Diagnosis *</label>
            <input value={diagnosis} onChange={e => setDiagnosis(e.target.value)} placeholder="e.g. Viral Fever, Hypertension"
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[#191c1b]">Medications</label>
              <button onClick={addMed} type="button" className="text-[#006c46] text-sm font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-base">add</span> Add
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {meds.map((med, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-[#e0e3e1] shadow-sm">
                  <p className="text-xs font-semibold text-[#006c46] mb-2">Medicine {i + 1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["name","dosage","frequency","duration"] as const).map(f => (
                      <div key={f}>
                        <label className="block text-xs text-[#54615b] mb-0.5 capitalize">{f}</label>
                        <input value={med[f]} onChange={e => updateMed(i, f, e.target.value)}
                          placeholder={f === "name" ? "Paracetamol" : f === "dosage" ? "500mg" : f === "frequency" ? "3x daily" : "5 days"}
                          className="w-full bg-[#f7faf8] border border-[#bccabf] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#006c46] transition" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Notes / Instructions</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Additional notes..."
              className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] resize-none transition" />
          </div>
          <button onClick={() => setSaved(true)} disabled={!diagnosis}
            className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60">
            <span className="material-symbols-outlined">save</span>
            Save Prescription
          </button>
        </div>
      </main>
    </div>
  );
}

export default function PrescriptionPage() {
  return <Suspense><PrescriptionInner /></Suspense>;
}
