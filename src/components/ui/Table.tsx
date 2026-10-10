export const tableWrapClass = "relative overflow-x-auto";
export const tableClass = "w-full text-left text-sm text-gray-500";
export const theadClass = "bg-gray-50 text-xs uppercase text-gray-700";
export const thClass = "px-6 py-3 font-medium";
export const trClass = "border-b border-gray-200 odd:bg-white even:bg-gray-50";
export const tdClass = "px-6 py-4";
export const tdStrongClass = "whitespace-nowrap px-6 py-4 font-medium text-gray-900";

export function Table({
  children,
  minWidth,
}: {
  children: React.ReactNode;
  minWidth?: string;
}) {
  return (
    <div className={tableWrapClass}>
      <table className={tableClass} style={minWidth ? { minWidth } : undefined}>
        {children}
      </table>
    </div>
  );
}
