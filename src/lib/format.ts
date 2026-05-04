// src/lib/format.ts
export function fmtCurrency(val: number, compact = false): string {
  if (compact && Math.abs(val) >= 1_000_000) {
    return `$${(val / 1_000_000).toFixed(2)}M`;
  }
  if (compact && Math.abs(val) >= 1_000) {
    return `$${(val / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

export function fmtNumber(val: number): string {
  return new Intl.NumberFormat("en-US").format(val);
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function fmtPercent(val: number): string {
  const sign = val >= 0 ? "+" : "";
  return `${sign}${val.toFixed(2)}%`;
}

export function pnlColor(val: number): string {
  if (val > 0) return "text-emerald-400";
  if (val < 0) return "text-red-400";
  return "text-gray-400";
}

export function pnlBg(val: number): string {
  if (val > 0) return "bg-emerald-500/10 text-emerald-400";
  if (val < 0) return "bg-red-500/10 text-red-400";
  return "bg-gray-500/10 text-gray-400";
}
