"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Clinic { id: string; name: string; address: string; city: string; phone: string }
interface InviteCode { id: string; code: string; role: string; active: boolean; clinic_id: string; clinics: { name: string } | null }
interface Account { id: string; login_id: string; name: string; role: string; status: string; clinic_id: string | null; clinics: { name: string } | null }

async function api<T>(url: string, options?: RequestInit): Promise<{ data: T | null; error: string | null }> {
  const res = await fetch(url, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { data: null, error: body.error || "Something went wrong." };
  return { data: body, error: null };
}

export default function AdminPage() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [clinicForm, setClinicForm] = useState({ name: "", address: "", city: "Delhi", phone: "" });
  const [codeForm, setCodeForm] = useState({ clinic_id: "", role: "doctor" });
  const [accountForm, setAccountForm] = useState({
    role: "staff", name: "", phone: "", password: "", clinic_id: "", specialization: "", qualification: "", staff_role: "receptionist",
  });

  const refresh = useCallback(async () => {
    const [c, i, a] = await Promise.all([
      api<{ clinics: Clinic[] }>("/api/admin/clinics"),
      api<{ codes: InviteCode[] }>("/api/admin/invite-codes"),
      api<{ accounts: Account[] }>("/api/admin/accounts"),
    ]);
    if (c.data) setClinics(c.data.clinics);
    if (i.data) setCodes(i.data.codes);
    if (a.data) setAccounts(a.data.accounts);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const createClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage("");
    const { error } = await api("/api/admin/clinics", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(clinicForm),
    });
    if (error) return setError(error);
    setMessage("Clinic created.");
    setClinicForm({ name: "", address: "", city: "Delhi", phone: "" });
    refresh();
  };

  const createCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage("");
    const { error } = await api("/api/admin/invite-codes", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(codeForm),
    });
    if (error) return setError(error);
    setMessage("Invite code generated.");
    refresh();
  };

  const createAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setMessage("");
    const { data, error } = await api<{ login_id: string }>("/api/auth/admin/create-account", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(accountForm),
    });
    if (error) return setError(error);
    setMessage(`Account created. Login ID: ${data?.login_id}`);
    setAccountForm({ role: "staff", name: "", phone: "", password: "", clinic_id: "", specialization: "", qualification: "", staff_role: "receptionist" });
    refresh();
  };

  return (
    <div className="min-h-dvh bg-[#f7faf8] px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#191c1b]">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-sm font-medium text-[#006c46] underline">Log out</button>
        </div>

        {message && <div className="bg-[#d7f5e3] text-[#006c46] text-sm px-4 py-3 rounded-xl mb-4">{message}</div>}
        {error && <div className="bg-[#ffdad6] text-[#ba1a1a] text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Clinics */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-[#191c1b] mb-3">Clinics / Branches</h2>
            <form onSubmit={createClinic} className="grid grid-cols-2 gap-2 mb-4">
              <input required placeholder="Name" value={clinicForm.name} onChange={e => setClinicForm(p => ({ ...p, name: e.target.value }))} className="col-span-2 border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Address" value={clinicForm.address} onChange={e => setClinicForm(p => ({ ...p, address: e.target.value }))} className="col-span-2 border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
              <input placeholder="City" value={clinicForm.city} onChange={e => setClinicForm(p => ({ ...p, city: e.target.value }))} className="border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Phone" value={clinicForm.phone} onChange={e => setClinicForm(p => ({ ...p, phone: e.target.value }))} className="border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
              <button className="col-span-2 bg-[#006c46] text-white rounded-lg py-2 text-sm font-semibold">Add Clinic</button>
            </form>
            <ul className="divide-y divide-[#e0e3e1]">
              {clinics.map(c => (
                <li key={c.id} className="py-2 text-sm">
                  <p className="font-medium text-[#191c1b]">{c.name}</p>
                  <p className="text-[#6d7a71] text-xs">{c.address}, {c.city} · {c.phone}</p>
                </li>
              ))}
              {clinics.length === 0 && <p className="text-[#6d7a71] text-sm py-2">No clinics yet.</p>}
            </ul>
          </section>

          {/* Invite codes */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-[#191c1b] mb-3">Doctor / Staff Invite Codes</h2>
            <form onSubmit={createCode} className="grid grid-cols-2 gap-2 mb-4">
              <select required value={codeForm.clinic_id} onChange={e => setCodeForm(p => ({ ...p, clinic_id: e.target.value }))} className="col-span-2 border border-[#bccabf] rounded-lg px-3 py-2 text-sm">
                <option value="">Select clinic</option>
                {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={codeForm.role} onChange={e => setCodeForm(p => ({ ...p, role: e.target.value }))} className="border border-[#bccabf] rounded-lg px-3 py-2 text-sm">
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
              </select>
              <button className="bg-[#006c46] text-white rounded-lg py-2 text-sm font-semibold">Generate</button>
            </form>
            <ul className="divide-y divide-[#e0e3e1]">
              {codes.map(c => (
                <li key={c.id} className="py-2 text-sm flex justify-between">
                  <span className="font-mono font-medium text-[#191c1b]">{c.code}</span>
                  <span className="text-[#6d7a71] text-xs">{c.clinics?.name} · {c.role} · {c.active ? "active" : "inactive"}</span>
                </li>
              ))}
              {codes.length === 0 && <p className="text-[#6d7a71] text-sm py-2">No invite codes yet.</p>}
            </ul>
          </section>

          {/* Create account directly */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-[#191c1b] mb-3">Create Doctor / Staff Login</h2>
            <form onSubmit={createAccount} className="grid grid-cols-2 gap-2">
              <select value={accountForm.role} onChange={e => setAccountForm(p => ({ ...p, role: e.target.value }))} className="col-span-2 border border-[#bccabf] rounded-lg px-3 py-2 text-sm">
                <option value="staff">Clinical Staff</option>
                <option value="doctor">Doctor</option>
              </select>
              <select required value={accountForm.clinic_id} onChange={e => setAccountForm(p => ({ ...p, clinic_id: e.target.value }))} className="col-span-2 border border-[#bccabf] rounded-lg px-3 py-2 text-sm">
                <option value="">Select clinic</option>
                {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input required placeholder="Full name" value={accountForm.name} onChange={e => setAccountForm(p => ({ ...p, name: e.target.value }))} className="col-span-2 border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="10-digit mobile" value={accountForm.phone} onChange={e => setAccountForm(p => ({ ...p, phone: e.target.value }))} className="border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
              <input required type="password" placeholder="Password" value={accountForm.password} onChange={e => setAccountForm(p => ({ ...p, password: e.target.value }))} className="border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
              {accountForm.role === "doctor" ? (
                <>
                  <input required placeholder="Specialization" value={accountForm.specialization} onChange={e => setAccountForm(p => ({ ...p, specialization: e.target.value }))} className="border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
                  <input placeholder="Qualification" value={accountForm.qualification} onChange={e => setAccountForm(p => ({ ...p, qualification: e.target.value }))} className="border border-[#bccabf] rounded-lg px-3 py-2 text-sm" />
                </>
              ) : (
                <select value={accountForm.staff_role} onChange={e => setAccountForm(p => ({ ...p, staff_role: e.target.value }))} className="col-span-2 border border-[#bccabf] rounded-lg px-3 py-2 text-sm">
                  <option value="receptionist">Receptionist</option>
                  <option value="nurse">Nurse</option>
                  <option value="pharmacist">Pharmacist</option>
                </select>
              )}
              <button className="col-span-2 bg-[#006c46] text-white rounded-lg py-2 text-sm font-semibold">Create Account</button>
            </form>
          </section>

          {/* Accounts list */}
          <section className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-[#191c1b] mb-3">All Doctor / Staff / Admin Accounts</h2>
            <ul className="divide-y divide-[#e0e3e1] max-h-96 overflow-y-auto">
              {accounts.map(a => (
                <li key={a.id} className="py-2 text-sm flex justify-between">
                  <div>
                    <p className="font-medium text-[#191c1b]">{a.name} <span className="text-[#6d7a71] font-normal">({a.role})</span></p>
                    <p className="text-[#6d7a71] text-xs">ID: {a.login_id} · {a.clinics?.name || "-"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full h-fit ${a.status === "active" ? "bg-[#d7f5e3] text-[#006c46]" : "bg-[#ffdad6] text-[#ba1a1a]"}`}>{a.status}</span>
                </li>
              ))}
              {accounts.length === 0 && <p className="text-[#6d7a71] text-sm py-2">No accounts yet.</p>}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
