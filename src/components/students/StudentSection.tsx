"use client";

import { FormEvent, useEffect, useState } from "react";
import { BookMarked, Plus, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
import SideSheet from "@/components/ui/SideSheet";
import {
  Table,
  tdClass,
  tdStrongClass,
  thClass,
  theadClass,
  trClass,
} from "@/components/ui/Table";
import Initials from "@/components/ui/Initials";
import { fullName } from "@/lib/format";

type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  gender?: string;
};

type Subject = {
  _id: string;
  name: string;
  code: string;
  grade: string;
  credits: number;
};

type Sheet = "student" | "subject" | null;

const fieldClass =
  "w-full rounded-2xl border border-neutral-200 bg-[#f7f7f7] px-4 py-3 text-sm text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[#1B7A32]/20";

export default function StudentSection() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [studentForm, setStudentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    grade: "",
    gender: "Male",
  });
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    grade: "",
    credits: "3",
  });
  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/subjects"),
      ]);
      const [studentsData, subjectsData] = await Promise.all([
        studentsRes.json(),
        subjectsRes.json(),
      ]);

      if (!studentsRes.ok) throw new Error(studentsData.error || "Could not load students");
      if (!subjectsRes.ok) throw new Error(subjectsData.error || "Could not load subjects");

      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load student data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [studentsRes, subjectsRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/subjects"),
        ]);
        const [studentsData, subjectsData] = await Promise.all([
          studentsRes.json(),
          subjectsRes.json(),
        ]);

        if (!studentsRes.ok) throw new Error(studentsData.error || "Could not load students");
        if (!subjectsRes.ok) throw new Error(subjectsData.error || "Could not load subjects");

        setStudents(studentsData);
        setSubjects(subjectsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load student data");
      } finally {
        setLoading(false);
      }
    }

    void loadData();

    const timer = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("new") === "1") {
        setSheet("student");
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function saveStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save student");
      setStudentForm({ firstName: "", lastName: "", email: "", grade: "", gender: "Male" });
      setSheet(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save student");
    } finally {
      setSaving(false);
    }
  }

  async function saveSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save subject");
      setSubjectForm({ name: "", code: "", grade: "", credits: "3" });
      setSheet(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save subject");
    } finally {
      setSaving(false);
    }
  }

  async function remove(endpoint: string, id: string) {
    setError(null);
    try {
      const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <div>
      <PageHeader
        title="Students"
        description="Student records and subjects. Marks are entered under Results."
        action={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSheet("subject")}
              className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-foreground"
            >
              <BookMarked className="h-4 w-4 text-purple" />
              Add subject
            </button>
            <button
              type="button"
              onClick={() => setSheet("student")}
              className="inline-flex items-center gap-2 rounded-2xl bg-purple px-4 py-2.5 text-[13px] font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              Add student
            </button>
          </div>
        }
      />

      {error ? (
        <p className="mb-4 rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm text-[#e11d48]">
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-[16px] font-semibold">All students</h2>
          </div>
          <Table minWidth="520px">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Name</th>
                <th className={thClass}>Email</th>
                <th className={thClass}>Grade</th>
                <th className={thClass}>Gender</th>
                <th className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className={trClass}>
                  <td colSpan={5} className={`${tdClass} text-gray-500`}>
                    Loading...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr className={trClass}>
                  <td colSpan={5} className={`${tdClass} text-gray-500`}>
                    No students yet.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className={trClass}>
                    <td className={tdStrongClass}>
                      <div className="flex items-center gap-3">
                        <Initials name={fullName(student.firstName, student.lastName)} />
                        {fullName(student.firstName, student.lastName)}
                      </div>
                    </td>
                    <td className={tdClass}>{student.email}</td>
                    <td className={tdClass}>{student.grade}</td>
                    <td className={tdClass}>{student.gender || "—"}</td>
                    <td className={tdClass}>
                      <button
                        type="button"
                        onClick={() => void remove("/api/students", student._id)}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#e11d48]"
                        aria-label={`Delete ${student.firstName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-[16px] font-semibold">Subjects</h2>
          </div>
          <Table minWidth="480px">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Subject</th>
                <th className={thClass}>Code</th>
                <th className={thClass}>Grade</th>
                <th className={thClass}>Credits</th>
                <th className={thClass}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className={trClass}>
                  <td colSpan={5} className={`${tdClass} text-gray-500`}>
                    Loading...
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr className={trClass}>
                  <td colSpan={5} className={`${tdClass} text-gray-500`}>
                    No subjects yet. Open the sidesheet to add one.
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr key={subject._id} className={trClass}>
                    <td className={tdStrongClass}>{subject.name}</td>
                    <td className={tdClass}>{subject.code}</td>
                    <td className={tdClass}>{subject.grade}</td>
                    <td className={tdClass}>{subject.credits}</td>
                    <td className={tdClass}>
                      <button
                        type="button"
                        onClick={() => void remove("/api/subjects", subject._id)}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#e11d48]"
                        aria-label={`Delete ${subject.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
      </div>

      <SideSheet
        open={sheet === "student"}
        title="Add student"
        description="Create a student record in MongoDB."
        onClose={() => setSheet(null)}
      >
        <form onSubmit={saveStudent} className="flex flex-col gap-3">
          <input
            required
            className={fieldClass}
            placeholder="First name"
            value={studentForm.firstName}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, firstName: event.target.value }))
            }
          />
          <input
            required
            className={fieldClass}
            placeholder="Last name"
            value={studentForm.lastName}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, lastName: event.target.value }))
            }
          />
          <input
            required
            type="email"
            className={fieldClass}
            placeholder="Email"
            value={studentForm.email}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <input
            required
            className={fieldClass}
            placeholder="Grade"
            value={studentForm.grade}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, grade: event.target.value }))
            }
          />
          <select
            required
            className={fieldClass}
            value={studentForm.gender}
            onChange={(event) =>
              setStudentForm((current) => ({ ...current, gender: event.target.value }))
            }
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <button
            type="submit"
            disabled={saving}
            className="mt-3 rounded-2xl bg-purple px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save student"}
          </button>
        </form>
      </SideSheet>

      <SideSheet
        open={sheet === "subject"}
        title="Add subject"
        description="Save a subject to MongoDB."
        onClose={() => setSheet(null)}
      >
        <form onSubmit={saveSubject} className="flex flex-col gap-3">
          <input
            required
            className={fieldClass}
            placeholder="Subject name"
            value={subjectForm.name}
            onChange={(event) =>
              setSubjectForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <input
            required
            className={fieldClass}
            placeholder="Code, e.g. MATH101"
            value={subjectForm.code}
            onChange={(event) =>
              setSubjectForm((current) => ({ ...current, code: event.target.value }))
            }
          />
          <input
            required
            className={fieldClass}
            placeholder="Grade"
            value={subjectForm.grade}
            onChange={(event) =>
              setSubjectForm((current) => ({ ...current, grade: event.target.value }))
            }
          />
          <input
            required
            type="number"
            min={1}
            className={fieldClass}
            placeholder="Credits"
            value={subjectForm.credits}
            onChange={(event) =>
              setSubjectForm((current) => ({ ...current, credits: event.target.value }))
            }
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-3 rounded-2xl bg-purple px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save subject"}
          </button>
        </form>
      </SideSheet>
    </div>
  );
}
