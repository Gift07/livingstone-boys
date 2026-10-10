export function formatStat(value: number, prefix = "") {
  if (value >= 1_000_000) {
    return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${prefix}${thousands % 1 === 0 ? thousands.toFixed(3) : thousands.toFixed(1)}K`;
  }
  return `${prefix}${value}`;
}

export function fullName(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`.trim();
}

export function studentCode(id: string) {
  return `PRE${id.slice(-5).toUpperCase()}`;
}
