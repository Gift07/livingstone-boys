"use client";

import { useEffect, useState } from "react";
import ExamActivity, {
  type ActivityItem,
} from "@/components/dashboard/ExamActivity";
import ExamChart from "@/components/dashboard/ExamChart";
import StarStudents, {
  type StarStudent,
} from "@/components/dashboard/StarStudents";
import StatCards from "@/components/dashboard/StatCards";
import StudentsDonut from "@/components/dashboard/StudentsDonut";

const emptyStats = {
  students: 0,
  teachers: 0,
  parents: 0,
  earnings: 0,
};

const emptyChart = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  results: Array(12).fill(0),
  exams: Array(12).fill(0),
};

export default function Dashboard() {
  const [stats, setStats] = useState(emptyStats);
  const [grades, setGrades] = useState<{ grade: string; count: number }[]>([]);
  const [chart, setChart] = useState(emptyChart);
  const [stars, setStars] = useState<StarStudent[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load dashboard");
        setStats(data.stats);
        setGrades(data.grades || []);
        setChart(data.chart);
        setStars(data.stars);
        setActivity(data.activity);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load dashboard");
      }
    }

    void load();
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="text-[22px] font-semibold tracking-tight">
        Livingstone Admin Dashboard
      </h1>
      {error ? (
        <p className="rounded-2xl bg-[#fff1f2] px-4 py-3 text-sm text-[#e11d48]">
          {error}
        </p>
      ) : null}
      <StatCards stats={stats} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        <ExamChart months={chart.months} exams={chart.exams} results={chart.results} />
        <StudentsDonut total={stats.students} grades={grades} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
        <StarStudents students={stars} />
        <ExamActivity items={activity} />
      </div>
    </div>
  );
}
