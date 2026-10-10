"use client";

import { FormEvent, useEffect, useState } from "react";

type Student = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  grade: "",
};

export default function StudentBoard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/students");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load students");
      }

      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const response = await fetch("/api/students");
        const data = await response.json();
        if (cancelled) return;
        if (!response.ok) {
          throw new Error(data.error || "Could not load students");
        }
        setStudents(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load students");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not create student");
      }

      setForm(emptyForm);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create student");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);

    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete student");
      }

      setStudents((current) => current.filter((student) => student._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete student");
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
          Students
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          This form talks to the Next.js API, which uses Mongoose to write to
          MongoDB.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
      >
        <input
          required
          value={form.firstName}
          onChange={(event) =>
            setForm((current) => ({ ...current, firstName: event.target.value }))
          }
          placeholder="First name"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
        />
        <input
          required
          value={form.lastName}
          onChange={(event) =>
            setForm((current) => ({ ...current, lastName: event.target.value }))
          }
          placeholder="Last name"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
        />
        <input
          required
          type="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          placeholder="Email"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
        />
        <input
          required
          value={form.grade}
          onChange={(event) =>
            setForm((current) => ({ ...current, grade: event.target.value }))
          }
          placeholder="Grade"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-sky-700 px-3 py-2 text-sm font-medium text-white hover:bg-sky-800 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Add student"}
        </button>
      </form>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-slate-500">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-sm text-slate-500">
          No students yet. Add one above once MongoDB is running.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
              <tr>
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Grade</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">
                    {student.firstName} {student.lastName}
                  </td>
                  <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">
                    {student.email}
                  </td>
                  <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">
                    {student.grade}
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => void handleDelete(student._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
