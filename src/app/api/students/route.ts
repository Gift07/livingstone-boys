import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import Student from "@/models/Student";

export async function GET() {
  try {
    const students = await withDB(() =>
      Student.find().sort({ createdAt: -1 }).lean(),
    );

    return NextResponse.json(students);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load students";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, grade, gender, dateOfBirth } = body;

    if (!firstName || !lastName || !email || !grade) {
      return jsonError("firstName, lastName, email, and grade are required");
    }

    const student = await withDB(() =>
      Student.create({
        firstName,
        lastName,
        email,
        grade,
        gender: gender || undefined,
        dateOfBirth: dateOfBirth || undefined,
      }),
    );

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create student";
    return jsonError(message, 500);
  }
}
