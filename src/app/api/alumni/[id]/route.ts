import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";
import { jsonError, withDB } from "@/lib/api";
import Alumni from "@/models/Alumni";

type AlumniParams = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: AlumniParams) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return jsonError("Invalid alumni id");
    }

    const alumnus = await withDB(() => Alumni.findByIdAndDelete(id).lean());

    if (!alumnus) {
      return jsonError("Alumni record not found", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete alumni record";
    return jsonError(message, 500);
  }
}
