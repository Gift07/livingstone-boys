import { DollarSign, GraduationCap, User, Users } from "lucide-react";
import { formatStat } from "@/lib/format";

const cards = [
  {
    key: "students" as const,
    label: "Students",
    icon: GraduationCap,
    className: "bg-[#e7f4ea] text-[#1B7A32]",
  },
  {
    key: "teachers" as const,
    label: "Teachers",
    icon: User,
    className: "bg-[#eef6f0] text-[#16662a]",
  },
  {
    key: "parents" as const,
    label: "Parents",
    icon: Users,
    className: "bg-[#f3faf5] text-[#1B7A32]",
  },
  {
    key: "earnings" as const,
    label: "Earnings",
    icon: DollarSign,
    className: "bg-[#e7f4ea] text-[#16662a]",
    prefix: "$",
  },
];

export default function StatCards({
  stats,
}: {
  stats: {
    students: number;
    teachers: number;
    parents: number;
    earnings: number;
  };
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article
            key={card.key}
            className="flex items-center justify-between rounded-[20px] border border-line bg-white px-6 py-5"
          >
            <div>
              <p className="text-[13px] text-muted">{card.label}</p>
              <p className="mt-1 text-[26px] font-semibold tracking-tight">
                {formatStat(stats[card.key], card.prefix)}
              </p>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.className}`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
