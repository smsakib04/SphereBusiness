// src/components/StatCard.tsx
import { ReactNode } from "react";

interface Props {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  accent?: "blue" | "green" | "red" | "amber" | "cyan" | "purple";
  trend?: "up" | "down" | null;
}

const accentMap = {
  blue: { bg: "bg-accent-blue/10", text: "text-accent-blue", border: "border-accent-blue/20" },
  green: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
};

export default function StatCard({ label, value, sub, icon, accent = "blue", trend }: Props) {
  const c = accentMap[accent];
  return (
    <div className={`bg-bg-700 border border-border rounded-xl p-4 flex items-start gap-4 hover:border-border-light transition-colors`}>
      <div className={`${c.bg} ${c.border} border rounded-lg p-2.5 shrink-0`}>
        <div className={c.text}>{icon}</div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-xl font-display font-bold text-white truncate">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
