import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, withDB } from "@/lib/api";
import Subject from "@/models/Subject";

type SubjectParams = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: SubjectParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid subject id");
    }

    const subject = await withDB(() => Subject.findByIdAndDelete(id).lean());

    if (!subject) {
      return jsonError("Subject not found", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete subject";
    return jsonError(message, 500);
  }
}
