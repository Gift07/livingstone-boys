import { BookOpen, Megaphone, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export type ActivityItem = {
  title: string;
  copy: string;
  time: string;
  kind: "notice" | "result";
};

export default function ExamActivity({ items }: { items: ActivityItem[] }) {
  return (
    <section className="rounded-[22px] border border-line bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Recent activity</h2>
        <button type="button" className="text-muted" aria-label="More">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted">
          No notices or results yet. Add them from the school system.
        </p>
      ) : (
        <ul className="space-y-5">
          {items.map((item, index) => {
            const Icon = item.kind === "notice" ? Megaphone : BookOpen;
            const color =
              item.kind === "notice"
                ? "bg-[#eef6f0] text-[#16662a]"
                : "bg-[#e7f4ea] text-[#1B7A32]";
            return (
              <li key={`${item.title}-${index}`} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${color}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">{item.title}</p>
                  <p className="truncate text-[12px] text-muted">{item.copy}</p>
                </div>
                <span className="shrink-0 text-[12px] text-muted">{item.time}</span>
              </li>
            );
          })}
        </ul>
      )}
      <Link
        href="/results"
        className="mt-6 flex h-11 items-center justify-center rounded-2xl bg-[#e7f4ea] text-[14px] font-medium text-[#1B7A32]"
      >
        View results
      </Link>
    </section>
  );
}
