import SchoolLogo from "@/components/brand/SchoolLogo";
import { school } from "@/lib/school";

export default function PrintHeader({ title }: { title: string }) {
  return (
    <div className="print-only mb-6 text-center">
      <div className="flex items-center justify-center gap-3">
        <SchoolLogo size={64} />
        <div className="text-left">
          <p className="text-lg font-semibold">{school.name}</p>
          <p className="text-sm">{school.motto}</p>
        </div>
      </div>
      <h1 className="mt-4 text-xl font-semibold uppercase tracking-wide">
        {title}
      </h1>
    </div>
  );
}
