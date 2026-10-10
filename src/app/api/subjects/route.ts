import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import Subject from "@/models/Subject";

export async function GET() {
  try {
    const subjects = await withDB(() =>
      Subject.find().sort({ createdAt: -1 }).lean(),
    );

    return NextResponse.json(subjects);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load subjects";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, grade, credits } = body;

    if (!name || !code || !grade) {
      return jsonError("name, code, and grade are required");
    }

    const subject = await withDB(() =>
      Subject.create({
        name,
        code,
        grade,
        credits: credits ? Number(credits) : 3,
      }),
    );

    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create subject";
    return jsonError(message, 500);
  }
}
