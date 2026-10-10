import { NextResponse } from "next/server";
import { jsonError, withDB } from "@/lib/api";
import { parseAmount } from "@/lib/money";
import Alumni from "@/models/Alumni";
import Parent from "@/models/Parent";
import RecordItem from "@/models/RecordItem";
import Result from "@/models/Result";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import "@/models/Subject";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function monthIndex(value: Date) {
  return value.getMonth();
}

function formatWhen(date: Date) {
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "Just now";
  if (diff < 3_600_000) return `${Math.max(1, Math.floor(diff / 60_000))} min ago`;
  if (diff < 86_400_000) return "Today";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function GET() {
  try {
    const data = await withDB(async () => {
      const year = new Date().getFullYear();
      const start = new Date(year, 0, 1);

      const [
        students,
        teachers,
        parents,
        alumni,
        accounts,
        examRecords,
        yearResults,
        genderRows,
        stars,
        notices,
        latestResults,
      ] = await Promise.all([
        Student.countDocuments(),
        Teacher.countDocuments(),
        Parent.countDocuments(),
        Alumni.countDocuments(),
        RecordItem.find({ module: "accounts" }).lean(),
        RecordItem.find({ module: "exams", createdAt: { $gte: start } }).lean(),
        Result.find({ createdAt: { $gte: start } }).select("createdAt").lean(),
        Student.aggregate<{ _id: string | null; count: number }>([
          { $group: { _id: "$gender", count: { $sum: 1 } } },
        ]),
        Result.aggregate([
          {
            $group: {
              _id: "$student",
              marks: { $sum: "$marks" },
              maxMarks: { $sum: "$maxMarks" },
            },
          },
          {
            $lookup: {
              from: "students",
              localField: "_id",
              foreignField: "_id",
              as: "student",
            },
          },
          { $unwind: "$student" },
          {
            $project: {
              firstName: "$student.firstName",
              lastName: "$student.lastName",
              grade: "$student.grade",
              marks: 1,
              percent: {
                $round: [
                  {
                    $multiply: [{ $divide: ["$marks", "$maxMarks"] }, 100],
                  },
                  0,
                ],
              },
              year: { $year: "$student.createdAt" },
            },
          },
          { $sort: { percent: -1, marks: -1 } },
          { $limit: 4 },
        ]),
        RecordItem.find({ module: "notices" }).sort({ createdAt: -1 }).limit(5).lean(),
        Result.find()
          .populate("student", "firstName lastName")
          .populate("subject", "name")
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

      const earnings = accounts.reduce((sum, item) => {
        const values = (item.values || {}) as Record<string, string>;
        const type = String(values.type || "");
        if (!/fee|income|earning/i.test(type)) return sum;
        return sum + parseAmount(values.amount);
      }, 0);

      const resultsByMonth = Array(12).fill(0);
      for (const row of yearResults) {
        resultsByMonth[monthIndex(new Date(row.createdAt))] += 1;
      }

      const examsByMonth = Array(12).fill(0);
      for (const row of examRecords) {
        examsByMonth[monthIndex(new Date(row.createdAt))] += 1;
      }

      const gender = { male: 0, female: 0 };
      for (const row of genderRows) {
        if (row._id === "Female") gender.female += row.count;
        else if (row._id === "Male") gender.male += row.count;
      }

      const activity = [
        ...notices.map((notice) => {
          const values = (notice.values || {}) as Record<string, string>;
          return {
            title: values.title || "Notice",
            copy: values.audience ? `For ${values.audience}` : "School notice",
            time: formatWhen(new Date(notice.createdAt)),
            kind: "notice" as const,
          };
        }),
        ...latestResults.map((result) => {
          const student = result.student as
            | { firstName?: string; lastName?: string }
            | undefined;
          const subject = result.subject as { name?: string } | undefined;
          return {
            title: result.examName,
            copy: `${student?.firstName || "Student"} ${student?.lastName || ""} · ${subject?.name || "Subject"} · ${result.marks}/${result.maxMarks}`.replace(
              /\s+/g,
              " ",
            ),
            time: formatWhen(new Date(result.createdAt)),
            kind: "result" as const,
          };
        }),
      ].slice(0, 5);

      return {
        stats: { students, teachers, parents, earnings, alumni },
        gender,
        chart: {
          year,
          months: months.map((label) => label.slice(0, 3)),
          results: resultsByMonth,
          exams: examsByMonth,
        },
        stars: stars.map((row) => ({
          _id: String(row._id),
          firstName: row.firstName,
          lastName: row.lastName,
          grade: row.grade,
          marks: row.marks,
          percent: row.percent,
          year: String(row.year),
        })),
        activity,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load dashboard";
    return jsonError(message, 500);
  }
}
