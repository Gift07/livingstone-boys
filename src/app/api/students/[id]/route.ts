import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, withDB } from "@/lib/api";
import Student from "@/models/Student";

type StudentParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: StudentParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid student id");
    }

    const student = await withDB(() => Student.findById(id).lean());

    if (!student) {
      return jsonError("Student not found", 404);
    }

    return NextResponse.json(student);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load student";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, { params }: StudentParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid student id");
    }

    const body = await request.json();
    const student = await withDB(() =>
      Student.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean(),
    );

    if (!student) {
      return jsonError("Student not found", 404);
    }

    return NextResponse.json(student);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update student";
    return jsonError(message, 500);
  }
}

export async function DELETE(_request: Request, { params }: StudentParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid student id");
    }

    const student = await withDB(() => Student.findByIdAndDelete(id).lean());

    if (!student) {
      return jsonError("Student not found", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete student";
    return jsonError(message, 500);
  }
}
