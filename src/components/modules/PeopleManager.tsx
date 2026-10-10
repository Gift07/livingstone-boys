"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import PageHeader from "@/components/ui/PageHeader";
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

type Person = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  grade?: string;
  subject?: string;
  phone?: string;
};

type Field = {
  name: "firstName" | "lastName" | "email" | "grade" | "subject" | "phone";
  label: string;
  type?: string;
};

export default function PeopleManager({
  title,
  description,
  endpoint,
  extraField,
}: {
  title: string;
  description: string;
  endpoint: string;
  extraField: Field;
}) {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    extra: "",
  });

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to load ${title}`);
      setPeople(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load ${title}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `Failed to load ${title}`);
        setPeople(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to load ${title}`);
      } finally {
        setLoading(false);
      }
    }

    void loadData();

    const timer = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("new") === "1") {
        setOpen(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [endpoint, title]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          [extraField.name]: form.extra,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save");
      setForm({ firstName: "", lastName: "", email: "", extra: "" });
      setOpen(false);
      router.replace(endpoint.replace("/api", "") || "/");
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
      const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete");
      setPeople((current) => current.filter((person) => person._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete");
    }
  }

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-2xl bg-purple px-4 py-2.5 text-[13px] font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add {title.slice(0, -1)}
          </button>
        }
      />

      {open ? (
        <Card className="mb-5">
          <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <input
              required
              value={form.firstName}
              onChange={(event) =>
                setForm((current) => ({ ...current, firstName: event.target.value }))
              }
              placeholder="First name"
              className="rounded-2xl bg-background px-4 py-3 text-sm outline-none"
            />
            <input
              required
              value={form.lastName}
              onChange={(event) =>
                setForm((current) => ({ ...current, lastName: event.target.value }))
              }
              placeholder="Last name"
              className="rounded-2xl bg-background px-4 py-3 text-sm outline-none"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Email"
              className="rounded-2xl bg-background px-4 py-3 text-sm outline-none"
            />
            <input
              required
              value={form.extra}
              onChange={(event) =>
                setForm((current) => ({ ...current, extra: event.target.value }))
              }
              placeholder={extraField.label}
              className="rounded-2xl bg-background px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-purple px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        </Card>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm text-[#e11d48]">
          {error}
        </p>
      ) : null}

      <Card className="overflow-hidden p-0">
        <Table minWidth="640px">
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>{extraField.label}</th>
              <th className={thClass}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className={trClass}>
                <td colSpan={4} className={`${tdClass} text-gray-500`}>
                  Loading...
                </td>
              </tr>
            ) : people.length === 0 ? (
              <tr className={trClass}>
                <td colSpan={4} className={`${tdClass} text-gray-500`}>
                  No {title.toLowerCase()} yet.
                </td>
              </tr>
            ) : (
              people.map((person) => (
                <tr key={person._id} className={trClass}>
                  <td className={tdStrongClass}>
                    <div className="flex items-center gap-3">
                      <Initials name={fullName(person.firstName, person.lastName)} />
                      {fullName(person.firstName, person.lastName)}
                    </div>
                  </td>
                  <td className={tdClass}>{person.email}</td>
                  <td className={tdClass}>{person[extraField.name]}</td>
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
    </div>
  );
}
