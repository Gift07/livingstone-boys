import { MoreHorizontal } from "lucide-react";

export default function StudentsDonut({
  male,
  female,
}: {
  male: number;
  female: number;
}) {
  const total = male + female;
  const size = 188;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const maleRatio = total ? male / total : 0;
  const femaleRatio = total ? female / total : 0;

  return (
    <section className="rounded-[22px] border border-line bg-white p-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[18px] font-semibold">Students</h2>
        <button type="button" className="text-muted" aria-label="More">
          <MoreHorizontal className="h-5 w-5" />
        </button>
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
            {total > 0 ? (
              <>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#16662a"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference * femaleRatio} ${circumference}`}
                  strokeLinecap="round"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke="#1B7A32"
                  strokeWidth={stroke}
                  strokeDasharray={`${circumference * maleRatio} ${circumference}`}
                  strokeDashoffset={-circumference * femaleRatio}
                  strokeLinecap="round"
                />
              </>
            ) : null}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[12px] text-muted">Total</p>
            <p className="text-[28px] font-semibold leading-none">
              {total.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6 text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple" /> Male {male}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange" /> Female {female}
          </span>
        </div>
      </div>
    </section>
  );
}
