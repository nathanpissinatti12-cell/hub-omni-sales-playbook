"use client";

import { useState } from "react";
import type { Colaborador, EquipamentoItem } from "./equipamentosTypes";

export function TabelaView({
  colaboradores,
  itens,
  onSelect,
}: {
  colaboradores: Colaborador[];
  itens: EquipamentoItem[];
  onSelect: (id: string) => void;
}) {
  const [busca, setBusca] = useState("");

  const filtrados = colaboradores.filter((c) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;
    const equipDoColaborador = itens
      .filter((i) => i.colaborador_id === c.id)
      .map((i) => `${i.tipo} ${i.descricao ?? ""}`)
      .join(" ");
    return `${c.nome} ${c.setor ?? ""} ${equipDoColaborador}`.toLowerCase().includes(termo);
  });

  const semDono = itens.filter((i) => !i.colaborador_id);

  return (
    <div className="space-y-6">
      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por colaborador, setor ou equipamento..."
        className="w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
        style={{ borderColor: "var(--border)" }}
      />

      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <th className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: "var(--text-muted)" }}>
                Colaborador
              </th>
              <th className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: "var(--text-muted)" }}>
                Setor
              </th>
              <th className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: "var(--text-muted)" }}>
                Equipamentos
              </th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c) => {
              const equipDoColaborador = itens.filter((i) => i.colaborador_id === c.id);
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className="cursor-pointer"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="px-3 py-2 font-medium">{c.nome}</td>
                  <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>
                    {c.setor || "—"}
                  </td>
                  <td className="px-3 py-2" style={{ color: "var(--text-muted)" }}>
                    {equipDoColaborador.length === 0
                      ? "—"
                      : equipDoColaborador.map((i) => i.tipo).join(", ")}
                  </td>
                </tr>
              );
            })}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center" style={{ color: "var(--text-muted)" }}>
                  Nenhum colaborador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {semDono.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Em estoque (sem colaborador)
          </p>
          <ul className="space-y-1 text-sm">
            {semDono.map((i) => (
              <li key={i.id} style={{ color: "var(--text-muted)" }}>
                {i.tipo}
                {i.descricao ? ` — ${i.descricao}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
