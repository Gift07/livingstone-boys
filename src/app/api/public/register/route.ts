import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import Alumni from "@/models/Alumni";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      graduationYear,
      region,
      work,
      company,
    } = body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !graduationYear ||
      !region ||
      !work
    ) {
      return jsonError(
        "firstName, lastName, email, phoneNumber, graduationYear, region, and work are required",
      );
    }

    const alumnus = await withDB(() =>
      Alumni.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        graduationYear,
        region,
        work,
        company: company || undefined,
      }),
    );

    return NextResponse.json(alumnus, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to register alumni";
    return jsonError(message, 500);
  }
}
