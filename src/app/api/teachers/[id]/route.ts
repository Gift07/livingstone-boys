import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, withDB } from "@/lib/api";
import Teacher from "@/models/Teacher";

type TeacherParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: TeacherParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid teacher id");
    }

    const teacher = await withDB(() => Teacher.findById(id).lean());

    if (!teacher) {
      return jsonError("Teacher not found", 404);
    }

    return NextResponse.json(teacher);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load teacher";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, { params }: TeacherParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid teacher id");
    }

    const body = await request.json();
    const teacher = await withDB(() =>
      Teacher.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean(),
    );

    if (!teacher) {
      return jsonError("Teacher not found", 404);
    }

    return NextResponse.json(teacher);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update teacher";
    return jsonError(message, 500);
  }
}

export async function DELETE(_request: Request, { params }: TeacherParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid teacher id");
    }

    const teacher = await withDB(() => Teacher.findByIdAndDelete(id).lean());

    if (!teacher) {
      return jsonError("Teacher not found", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete teacher";
    return jsonError(message, 500);
  }
}
