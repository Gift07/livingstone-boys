"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import SchoolLogo from "@/components/brand/SchoolLogo";
import { school } from "@/lib/school";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@livingstone.local");
  const [password, setPassword] = useState("livingstone");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not sign in");

      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-full bg-white">
      <div className="border-b border-[#1B7A32] bg-[#1B7A32] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-end text-[13px] font-medium">
          <Link href="/" className="px-4 py-2.5 hover:bg-white/10">
            Public site
          </Link>
        </div>
      </div>

      <main className="mx-auto flex min-h-[calc(100vh-44px)] max-w-md flex-col justify-center px-5 py-12">
        <div className="flex items-center gap-3">
          <SchoolLogo size={56} priority />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1B7A32]">
              Staff login
            </p>
            <h1 className="text-[22px] font-semibold tracking-tight">
              {school.name}
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-neutral-600">
          Sign in to manage students, results, and school records in MongoDB.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1.5 h-12 w-full rounded-lg border border-neutral-200 bg-[#f7f7f7] px-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1B7A32]/20"
            />
          </label>
          <label className="block text-sm font-medium">
            Password
            <input
              required
              type="text"
              autoComplete="off"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1.5 h-12 w-full rounded-lg border border-neutral-200 bg-[#f7f7f7] px-3 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-[#1B7A32]/20"
            />
          </label>

          {error ? <p className="text-sm text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={saving}
            className="h-12 w-full rounded-full bg-[#1B7A32] text-sm font-semibold text-white hover:bg-[#16662a] disabled:opacity-60"
          >
            {saving ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}
