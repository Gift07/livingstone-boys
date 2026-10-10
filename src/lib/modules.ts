export type RecordField = {
  key: string;
  label: string;
  required?: boolean;
};

export type RecordModule = {
  key: string;
  title: string;
  description: string;
  fields: RecordField[];
};

export const recordModules: Record<string, RecordModule> = {
  library: {
    key: "library",
    title: "Library",
    description: "Books, issues, and returns stored in MongoDB.",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "author", label: "Author", required: true },
      { key: "copies", label: "Copies", required: true },
      { key: "status", label: "Status", required: true },
    ],
  },
  accounts: {
    key: "accounts",
    title: "Account",
    description: "Fees, invoices, and school earnings from MongoDB.",
    fields: [
      { key: "name", label: "Item", required: true },
      { key: "type", label: "Type", required: true },
      { key: "amount", label: "Amount", required: true },
      { key: "date", label: "Date", required: true },
    ],
  },
  classes: {
    key: "classes",
    title: "Class",
    description: "Class sections and assigned teachers.",
    fields: [
      { key: "name", label: "Class", required: true },
      { key: "section", label: "Section", required: true },
      { key: "teacher", label: "Teacher", required: true },
      { key: "students", label: "Students", required: true },
    ],
  },
  exams: {
    key: "exams",
    title: "Exam timetable",
    description: "When and where papers are sat. Marks are entered under Results.",
    fields: [
      { key: "name", label: "Paper", required: true },
      { key: "subject", label: "Subject", required: true },
      { key: "class", label: "Class", required: true },
      { key: "date", label: "Date", required: true },
      { key: "time", label: "Time", required: true },
      { key: "venue", label: "Venue", required: true },
      { key: "invigilator", label: "Invigilator", required: true },
    ],
  },
  attendance: {
    key: "attendance",
    title: "Attendance",
    description: "Daily student attendance records.",
    fields: [
      { key: "name", label: "Student", required: true },
      { key: "class", label: "Class", required: true },
      { key: "date", label: "Date", required: true },
      { key: "status", label: "Status", required: true },
    ],
  },
  routine: {
    key: "routine",
    title: "Routine",
    description: "Weekly class timetable.",
    fields: [
      { key: "day", label: "Day", required: true },
      { key: "time", label: "Time", required: true },
      { key: "subject", label: "Subject", required: true },
      { key: "class", label: "Class", required: true },
      { key: "room", label: "Room", required: true },
    ],
  },
  notices: {
    key: "notices",
    title: "Notice",
    description: "Announcements for students, parents, and staff.",
    fields: [
      { key: "title", label: "Title", required: true },
      { key: "audience", label: "Audience", required: true },
      { key: "date", label: "Date", required: true },
    ],
  },
};
