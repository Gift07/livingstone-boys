import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, withDB } from "@/lib/api";
import Parent from "@/models/Parent";

type ParentParams = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: ParentParams) {
  try {
    const { id } = await params;
    if (!isValidObjectId(id)) return jsonError("Invalid parent id");

    const parent = await withDB(() => Parent.findByIdAndDelete(id).lean());
    if (!parent) return jsonError("Parent not found", 404);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete parent";
    return jsonError(message, 500);
  }
}
