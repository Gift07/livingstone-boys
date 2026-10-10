export default function ExamChart({
  months,
  exams,
  results,
}: {
  months: string[];
  exams: number[];
  results: number[];
}) {
  const max = Math.max(1, ...exams, ...results);

  return (
    <section className="rounded-[22px] border border-line bg-white p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[18px] font-semibold">All Exam Result</h2>
          <p className="mt-1 text-[13px] text-muted">
            Exams scheduled and results saved this year
          </p>
        </div>
        <div className="flex items-center gap-4 text-[12px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-purple" /> Exams
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange" /> Results
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex h-[200px] flex-col justify-between text-[11px] text-muted">
          {[max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0].map(
            (label, index) => (
              <span key={`${label}-${index}`}>{label}</span>
            ),
          )}
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-12 items-end gap-2 border-b border-line sm:gap-3">
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="flex h-[200px] items-end justify-center gap-1">
                <div
                  className="w-[6px] rounded-full bg-[#1B7A32]"
                  style={{ height: `${(exams[index] / max) * 200}px` }}
                />
                <div
                  className="w-[6px] rounded-full bg-[#16662a]"
                  style={{ height: `${(results[index] / max) * 200}px` }}
                />
              </div>
              <span className="mt-3 text-[10px] text-muted sm:text-[11px]">
                {month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
