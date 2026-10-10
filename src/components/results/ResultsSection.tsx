"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import PrintHeader from "@/components/print/PrintHeader";
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
import { fullName } from "@/lib/format";
import { school } from "@/lib/school";

type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  grade: string;
};

type Subject = {
  _id: string;
  name: string;
  code: string;
};

type Result = {
  _id: string;
  examName: string;
  marks: number;
  maxMarks: number;
  term: string;
  student?: Student | string;
  subject?: Subject | string;
};

type View = "subject" | "all";

const fieldClass =
  "w-full rounded-2xl border border-neutral-200 bg-[#f7f7f7] px-4 py-3 text-sm text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[#1B7A32]/20";

const chipClass = (active: boolean) =>
  `rounded-2xl px-4 py-2.5 text-[13px] font-medium ${
    active
      ? "bg-purple text-white"
      : "border border-line bg-white text-foreground"
  }`;

function percent(marks: number, maxMarks: number) {
  if (!maxMarks) return 0;
  return Math.round((marks / maxMarks) * 100);
}

function subjectIdOf(result: Result) {
  if (result.subject && typeof result.subject === "object") return result.subject._id;
  return String(result.subject || "");
}

function studentRecord(result: Result) {
  return result.student && typeof result.student === "object" ? result.student : null;
}

