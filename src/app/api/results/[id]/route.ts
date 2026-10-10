import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, withDB } from "@/lib/api";
import Result from "@/models/Result";

type ResultParams = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: ResultParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid result id");
    }

    const result = await withDB(() => Result.findByIdAndDelete(id).lean());

    if (!result) {
      return jsonError("Result not found", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete result";
    return jsonError(message, 500);
  }
}
