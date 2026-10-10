import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function GET() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  return NextResponse.json(session);
}
