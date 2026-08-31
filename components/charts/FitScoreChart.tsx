"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { FitScoreTierRow } from "@/db/queries";

const TIER_LABEL: Record<FitScoreTierRow["tier"], string> = {
  apollo_celular: "Celular do Apollo (nota 6 ou 5)",
  so_fixo: "Só fixo (nota 4 ou 3)",
  outra_fonte_celular: "Celular de outra fonte (nota 2 ou 1)",
  sem_dado: "Sem telefone válido",
};

const TIER_COLOR: Record<FitScoreTierRow["tier"], string> = {
  apollo_celular: "var(--accent)",
  so_fixo: "var(--text-muted)",
  outra_fonte_celular: "var(--border)",
  sem_dado: "var(--border)",
};

export function FitScoreChart({ data }: { data: FitScoreTierRow[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Sem dados de telefone recuperáveis para esta campanha.
      </p>
    );
  }

  const total = data.reduce((acc, r) => acc + r.total, 0);
  const chartData = data.map((r) => ({ ...r, label: TIER_LABEL[r.tier] }));

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <ResponsiveContainer width="100%" height={220} className="sm:max-w-[220px]">
        <PieChart>
          <Pie data={chartData} dataKey="total" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={2}>
            {chartData.map((r) => (
              <Cell key={r.tier} fill={TIER_COLOR[r.tier]} stroke="var(--surface)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 12 }}
            formatter={(value: number, _name, item) => [`${value} (${Math.round((value / total) * 100)}%)`, item.payload.label]}
          />
        </PieChart>
      </ResponsiveContainer>

      <ul className="flex-1 space-y-2">
        {chartData.map((r) => (
          <li key={r.tier} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: TIER_COLOR[r.tier] }}
              aria-hidden
            />
            <span className="flex-1">{r.label}</span>
            <span className="font-semibold" style={{ color: "var(--text-muted)" }}>
              {r.total} ({Math.round((r.total / total) * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
