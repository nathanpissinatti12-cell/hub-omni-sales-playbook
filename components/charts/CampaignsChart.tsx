"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CampaignPerformanceRow } from "@/db/queries";

export function CampaignsChart({ data }: { data: CampaignPerformanceRow[] }) {
  const top = [...data]
    .sort((a, b) => b.total_fila - a.total_fila)
    .slice(0, 8)
    .map((c) => ({
      name: c.nome.length > 18 ? `${c.nome.slice(0, 18)}…` : c.nome,
      Processado: c.processado,
      Pendente: c.pendente,
      "Em pausa": c.em_pausa,
      Erro: c.erro,
    }));

  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={top} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            fontSize: 12,
          }}
        />
        <Legend />
        <Bar dataKey="Processado" stackId="a" fill="var(--accent)" />
        <Bar dataKey="Pendente" stackId="a" fill="#9a9aa5" />
        <Bar dataKey="Em pausa" stackId="a" fill="#e0a72e" />
        <Bar dataKey="Erro" stackId="a" fill="#e0522e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
