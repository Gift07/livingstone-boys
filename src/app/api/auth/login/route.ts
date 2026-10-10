import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/session";
import User from "@/models/User";

async function ensureAdmin() {
  const existing = await User.countDocuments();
  if (existing > 0) return;

  const email = (process.env.ADMIN_EMAIL || "admin@livingstone.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "livingstone";
  const name = process.env.ADMIN_NAME || "Livingstone Admin";

  await User.create({
    name,
    email,
    passwordHash: hashPassword(password),
    role: "admin",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return jsonError("Email and password are required");
    }

    const user = await withDB(async () => {
      await ensureAdmin();
      return User.findOne({ email }).lean();
    });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return jsonError("Invalid email or password", 401);
    }

    const token = await createSessionToken({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role || "admin",
    });

    const response = NextResponse.json({
      name: user.name,
      email: user.email,
      role: user.role || "admin",
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not sign in";
    return jsonError(message, 500);
  }
}
