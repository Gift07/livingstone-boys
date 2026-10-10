import Image from "next/image";
import { school } from "@/lib/school";

export default function SchoolLogo({
  size = 40,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={school.logo}
      alt={school.name}
      width={size}
      height={size}
      className={`rounded-full bg-black object-cover ${className}`}
      style={{ width: size, height: size }}
      priority={priority}
    />
  );
}
