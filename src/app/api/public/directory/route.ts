import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { searchPublicDirectory } from "@/lib/directory";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams.get("q")?.trim() || "";
    const results = await searchPublicDirectory(query);
    return NextResponse.json({ results });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not search the directory";
    return jsonError(message, 500);
  }
}
