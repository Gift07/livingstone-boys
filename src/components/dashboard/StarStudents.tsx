"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import Initials from "@/components/ui/Initials";
import { fullName, studentCode } from "@/lib/format";
import {
  Table,
  tdClass,
  tdStrongClass,
  thClass,
  theadClass,
  trClass,
} from "@/components/ui/Table";

export type StarStudent = {
  _id: string;
  firstName: string;
  lastName: string;
  grade?: string;
  marks?: number;
  percent?: number;
  year?: string;
};

export default function StarStudents({ students }: { students: StarStudent[] }) {
  const [selected, setSelected] = useState("");

  return (
    <section className="rounded-[22px] border border-line bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Star Students</h2>
        <button type="button" className="text-muted" aria-label="More">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <Table minWidth="560px">
        <thead className={theadClass}>
          <tr>
            <th className={`${thClass} w-10`}>
              <span className="sr-only">Select</span>
            </th>
            <th className={thClass}>Name</th>
            <th className={thClass}>ID</th>
            <th className={thClass}>Marks</th>
            <th className={thClass}>Percent</th>
            <th className={thClass}>Year</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr className={trClass}>
              <td colSpan={6} className={`${tdClass} text-gray-500`}>
                No exam results yet. Star students appear from MongoDB results.
              </td>
            </tr>
          ) : (
            students.map((student) => {
              const active = selected === student._id;
              return (
                <tr
                  key={student._id}
                  className={`${trClass} ${active ? "!bg-purple-soft" : ""}`}
                >
                  <td className={tdClass}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => setSelected(active ? "" : student._id)}
                      className="h-4 w-4 rounded border-gray-300 text-purple accent-purple"
                    />
                  </td>
                  <td className={tdStrongClass}>
                    <div className="flex items-center gap-3">
                      <Initials name={fullName(student.firstName, student.lastName)} />
                      {fullName(student.firstName, student.lastName)}
                    </div>
                  </td>
                  <td className={tdClass}>{studentCode(student._id)}</td>
                  <td className={tdClass}>{student.marks ?? 0}</td>
                  <td className={tdClass}>{student.percent ?? 0}%</td>
                  <td className={tdClass}>{student.year || "—"}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </section>
  );
}
