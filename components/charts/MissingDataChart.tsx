"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { MissingDataRow } from "@/db/queries";

export function MissingDataChart({ data }: { data: MissingDataRow[] }) {
  const total = data.reduce((sum, r) => sum + r.total, 0);
  if (total === 0) {
    return (
      <p className="py-16 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        Nenhum dado faltante registrado.
      </p>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="label" width={100} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="total" fill="#8a8a82" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
