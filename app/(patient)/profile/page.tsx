"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Profile = { name: string; phone: string; age: string; gender: string; blood_group: string };

const EMPTY: Profile = { name: "", phone: "", age: "", gender: "", blood_group: "" };

export default function ProfilePage() {
  const [form, setForm] = useState<Profile>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  // Patients have no login in the MVP; their details live in localStorage,
  // populated when they register or join a queue.
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("mk_patient") || "{}");
      setForm({ ...EMPTY, ...stored });
    } catch {}
    setLoaded(true);
  }, []);

  const set = (k: keyof Profile, v: string) => { setForm(p => ({ ...p, [k]: v })); setSaved(false); };

  const save = () => {
    localStorage.setItem("mk_patient", JSON.stringify(form));
    setSaved(true);
  };

  const hasProfile = loaded && (form.name || form.phone);

  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3 bg-white shadow-sm sticky top-0 z-10">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#e0e3e1]">
          <span className="material-symbols-outlined text-[#191c1b]">arrow_back</span>
        </Link>
        <h1 className="font-bold text-[#191c1b] text-lg">My Profile</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-8 max-w-md mx-auto w-full">
        {loaded && !hasProfile ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#e0e3e1] shadow-sm">
            <span className="material-symbols-outlined text-[#6d7a71] text-4xl">person_off</span>
            <p className="text-[#54615b] mt-2 text-sm">No profile yet.</p>
            <Link href="/register" className="inline-block mt-4 text-[#006c46] font-medium underline">Register as a patient</Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-[#e8f5ee] rounded-full flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[#006c46] text-4xl">person</span>
              </div>
              <p className="font-bold text-[#191c1b] text-xl">{form.name || "Patient"}</p>
              <p className="text-sm text-[#54615b]">{form.phone}</p>
            </div>

            <div className="flex flex-col gap-4">
              {([
                { label: "Full Name", key: "name", type: "text" },
                { label: "Phone Number", key: "phone", type: "tel" },
                { label: "Age", key: "age", type: "number" },
              ] as const).map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-[#191c1b] mb-1.5">{label}</label>
                  <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                    className="w-full bg-white border border-[#bccabf] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-[#006c46] focus:ring-2 focus:ring-[#006c46]/20 transition" />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-[#191c1b] mb-1.5">Blood Group</label>
                <div className="flex gap-2 flex-wrap">
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                    <button key={bg} type="button" onClick={() => set("blood_group", bg)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${form.blood_group === bg ? "bg-[#006c46] text-white border-[#006c46]" : "bg-white text-[#191c1b] border-[#bccabf]"}`}>
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={save}
                className="w-full bg-[#006c46] text-white font-semibold py-4 rounded-2xl mt-2 active:scale-[0.98] transition-all">
                {saved ? "✓ Saved" : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
