import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import Teacher from "@/models/Teacher";

export async function GET() {
  try {
    const teachers = await withDB(() =>
      Teacher.find().sort({ createdAt: -1 }).lean(),
    );

    return NextResponse.json(teachers);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load teachers";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject } = body;

    if (!firstName || !lastName || !email || !subject) {
      return jsonError("firstName, lastName, email, and subject are required");
    }

    const teacher = await withDB(() =>
      Teacher.create({ firstName, lastName, email, subject }),
    );

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create teacher";
    return jsonError(message, 500);
  }
}
