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
import { recordModules } from "@/lib/modules";
import { school } from "@/lib/school";

const fields = recordModules.exams.fields;

function sortTimetable(rows: Record<string, string>[]) {
  return [...rows].sort((a, b) => {
    const dateA = Date.parse(a.date) || 0;
    const dateB = Date.parse(b.date) || 0;
    if (dateA !== dateB) return dateA - dateB;
    return (a.time || "").localeCompare(b.time || "");
  });
}

export default function ExamTimetable() {
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const timetable = useMemo(() => sortTimetable(rows), [rows]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/records?module=exams");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load timetable");
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load timetable");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/records?module=exams");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load timetable");
        setRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load timetable");
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
      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "exams", ...form }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save");
      setForm({});
      setOpen(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    setError(null);
    try {
      const response = await fetch(`/api/records/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete");
      setRows((current) => current.filter((row) => row._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <div>
      <PrintHeader title="Examination Timetable" />

      <div className="no-print">
        <PageHeader
          title="Exam timetable"
          description="Papers, dates, times, and venues. Student marks are entered on Results."
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-4 py-2.5 text-[13px] font-medium"
              >
                <Printer className="h-4 w-4" />
                Print timetable
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-purple px-4 py-2.5 text-[13px] font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Add paper
              </button>
            </div>
          }
        />
      </div>

      {error ? (
        <p className="no-print mb-4 rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm text-[#e11d48]">
          {error}
        </p>
      ) : null}

      <Card className="overflow-hidden p-0 print:border-0 print:p-0">
        <Table minWidth="880px">
          <thead className={theadClass}>
            <tr>
              {fields.map((field) => (
                <th key={field.key} className={thClass}>
                  {field.label}
                </th>
              ))}
              <th className={`${thClass} no-print`}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className={trClass}>
                <td colSpan={fields.length + 1} className={`${tdClass} text-gray-500`}>
                  Loading...
                </td>
              </tr>
            ) : timetable.length === 0 ? (
              <tr className={trClass}>
                <td colSpan={fields.length + 1} className={`${tdClass} text-gray-500`}>
                  No papers on the timetable yet.
                </td>
              </tr>
            ) : (
              timetable.map((row) => (
                <tr key={row._id} className={trClass}>
                  {fields.map((field, index) => (
                    <td
                      key={field.key}
                      className={index === 0 ? tdStrongClass : tdClass}
                    >
                      {row[field.key] || "—"}
                    </td>
                  ))}
                  <td className={`${tdClass} no-print`}>
                    <button
                      type="button"
                      onClick={() => void onDelete(row._id)}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#e11d48]"
                      aria-label="Delete paper"
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

      <p className="print-only mt-8 text-xs">
        Printed from the {school.name} school system.
      </p>

      <SideSheet
        open={open}
        title="Add exam paper"
        description="This sits on the timetable only. Enter marks later under Results."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {fields.map((field) => (
            <input
              key={field.key}
              required={field.required}
              className="w-full rounded-2xl border border-neutral-200 bg-[#f7f7f7] px-4 py-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1B7A32]/20"
              placeholder={field.label}
              value={form[field.key] || ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
            />
          ))}
          <button
            type="submit"
            disabled={saving}
            className="mt-3 rounded-2xl bg-purple px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save paper"}
          </button>
        </form>
      </SideSheet>
    </div>
  );
}
