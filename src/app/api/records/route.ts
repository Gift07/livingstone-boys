import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import { recordModules } from "@/lib/modules";
import RecordItem from "@/models/RecordItem";

function flatten(item: { _id: unknown; values?: Record<string, string> }) {
  return { _id: String(item._id), ...(item.values || {}) };
}

export async function GET(request: Request) {
  try {
    const moduleKey = new URL(request.url).searchParams.get("module") || "";
    if (!recordModules[moduleKey]) {
      return jsonError("Unknown module");
    }

    const rows = await withDB(() =>
      RecordItem.find({ module: moduleKey }).sort({ createdAt: -1 }).lean(),
    );

    return NextResponse.json(rows.map(flatten));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load records";
    return jsonError(message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const moduleKey = String(body.module || "");
    const config = recordModules[moduleKey];
    if (!config) return jsonError("Unknown module");

    const values: Record<string, string> = {};
    for (const field of config.fields) {
      const value = String(body[field.key] ?? "").trim();
      if (field.required && !value) {
        return jsonError(`${field.label} is required`);
      }
      values[field.key] = value;
    }

    const created = await withDB(() => RecordItem.create({ module: moduleKey, values }));
    return NextResponse.json(flatten(created), { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create record";
    return jsonError(message, 500);
  }
}
