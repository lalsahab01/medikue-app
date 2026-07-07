import { NextResponse } from "next/server";
import { getSession, Role, SessionPayload } from "./session";

export async function requireRole(
  roles: Role[]
): Promise<{ session: SessionPayload; error: null } | { session: null; error: NextResponse }> {
  const session = await getSession();
  if (!session || !roles.includes(session.role)) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}
