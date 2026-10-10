export default function Initials({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-soft text-[11px] font-semibold text-purple ${className}`}
    >
      {initials || "?"}
    </span>
  );
}
