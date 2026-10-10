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
import { recordModules } from "@/lib/modules";

export default function RecordsManager({ moduleKey }: { moduleKey: string }) {
  const config = recordModules[moduleKey];
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/records?module=${moduleKey}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load records");
      setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load records");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/api/records?module=${moduleKey}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load records");
        setRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load records");
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [moduleKey]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleKey, ...form }),
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

  if (!config) return <p className="text-sm text-red-700">Unknown module.</p>;

  return (
    <div>
      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-purple px-4 py-2.5 text-[13px] font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add {config.title.toLowerCase()}
          </button>
        }
      />

      {error ? (
        <p className="mb-4 rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm text-[#e11d48]">
          {error}
        </p>
      ) : null}

      <Card className="overflow-hidden p-0">
        <Table minWidth="640px">
          <thead className={theadClass}>
            <tr>
              {config.fields.map((field) => (
                <th key={field.key} className={thClass}>
                  {field.label}
                </th>
              ))}
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className={trClass}>
                <td
                  colSpan={config.fields.length + 1}
                  className={`${tdClass} text-gray-500`}
                >
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr className={trClass}>
                <td
                  colSpan={config.fields.length + 1}
                  className={`${tdClass} text-gray-500`}
                >
                  No {config.title.toLowerCase()} records yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id} className={trClass}>
                  {config.fields.map((field, index) => (
                    <td
                      key={field.key}
                      className={index === 0 ? tdStrongClass : tdClass}
                    >
                      {row[field.key]}
                    </td>
                  ))}
                  <td className={tdClass}>
                    <button
                      type="button"
                      onClick={() => void onDelete(row._id)}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-[#e11d48]"
                      aria-label="Delete record"
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
        title={`Add ${config.title.toLowerCase()}`}
        description="This record is saved to MongoDB."
        onClose={() => setOpen(false)}
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          {config.fields.map((field) => (
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
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      </SideSheet>
    </div>
  );
}
