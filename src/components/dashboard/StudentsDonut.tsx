const ringColors = ["#1B7A32", "#16662a", "#3d9a52", "#0f4d24"];

export default function StudentsDonut({
  total,
  grades,
}: {
  total: number;
  grades: { grade: string; count: number }[];
}) {
  const size = 188;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <section className="rounded-[22px] border border-line bg-white p-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Boys by class</h2>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative">
          <svg width={size} height={size} className="-rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e5e5"
              strokeWidth={stroke}
            />
            {total > 0
              ? grades.map((row, index) => {
                  const length = circumference * (row.count / total);
                  const circle = (
                    <circle
                      key={row.grade}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      stroke={ringColors[index % ringColors.length]}
                      strokeWidth={stroke}
                      strokeDasharray={`${length} ${circumference}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                    />
                  );
                  offset += length;
                  return circle;
                })
              : null}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[12px] text-muted">Boys</p>
            <p className="text-[28px] font-semibold leading-none">
              {total.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-muted">
          {grades.length === 0 ? (
            <span>No boys enrolled yet.</span>
          ) : (
            grades.map((row, index) => (
              <span key={row.grade} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: ringColors[index % ringColors.length] }}
                />
                {row.grade} {row.count}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
