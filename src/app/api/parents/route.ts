import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import Parent from "@/models/Parent";

export async function GET() {
  try {
    const parents = await withDB(() =>
      Parent.find().sort({ createdAt: -1 }).lean(),
    );
    return NextResponse.json(parents);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load parents";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    if (!firstName || !lastName || !email || !phone) {
      return jsonError("firstName, lastName, email, and phone are required");
    }

    const parent = await withDB(() =>
      Parent.create({ firstName, lastName, email, phone }),
    );
    return NextResponse.json(parent, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create parent";
    return jsonError(message, 500);
  }
}
