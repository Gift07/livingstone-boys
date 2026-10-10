import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, withDB } from "@/lib/api";
import RecordItem from "@/models/RecordItem";

type RecordParams = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: RecordParams) {
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError("Invalid record id");

    const deleted = await withDB(() => RecordItem.findByIdAndDelete(id).lean());
    if (!deleted) return jsonError("Record not found", 404);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete record";
    return jsonError(message, 500);
  }
}
