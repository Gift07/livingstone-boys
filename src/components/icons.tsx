import type { NavItem } from "@/lib/nav";
import {
  BookMarked,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Home,
  Megaphone,
  PenLine,
  Presentation,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<NavItem["icon"], LucideIcon> = {
  home: Home,
  students: Users,
  teachers: UserPlus,
  library: BookOpen,
  account: Wallet,
  class: Presentation,
  subject: BookMarked,
  routine: CalendarDays,
  attendance: ClipboardCheck,
  exam: PenLine,
  notice: Megaphone,
  alumni: GraduationCap,
};

export function NavIcon({
  name,
  className,
}: {
  name: NavItem["icon"];
  className?: string;
}) {
  const Icon = iconMap[name] ?? GraduationCap;
  return <Icon className={className} strokeWidth={1.7} />;
}

export function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M14 4c4.2 0 7.2 2.2 8.4 5.4-1.6-1-3.5-1.6-5.6-1.6-5.4 0-9.8 4.2-9.8 9.4 0 1.6.4 3.1 1.1 4.4C5.4 19.4 4 16.4 4 13 4 8 8.5 4 14 4Z"
        fill="#1B7A32"
      />
      <path
        d="M14 24c-4.2 0-7.2-2.2-8.4-5.4 1.6 1 3.5 1.6 5.6 1.6 5.4 0 9.8-4.2 9.8-9.4 0-1.6-.4-3.1-1.1-4.4C22.6 8.6 24 11.6 24 15c0 5-4.5 9-10 9Z"
        fill="#1B7A32"
      />
    </svg>
  );
}
