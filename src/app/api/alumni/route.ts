import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import Alumni from "@/models/Alumni";

export async function GET() {
  try {
    const alumni = await withDB(() =>
      Alumni.find().sort({ createdAt: -1 }).lean(),
    );

    return NextResponse.json(alumni);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load alumni";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, graduationYear, college, work, company } =
      body;

    if (!firstName || !lastName || !email || !graduationYear || !college || !work) {
      return jsonError(
        "firstName, lastName, email, graduationYear, college, and work are required",
      );
    }

    const alumnus = await withDB(() =>
      Alumni.create({
        firstName,
        lastName,
        email,
        graduationYear,
        college,
        work,
        company: company || undefined,
      }),
    );

    return NextResponse.json(alumnus, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create alumni record";
    return jsonError(message, 500);
  }
}
