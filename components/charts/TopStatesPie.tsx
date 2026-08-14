"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { StatePercentRow } from "@/db/queries";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ef4444"];

export function TopStatesPie({ data }: { data: StatePercentRow[] }) {
  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        Sem empresas com estado identificado ainda.
      </p>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="estado"
          outerRadius={100}
          label={(entry) => `${entry.estado} ${entry.percentage}%`}
          labelLine={{ stroke: "var(--text-muted)" }}
        >
          {data.map((entry, index) => (
            <Cell key={entry.estado} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
