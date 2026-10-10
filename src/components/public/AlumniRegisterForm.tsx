"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import SchoolLogo from "@/components/brand/SchoolLogo";
import { school } from "@/lib/school";

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
  "mt-1.5 w-full rounded-lg border border-neutral-200 bg-[#f7f7f7] px-3 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1B7A32]/20";

export default function AlumniRegisterForm() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function update(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not register");
      }
      setForm(emptyForm);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full bg-white">
      <div className="border-b border-[#1B7A32] bg-[#1B7A32] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-end text-[13px] font-medium">
          <Link href="/" className="px-4 py-2.5 hover:bg-white/10">
            Home
          </Link>
          <span className="h-4 w-px bg-white/35" />
          <Link href="/login" className="px-4 py-2.5 hover:bg-white/10">
            Staff Login
          </Link>
        </div>
      </div>

      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <SchoolLogo size={48} />
            <span className="text-[18px] font-semibold tracking-tight">
              {school.alumniName}
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-5 py-10 sm:px-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em]">
          Register
        </p>
        <h1 className="mt-3 text-[28px] font-semibold tracking-tight">
          Claim your place in the directory
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-neutral-600">
          Old boys can add the college they attended and the work they are doing
          now. After you register, classmates can find you on the public search.
        </p>

        {done ? (
          <div className="mt-8 rounded-2xl border border-[#1B7A32]/20 bg-[#f3faf4] p-5">
            <p className="font-medium text-[#1B7A32]">You are in the directory.</p>
            <p className="mt-1 text-sm text-neutral-600">
              Classmates can now find you from the public homepage.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-[#1B7A32] underline"
            >
              Search for a classmate
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                First name
                <input
                  required
                  value={form.firstName}
                  onChange={(event) => update("firstName", event.target.value)}
                  className={fieldClass}
                />
              </label>
              <label className="text-sm font-medium">
                Last name
                <input
                  required
                  value={form.lastName}
                  onChange={(event) => update("lastName", event.target.value)}
                  className={fieldClass}
                />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Graduation year
              <input
                required
                value={form.graduationYear}
                onChange={(event) => update("graduationYear", event.target.value)}
                placeholder="2018"
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium">
              College attended
              <input
                required
                value={form.college}
                onChange={(event) => update("college", event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Work you are doing now
              <input
                required
                value={form.work}
                onChange={(event) => update("work", event.target.value)}
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Company <span className="font-normal text-neutral-400">(optional)</span>
              <input
                value={form.company}
                onChange={(event) => update("company", event.target.value)}
                className={fieldClass}
              />
            </label>

            {error ? <p className="text-sm text-red-700">{error}</p> : null}

            <button
              type="submit"
              disabled={saving}
              className="h-11 w-full rounded-full bg-[#1B7A32] text-sm font-semibold text-white hover:bg-[#16662a] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Register"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
