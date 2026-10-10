"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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

type Alumnus = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  graduationYear: string;
  college: string;
  work: string;
  company?: string;
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  graduationYear: "",
  college: "",
  work: "",
  company: "",
};

const fieldClass =
  "w-full rounded-2xl border border-neutral-200 bg-[#f7f7f7] px-4 py-3 text-sm text-foreground outline-none focus:bg-white focus:ring-2 focus:ring-[#1B7A32]/20";

export default function AlumniSection() {
  const [alumni, setAlumni] = useState<Alumnus[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  async function refresh() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/alumni");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load alumni");
      setAlumni(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load alumni");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/alumni");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load alumni");
        setAlumni(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load alumni");
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
      const response = await fetch("/api/alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save graduate");
      setForm(emptyForm);
      setOpen(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save graduate");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      const response = await fetch(`/api/alumni/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete");
      setAlumni((current) => current.filter((person) => person._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <div>
      <PageHeader
        title="Alumni"
        description="Graduates, the colleges they attended, and the work they do now."
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-purple px-4 py-2.5 text-[13px] font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add graduate
          </button>
        }
      />

      {error ? (
        <p className="mb-4 rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm text-[#e11d48]">
          {error}
        </p>
      ) : null}

      <Card className="overflow-hidden p-0">
        <Table minWidth="760px">
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Year</th>
              <th className={thClass}>College</th>
              <th className={thClass}>Work now</th>
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
            ) : alumni.length === 0 ? (
              <tr className={trClass}>
                <td colSpan={5} className={`${tdClass} text-gray-500`}>
                  No graduates yet. Open the sidesheet to add one.
                </td>
              </tr>
            ) : (
              alumni.map((person) => (
                <tr key={person._id} className={trClass}>
                  <td className={tdStrongClass}>
                    <div className="flex items-center gap-3">
                      <Initials name={fullName(person.firstName, person.lastName)} />
                      <div>
                        <p>{fullName(person.firstName, person.lastName)}</p>
                        <p className="text-xs font-normal text-gray-500">
                          {person.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={tdClass}>{person.graduationYear}</td>
                  <td className={tdClass}>{person.college}</td>
                  <td className={tdClass}>
                    {person.work}
                    {person.company ? ` · ${person.company}` : ""}
                  </td>
                  <td className={tdClass}>
                    <button
                      type="button"
                      onClick={() => void onDelete(person._id)}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#e11d48]"
                      aria-label={`Delete ${person.firstName}`}
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

      <SideSheet
        open={open}
        title="Add graduate"
        description="Save a former student, their college, and current work."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            required
            className={fieldClass}
            placeholder="First name"
            value={form.firstName}
            onChange={(event) =>
              setForm((current) => ({ ...current, firstName: event.target.value }))
            }
          />
          <input
            required
            className={fieldClass}
            placeholder="Last name"
            value={form.lastName}
            onChange={(event) =>
              setForm((current) => ({ ...current, lastName: event.target.value }))
            }
          />
          <input
            required
            type="email"
            className={fieldClass}
            placeholder="Email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <input
            required
            className={fieldClass}
            placeholder="Graduation year"
            value={form.graduationYear}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                graduationYear: event.target.value,
              }))
            }
          />
          <input
            required
            className={fieldClass}
            placeholder="College they went to"
            value={form.college}
            onChange={(event) =>
              setForm((current) => ({ ...current, college: event.target.value }))
            }
          />
          <input
            required
            className={fieldClass}
            placeholder="Work they are doing now"
            value={form.work}
            onChange={(event) =>
              setForm((current) => ({ ...current, work: event.target.value }))
            }
          />
          <input
            className={fieldClass}
            placeholder="Company (optional)"
            value={form.company}
            onChange={(event) =>
              setForm((current) => ({ ...current, company: event.target.value }))
            }
          />
          <button
            type="submit"
            disabled={saving}
            className="mt-3 rounded-2xl bg-purple px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save graduate"}
          </button>
        </form>
      </SideSheet>
    </div>
  );
}