export default function ResultsSection() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<View>("subject");
  const [subjectId, setSubjectId] = useState("");
  const [term, setTerm] = useState("");
  const [form, setForm] = useState({
    student: "",
    subject: "",
    examName: "",
    marks: "",
    maxMarks: "100",
    term: "Term 1",
  });

  const terms = useMemo(() => {
    return [...new Set(results.map((row) => row.term).filter(Boolean))];
  }, [results]);

  const activeSubjectId = subjectId || subjects[0]?._id || "";
  const activeSubject = subjects.find((subject) => subject._id === activeSubjectId);

  const filtered = useMemo(() => {
    return results.filter((row) => !term || row.term === term);
  }, [results, term]);

  const singleRows = useMemo(() => {
    return filtered.filter((row) => subjectIdOf(row) === activeSubjectId);
  }, [filtered, activeSubjectId]);

  const combinedRows = useMemo(() => {
    const byStudent = new Map<
      string,
      {
        student: Student;
        scores: Record<string, { marks: number; maxMarks: number }>;
      }
    >();

    for (const row of filtered) {
      const student = studentRecord(row);
      const sid = subjectIdOf(row);
      if (!student || !sid) continue;

      const current = byStudent.get(student._id) || {
        student,
        scores: {},
      };
      const score = current.scores[sid] || { marks: 0, maxMarks: 0 };
      current.scores[sid] = {
        marks: score.marks + row.marks,
        maxMarks: score.maxMarks + row.maxMarks,
      };
      byStudent.set(student._id, current);
    }

    return [...byStudent.values()].sort((a, b) =>
      fullName(a.student.firstName, a.student.lastName).localeCompare(
        fullName(b.student.firstName, b.student.lastName),
      ),
    );
  }, [filtered]);

  const printTitle =
    view === "subject"
      ? `Results — ${activeSubject ? `${activeSubject.name} (${activeSubject.code})` : "Single subject"}${term ? ` · ${term}` : ""}`
      : `Results — All subjects${term ? ` · ${term}` : ""}`;

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, subjectsRes, resultsRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/subjects"),
        fetch("/api/results"),
      ]);
      const [studentsData, subjectsData, resultsData] = await Promise.all([
        studentsRes.json(),
        subjectsRes.json(),
        resultsRes.json(),
      ]);
      if (!studentsRes.ok) throw new Error(studentsData.error || "Could not load students");
      if (!subjectsRes.ok) throw new Error(subjectsData.error || "Could not load subjects");
      if (!resultsRes.ok) throw new Error(resultsData.error || "Could not load results");
      setStudents(studentsData);
      setSubjects(subjectsData);
      setResults(resultsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load results");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [studentsRes, subjectsRes, resultsRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/subjects"),
          fetch("/api/results"),
        ]);
        const [studentsData, subjectsData, resultsData] = await Promise.all([
          studentsRes.json(),
          subjectsRes.json(),
          resultsRes.json(),
        ]);
        if (!studentsRes.ok) throw new Error(studentsData.error || "Could not load students");
        if (!subjectsRes.ok) throw new Error(subjectsData.error || "Could not load subjects");
        if (!resultsRes.ok) throw new Error(resultsData.error || "Could not load results");
        setStudents(studentsData);
        setSubjects(subjectsData);
        setResults(resultsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load results");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save result");
      setForm({
        student: "",
        subject: "",
        examName: "",
        marks: "",
        maxMarks: "100",
        term: "Term 1",
      });
      setOpen(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save result");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      const response = await fetch(`/api/results/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete");
      setResults((current) => current.filter((row) => row._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <div>
      <PrintHeader title={printTitle} />

      <div className="no-print">
        <PageHeader
          title="Results"
          description="Print a single-subject sheet or a combined report across all subjects."
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 text-[13px] font-medium"
              >
                <Printer className="h-4 w-4" />
                Print results
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-purple px-4 py-2.5 text-[13px] font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Add result
              </button>
            </div>
          }
        />

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={chipClass(view === "subject")}
            onClick={() => setView("subject")}
          >
            Single subject
          </button>
          <button
            type="button"
            className={chipClass(view === "all")}
            onClick={() => setView("all")}
          >
            All subjects
          </button>
          {view === "subject" ? (
            <select
              value={activeSubjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              className="h-10 rounded-2xl border border-line bg-white px-3 text-[13px] outline-none"
            >
              {subjects.length === 0 ? (
                <option value="">No subjects yet</option>
              ) : (
                subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} ({subject.code})
                  </option>
                ))
              )}
            </select>
          ) : null}
          <select
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            className="h-10 rounded-2xl border border-line bg-white px-3 text-[13px] outline-none"
          >
            <option value="">All terms</option>
            {terms.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <p className="no-print mb-4 rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm text-[#e11d48]">
          {error}
        </p>
      ) : null}

      {view === "subject" ? (
        <Card className="overflow-hidden p-0 print:border-0">
          <Table minWidth="720px">
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Student</th>
                <th className={thClass}>Class</th>
                <th className={thClass}>Paper</th>
                <th className={thClass}>Marks</th>
                <th className={thClass}>Percent</th>
                <th className={thClass}>Term</th>
                <th className={`${thClass} no-print`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className={trClass}>
                  <td colSpan={7} className={`${tdClass} text-gray-500`}>
                    Loading...
                  </td>
                </tr>
              ) : singleRows.length === 0 ? (
                <tr className={trClass}>
                  <td colSpan={7} className={`${tdClass} text-gray-500`}>
                    No marks for this subject yet.
                  </td>
                </tr>
              ) : (
                singleRows.map((result) => {
                  const student = studentRecord(result);
                  return (
                    <tr key={result._id} className={trClass}>
                      <td className={tdStrongClass}>
                        {student
                          ? fullName(student.firstName, student.lastName)
                          : "—"}
                      </td>
                      <td className={tdClass}>{student?.grade || "—"}</td>
                      <td className={tdClass}>{result.examName}</td>
                      <td className={tdClass}>
                        {result.marks}/{result.maxMarks}
                      </td>
                      <td className={tdClass}>
                        {percent(result.marks, result.maxMarks)}%
                      </td>
                      <td className={tdClass}>{result.term}</td>
                      <td className={`${tdClass} no-print`}>
                        <button
                          type="button"
                          onClick={() => void onDelete(result._id)}
                          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#e11d48]"
                          aria-label="Delete result"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0 print:border-0">
          <Table minWidth={`${Math.max(720, 280 + subjects.length * 90)}px`}>
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Student</th>
                <th className={thClass}>Class</th>
                {subjects.map((subject) => (
                  <th key={subject._id} className={thClass}>
                    {subject.code || subject.name}
                  </th>
                ))}
                <th className={thClass}>Total</th>
                <th className={thClass}>Average</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className={trClass}>
                  <td
                    colSpan={subjects.length + 4}
                    className={`${tdClass} text-gray-500`}
                  >
                    Loading...
                  </td>
                </tr>
              ) : combinedRows.length === 0 ? (
                <tr className={trClass}>
                  <td
                    colSpan={subjects.length + 4}
                    className={`${tdClass} text-gray-500`}
                  >
                    No combined results yet.
                  </td>
                </tr>
              ) : (
                combinedRows.map((row) => {
                  let totalMarks = 0;
                  let totalMax = 0;
                  return (
                    <tr key={row.student._id} className={trClass}>
                      <td className={tdStrongClass}>
                        {fullName(row.student.firstName, row.student.lastName)}
                      </td>
                      <td className={tdClass}>{row.student.grade}</td>
                      {subjects.map((subject) => {
                        const score = row.scores[subject._id];
                        if (score) {
                          totalMarks += score.marks;
                          totalMax += score.maxMarks;
                        }
                        return (
                          <td key={subject._id} className={tdClass}>
                            {score
                              ? `${percent(score.marks, score.maxMarks)}%`
                              : "—"}
                          </td>
                        );
                      })}
                      <td className={tdClass}>
                        {totalMax ? `${totalMarks}/${totalMax}` : "—"}
                      </td>
                      <td className={tdClass}>
                        {totalMax ? `${percent(totalMarks, totalMax)}%` : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card>
      )}

      <p className="print-only mt-8 text-xs">
        Printed from the {school.name} school system.
      </p>

      <SideSheet
        open={open}
        title="Add result"
        description="Record marks for one student and one subject."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <select
            required
            className={fieldClass}
            value={form.student}
            onChange={(event) =>
              setForm((current) => ({ ...current, student: event.target.value }))
            }
          >
            <option value="">Select student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {fullName(student.firstName, student.lastName)} — {student.grade}
              </option>
            ))}
          </select>
          <select
            required
            className={fieldClass}
            value={form.subject}
            onChange={(event) =>
              setForm((current) => ({ ...current, subject: event.target.value }))
            }
          >
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name} ({subject.code})
              </option>
            ))}
          </select>
          <input
            required
            className={fieldClass}
            placeholder="Paper / exam name"
            value={form.examName}
            onChange={(event) =>
              setForm((current) => ({ ...current, examName: event.target.value }))
            }
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              min={0}
              className={fieldClass}
              placeholder="Marks"
              value={form.marks}
              onChange={(event) =>
                setForm((current) => ({ ...current, marks: event.target.value }))
              }
            />
            <input
              required
              type="number"
              min={1}
              className={fieldClass}
              placeholder="Max marks"
              value={form.maxMarks}
              onChange={(event) =>
                setForm((current) => ({ ...current, maxMarks: event.target.value }))
              }
            />
          </div>
          <input
            className={fieldClass}
            placeholder="Term"
            value={form.term}
            onChange={(event) =>
              setForm((current) => ({ ...current, term: event.target.value }))
            }
          />
          <button
            type="submit"
            disabled={saving || students.length === 0 || subjects.length === 0}
            className="mt-3 rounded-2xl bg-purple px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save result"}
          </button>
          {students.length === 0 || subjects.length === 0 ? (
            <p className="text-[12px] text-muted">
              Add a student and a subject first.
            </p>
          ) : null}
        </form>
      </SideSheet>
    </div>
  );
}
