import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import Result from "@/models/Result";
import "@/models/Student";
import "@/models/Subject";

export async function GET() {
  try {
    const results = await withDB(() =>
      Result.find()
        .populate("student", "firstName lastName grade")
        .populate("subject", "name code")
        .sort({ createdAt: -1 })
        .lean(),
    );

    return NextResponse.json(results);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load results";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student, subject, examName, marks, maxMarks, term } = body;

    if (!student || !subject || !examName || marks === undefined) {
      return jsonError("student, subject, examName, and marks are required");
    }

    const result = await withDB(async () => {
      const created = await Result.create({
        student,
        subject,
        examName,
        marks: Number(marks),
        maxMarks: maxMarks ? Number(maxMarks) : 100,
        term: term || "Term 1",
      });

      return created.populate([
        { path: "student", select: "firstName lastName grade" },
        { path: "subject", select: "name code" },
      ]);
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create result";
    return jsonError(message, 500);
  }
}
