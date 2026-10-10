import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, withDB } from "@/lib/api";
import Course from "@/models/Course";

type CourseParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: CourseParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid course id");
    }

    const course = await withDB(() =>
      Course.findById(id).populate("teacher").lean(),
    );

    if (!course) {
      return jsonError("Course not found", 404);
    }

    return NextResponse.json(course);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load course";
    return jsonError(message, 500);
  }
}

export async function PATCH(request: Request, { params }: CourseParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid course id");
    }

    const body = await request.json();
    const course = await withDB(() =>
      Course.findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .populate("teacher")
        .lean(),
    );

    if (!course) {
      return jsonError("Course not found", 404);
    }

    return NextResponse.json(course);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update course";
    return jsonError(message, 500);
  }
}

export async function DELETE(_request: Request, { params }: CourseParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid course id");
    }

    const course = await withDB(() => Course.findByIdAndDelete(id).lean());

    if (!course) {
      return jsonError("Course not found", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete course";
    return jsonError(message, 500);
  }
}
