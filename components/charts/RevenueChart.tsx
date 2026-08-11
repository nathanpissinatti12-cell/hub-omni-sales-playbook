"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type RevenueMonth = {
  month: string;
  revenue_cents: string;
  target_cents: string;
};

function centsToBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function RevenueChart({ data }: { data: RevenueMonth[] }) {
  const parsed = data.map((d) => ({
    month: d.month,
    Receita: Number(d.revenue_cents) / 100,
    Meta: Number(d.target_cents) / 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={parsed} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => centsToBRL(v * 100)}
          width={90}
        />
        <Tooltip
          formatter={(value: number) => centsToBRL(value * 100)}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            fontSize: 12,
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="Receita" stroke="var(--accent)" strokeWidth={2} />
        <Line type="monotone" dataKey="Meta" stroke="#9a9aa5" strokeDasharray="4 4" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
