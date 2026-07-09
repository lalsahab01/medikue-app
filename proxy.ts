import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "./lib/auth/session";

// Routes that require a session, mapped to the roles allowed to access them.
const PROTECTED_PREFIXES: { prefix: string; roles: string[] }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/dashboard", roles: ["doctor", "staff"] },
];

function getSecretKey() {
  return new TextEncoder().encode(process.env.SESSION_SECRET!);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = PROTECTED_PREFIXES.find((p) => pathname.startsWith(p.prefix));
  if (!match) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return redirectToLogin(request);

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const role = payload.role as string;
    // Authenticated but wrong role for this area -> Unauthorized (not the login page).
    if (!match.roles.includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    return NextResponse.next();
  } catch {
    // Missing/expired/invalid session -> send to login, remembering where they wanted to go.
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
