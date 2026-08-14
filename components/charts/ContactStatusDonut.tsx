"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ContactStatusRow } from "@/db/queries";

export function ContactStatusDonut({ data }: { data: ContactStatusRow }) {
  const chartData = [
    { name: "Completos", value: data.completos },
    { name: "Incompletos", value: data.incompletos },
  ];
  const total = data.completos + data.incompletos;
  if (total === 0) {
    return (
      <p className="py-16 text-center text-sm" style={{ color: "var(--text-muted)" }}>
        Sem contatos processados ainda.
      </p>
    );
  }
  const colors = ["var(--accent)", "#8a8a82"];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={2}>
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={colors[index % colors.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            fontSize: 12,
          }}
        />
        <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
