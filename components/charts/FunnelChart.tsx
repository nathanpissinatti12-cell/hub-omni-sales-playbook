"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type FunnelStage = {
  id: number;
  name: string;
  position: number;
  deal_count: number;
  avg_days_in_stage: string | null;
};

export function FunnelChart({ data }: { data: FunnelStage[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number, key: string) =>
            key === "deal_count" ? [value, "Deals"] : [value, key]
          }
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="deal_count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
