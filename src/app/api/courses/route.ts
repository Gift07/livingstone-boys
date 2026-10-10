import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import Course from "@/models/Course";

export async function GET() {
  try {
    const courses = await withDB(() =>
      Course.find().populate("teacher").sort({ createdAt: -1 }).lean(),
    );

    return NextResponse.json(courses);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load courses";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, description, credits, teacher } = body;

    if (!name || !code) {
      return jsonError("name and code are required");
    }

    const course = await withDB(() =>
      Course.create({
        name,
        code,
        description,
        credits,
        teacher: teacher || undefined,
      }),
    );

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create course";
    return jsonError(message, 500);
  }
}
