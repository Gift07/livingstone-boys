export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[22px] border border-line bg-white p-6 ${className}`}
    >
      {children}
    </section>
  );
}
