"use client";

import { useEffect, useState } from "react";
import type { Colaborador, EquipamentoItem } from "./equipamentosTypes";

export function ColaboradorPainel({
  colaborador,
  itens,
  onUpdate,
  onDelete,
  onAddItem,
  onUnassignItem,
  onDeleteItem,
  onClose,
}: {
  colaborador: Colaborador | null;
  itens: EquipamentoItem[];
  onUpdate: (id: string, input: { nome: string; setor: string | null }) => void;
  onDelete: (id: string) => void;
  onAddItem: (colaboradorId: string, tipo: string, descricao: string) => void;
  onUnassignItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onClose: () => void;
}) {
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [novoTipo, setNovoTipo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  useEffect(() => {
    setNome(colaborador?.nome ?? "");
    setSetor(colaborador?.setor ?? "");
  }, [colaborador?.id]);

  if (!colaborador) {
    return (
      <div className="rounded-lg border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        Selecione um colaborador na planta ou na tabela para ver e editar os equipamentos dele.
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
          Colaborador
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Fechar
        </button>
      </div>

      <div className="mt-2 space-y-2">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={() => nome.trim() && onUpdate(colaborador.id, { nome: nome.trim(), setor: setor.trim() || null })}
          className="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm font-semibold outline-none"
          style={{ borderColor: "var(--border)" }}
        />
        <input
          value={setor}
          onChange={(e) => setSetor(e.target.value)}
          onBlur={() => nome.trim() && onUpdate(colaborador.id, { nome: nome.trim(), setor: setor.trim() || null })}
          placeholder="Setor (opcional)"
          className="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Equipamentos
        </p>
        {itens.length === 0 ? (
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Nenhum equipamento atribuído.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {itens.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                <span>
                  <span className="font-medium">{i.tipo}</span>
                  {i.descricao ? <span style={{ color: "var(--text-muted)" }}> — {i.descricao}</span> : null}
                </span>
                <span className="flex gap-2 text-xs">
                  <button type="button" onClick={() => onUnassignItem(i.id)} style={{ color: "var(--text-muted)" }}>
                    devolver
                  </button>
                  <button type="button" onClick={() => onDeleteItem(i.id)} style={{ color: "#e5484d" }}>
                    excluir
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!novoTipo.trim()) return;
            onAddItem(colaborador.id, novoTipo.trim(), novaDescricao.trim());
            setNovoTipo("");
            setNovaDescricao("");
          }}
          className="mt-3 space-y-2"
        >
          <input
            value={novoTipo}
            onChange={(e) => setNovoTipo(e.target.value)}
            placeholder="Tipo (ex: monitor, headset)"
            className="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
          <input
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            placeholder="Descrição/modelo (opcional)"
            className="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
          <button
            type="submit"
            disabled={!novoTipo.trim()}
            className="w-full rounded-md px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            Adicionar equipamento
          </button>
        </form>
      </div>

      <button
        type="button"
        onClick={() => onDelete(colaborador.id)}
        className="mt-4 w-full rounded-md border px-3 py-1.5 text-xs font-semibold"
        style={{ borderColor: "#e5484d", color: "#e5484d" }}
      >
        Remover colaborador
      </button>
    </div>
  );
}
