export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  label: string;
  href?: string;
  icon:
    | "home"
    | "students"
    | "teachers"
    | "library"
    | "account"
    | "class"
    | "subject"
    | "routine"
    | "attendance"
    | "exam"
    | "notice"
    | "alumni";
  children?: NavChild[];
};

export const navItems: NavItem[] = [
  {
    label: "Home",
    icon: "home",
    children: [
      { label: "Admin", href: "/dashboard" },
      { label: "Students", href: "/students" },
      { label: "Teachers", href: "/teachers" },
    ],
  },
  {
    label: "Students",
    href: "/students",
    icon: "students",
    children: [
      { label: "All Students", href: "/students" },
      { label: "Parents", href: "/parents" },
      { label: "Subjects", href: "/subjects" },
      { label: "Results", href: "/results" },
      { label: "Add Student", href: "/students?new=1" },
      { label: "Alumni", href: "/alumni" },
    ],
  },
  { label: "Alumni", href: "/alumni", icon: "alumni" },
  {
    label: "Teachers",
    href: "/teachers",
    icon: "teachers",
    children: [
      { label: "All Teachers", href: "/teachers" },
      { label: "Add Teacher", href: "/teachers?new=1" },
    ],
  },
  { label: "Library", href: "/library", icon: "library" },
  {
    label: "Account",
    href: "/accounts",
    icon: "account",
    children: [
      { label: "Fees", href: "/accounts" },
      { label: "Earnings", href: "/accounts" },
    ],
  },
  { label: "Class", href: "/classes", icon: "class" },
  { label: "Subject", href: "/subjects", icon: "subject" },
  { label: "Routine", href: "/routine", icon: "routine" },
  { label: "Attendance", href: "/attendance", icon: "attendance" },
  {
    label: "Exam",
    href: "/exams",
    icon: "exam",
    children: [
      { label: "Timetable", href: "/exams" },
      { label: "Results", href: "/results" },
    ],
  },
  { label: "Notice", href: "/notices", icon: "notice" },
];
