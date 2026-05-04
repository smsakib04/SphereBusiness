// src/components/PriceChart.tsx
"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { fmtCurrency } from "@/lib/format";
import type { PricePoint } from "@/types";

interface Props {
  data: PricePoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-700 border border-border rounded-lg px-3 py-2 shadow-xl text-xs space-y-1">
      <p className="text-gray-400">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono font-semibold">
          {p.name}: {fmtCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function PriceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tick={{ fill: "#4b5563", fontSize: 10 }}
          tickFormatter={(v) => {
            const d = new Date(v);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
          axisLine={false}
          tickLine={false}
          interval={5}
        />
        <YAxis
          tick={{ fill: "#4b5563", fontSize: 10 }}
          tickFormatter={(v) => fmtCurrency(v, true)}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
        <Line type="monotone" dataKey="buy" stroke="#06b6d4" dot={false} strokeWidth={1.5} name="Buy" />
        <Line type="monotone" dataKey="sell" stroke="#8b5cf6" dot={false} strokeWidth={1.5} name="Sell" />
      </LineChart>
    </ResponsiveContainer>
  );
}
