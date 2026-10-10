import Link from "next/link";
import { Search } from "lucide-react";
import SchoolLogo from "@/components/brand/SchoolLogo";
import { searchPublicDirectory } from "@/lib/directory";
import { school } from "@/lib/school";

const sections = [
  {
    title: "Community",
    body: "Stay in touch with classmates, teachers, and the wider Livingstone family after leaving the seminary.",
  },
  {
    title: "Giving",
    body: "Support scholarships, chapel life, and the next generation of Livingstone boys.",
  },
  {
    title: "Programs & Events",
    body: "Speech day, chapel services, old boys’ reunions, and sports fixtures are listed for the school community.",
  },
  {
    title: "Sports",
    body: "Football, athletics, and house competitions remain a core part of seminary life.",
  },
  {
    title: "The School",
    body: `Founded in ${school.founded}, ${school.name} is a ${school.type.toLowerCase()} whose motto is “${school.motto}.”`,
  },
];

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/" method="get" className="mt-4 flex max-w-xl items-center gap-2">
      <label className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search by name, class, college, or work"
          className="h-12 w-full rounded-full border border-neutral-200 bg-[#f7f7f7] px-11 text-[15px] outline-none ring-[#1B7A32]/20 placeholder:text-neutral-400 focus:bg-white focus:ring-2"
        />
      </label>
      <button
        type="submit"
        className="h-12 shrink-0 rounded-full bg-[#1B7A32] px-5 text-sm font-semibold text-white hover:bg-[#16662a]"
      >
        Search
      </button>
    </form>
  );
}

export async function ClassmateResults({
  searchParams,
}: Pick<PageProps<"/">, "searchParams">) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() || "";

  let results: Awaited<ReturnType<typeof searchPublicDirectory>> = [];
  let error: string | null = null;

  if (query.length > 0 && query.length < 2) {
    error = "Enter at least two letters to search.";
  } else if (query.length >= 2) {
    try {
      results = await searchPublicDirectory(query);
    } catch (err) {
      error = err instanceof Error ? err.message : "Search failed";
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em]">
        Quick search
      </h2>
      <SearchForm query={query} />
      <p className="mt-3 max-w-xl text-[13px] leading-6 text-neutral-500">
        Results are from the public classmate list only. Quick search does not
        include private emails or records from inside the school system.
      </p>

      {error ? <p className="mt-6 text-sm text-red-700">{error}</p> : null}

      {!error && query.length >= 2 && results.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">
          No public matches for “{query}”.
        </p>
      ) : null}

      {results.length > 0 ? (
        <ul className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
          {results.map((person) => (
            <li key={`${person.kind}-${person.id}`} className="py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[17px] font-medium">{person.name}</p>
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1B7A32]">
                  {person.kind === "alumni"
                    ? `Class of ${person.year}`
                    : `Class ${person.year}`}
                </span>
              </div>
              <p className="mt-1 text-sm text-neutral-600">{person.detail}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-white text-[#111]">
      <div className="border-b border-[#1B7A32] bg-[#1B7A32] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-0 text-[13px] font-medium">
          <Link href="/login" className="px-4 py-2.5 hover:bg-white/10">
            Staff Login
          </Link>
          <span className="h-4 w-px bg-white/35" />
          <Link href="/register" className="px-4 py-2.5 hover:bg-white/10">
            Register
          </Link>
        </div>
      </div>

      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5 sm:px-6">
          <SchoolLogo size={56} priority />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1B7A32]">
              {school.type}
            </p>
            <h1 className="text-[20px] font-semibold tracking-tight sm:text-[26px]">
              {school.alumniName}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-neutral-800">
          Looking for a classmate?
        </p>
        <p className="mt-4 max-w-xl text-[16px] leading-7 text-neutral-700">
          Search the public directory for fellow Livingstone students and old
          boys. Staff can open the school system to manage records. New
          graduates can{" "}
          <Link href="/register" className="text-[#1B7A32] underline">
            register
          </Link>{" "}
          to add their college and work.
        </p>
        {children}
        <nav className="mt-14 space-y-8 border-t border-neutral-200 pt-10">
          {sections.map((section) => (
            <article key={section.title}>
              <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em]">
                {section.title}
              </h2>
              <p className="mt-2 max-w-xl text-[15px] leading-7 text-neutral-600">
                {section.body}
              </p>
            </article>
          ))}
        </nav>
      </main>

      <footer className="border-t border-neutral-200 bg-[#111] text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 sm:px-6">
          <p className="text-sm font-medium">{school.name}</p>
          <p className="text-sm text-white/70">{school.motto}</p>
          <p className="text-xs text-white/45">Est. {school.founded}</p>
        </div>
      </footer>
    </div>
  );
}

export function SearchFallback() {
  return (
    <section className="mt-10">
      <h2 className="text-[12px] font-semibold uppercase tracking-[0.18em]">
        Quick search
      </h2>
      <SearchForm query="" />
      <p className="mt-6 text-sm text-neutral-500">Loading directory…</p>
    </section>
  );
}
