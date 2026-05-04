// src/components/PnLChart.tsx
"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { fmtCurrency } from "@/lib/format";
import type { DailyPnL } from "@/types";

interface Props {
  data: DailyPnL[];
  compact?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value as number;
  return (
    <div className="bg-bg-700 border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className={`font-mono font-semibold ${v >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmtCurrency(v)}</p>
    </div>
  );
};

export default function PnLChart({ data, compact = false }: Props) {
  const display = compact ? data.slice(-14) : data;
  return (
    <ResponsiveContainer width="100%" height={compact ? 80 : 200}>
      <BarChart data={display} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="20%">
        <XAxis
          dataKey="date"
          tick={{ fill: "#4b5563", fontSize: 10 }}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
          axisLine={false}
          tickLine={false}
          hide={compact}
        />
        <YAxis
          tick={{ fill: "#4b5563", fontSize: 10 }}
          tickFormatter={(v) => fmtCurrency(v, true)}
          axisLine={false}
          tickLine={false}
          width={60}
          hide={compact}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <ReferenceLine y={0} stroke="#1e2d45" />
        <Bar dataKey="profit" radius={[3, 3, 0, 0]}>
          {display.map((entry, i) => (
            <Cell key={i} fill={entry.profit >= 0 ? "#10b981" : "#ef4444"} opacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
