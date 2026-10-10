import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import { parseAmount } from "@/lib/money";
import Parent from "@/models/Parent";
import RecordItem from "@/models/RecordItem";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";

export async function GET() {
  try {
    const stats = await withDB(async () => {
      const [students, teachers, parents, accounts] = await Promise.all([
        Student.countDocuments(),
        Teacher.countDocuments(),
        Parent.countDocuments(),
        RecordItem.find({ module: "accounts" }).lean(),
      ]);

      const earnings = accounts.reduce((sum, item) => {
        const values = (item.values || {}) as Record<string, string>;
        if (!/fee|income|earning/i.test(String(values.type || ""))) return sum;
        return sum + parseAmount(values.amount);
      }, 0);

      return { students, teachers, parents, earnings };
    });

    return NextResponse.json(stats);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load stats";
    return jsonError(message, 500);
  }
}
