import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-dvh bg-[#f7faf8] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 bg-[#ffdad6] rounded-full flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-[#ba1a1a] text-4xl">block</span>
      </div>
      <h1 className="text-2xl font-bold text-[#191c1b] mb-2">Access Denied</h1>
      <p className="text-[#54615b] max-w-sm mb-8">
        You are signed in, but this area is restricted to a different role. If you think this is
        a mistake, contact your clinic administrator.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link href="/" className="bg-[#006c46] text-white font-semibold py-3.5 rounded-2xl">
          Go to Home
        </Link>
        <Link href="/login" className="border border-[#006c46] text-[#006c46] font-semibold py-3.5 rounded-2xl">
          Sign in as another user
        </Link>
      </div>
    </div>
  );
}
