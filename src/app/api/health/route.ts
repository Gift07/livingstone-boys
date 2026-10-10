import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const connection = await connectDB();
    const state = connection.connection.readyState;

    return NextResponse.json({
      ok: state === 1,
      database: connection.connection.name,
      status: state === 1 ? "connected" : "disconnected",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database connection failed";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
