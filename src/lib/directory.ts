import Alumni from "@/models/Alumni";
import Student from "@/models/Student";
import { withDB } from "@/lib/api";

export type DirectoryResult = {
  id: string;
  kind: "student" | "alumni";
  name: string;
  year: string;
  detail: string;
};

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchPublicDirectory(
  query: string,
): Promise<DirectoryResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const pattern = new RegExp(escapeRegex(q), "i");

  const { alumni, students } = await withDB(async () => {
    const [alumniRows, studentRows] = await Promise.all([
      Alumni.find({
        $or: [
          { firstName: pattern },
          { lastName: pattern },
          { region: pattern },
          { work: pattern },
          { company: pattern },
          { phoneNumber: pattern },
          { graduationYear: pattern },
        ],
      })
        .sort({ graduationYear: -1, lastName: 1 })
        .limit(20)
        .lean(),
      Student.find({
        $or: [
          { firstName: pattern },
          { lastName: pattern },
          { grade: pattern },
        ],
      })
        .sort({ lastName: 1, firstName: 1 })
        .limit(20)
        .lean(),
    ]);

    return { alumni: alumniRows, students: studentRows };
  });

  return [
    ...students.map((student) => ({
      id: String(student._id),
      kind: "student" as const,
      name: `${student.firstName} ${student.lastName}`,
      year: student.grade,
      detail: "Current student",
    })),
    ...alumni.map((alumnus) => ({
      id: String(alumnus._id),
      kind: "alumni" as const,
      name: `${alumnus.firstName} ${alumnus.lastName}`,
      year: alumnus.graduationYear,
      detail: [alumnus.work, alumnus.company, alumnus.region]
        .filter(Boolean)
        .join(" · "),
    })),
  ];
}
