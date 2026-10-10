import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function withDB<T>(handler: () => Promise<T>) {
  await connectDB();
  return handler();
}
