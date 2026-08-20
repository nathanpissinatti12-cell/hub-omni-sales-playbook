"use client";

import { useEffect, useState } from "react";
import type { Colaborador, EquipamentoItem } from "./equipamentosTypes";

export function ColaboradorPainel({
  colaborador,
  itens,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddItem,
  onReassignItem,
  onDeleteItem,
  onClose,
  bauId,
}: {
  colaborador: Colaborador | null;
  itens: EquipamentoItem[];
  onUpdate: (id: string, input: { nome: string; setor: string | null }) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddItem: (colaboradorId: string, tipo: string, descricao: string) => void;
  onReassignItem: (itemId: string, colaboradorId: string | null) => void;
  onDeleteItem: (itemId: string) => void;
  onClose: () => void;
  bauId: string | null;
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

  const isBau = colaborador.is_deposito;

  return (
    <div className="rounded-lg border p-4" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
          {isBau ? "Baú de reserva" : "Colaborador"}
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
        {!isBau && (
          <input
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            onBlur={() => nome.trim() && onUpdate(colaborador.id, { nome: nome.trim(), setor: setor.trim() || null })}
            placeholder="Setor (opcional)"
            className="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
        )}
        {isBau && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Equipamentos de reserva, sem colaborador atribuído.
          </p>
        )}
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
                  {!isBau && (
                    <button
                      type="button"
                      onClick={() => onReassignItem(i.id, bauId)}
                      style={{ color: "var(--text-muted)" }}
                    >
                      {bauId ? "mandar pro baú" : "devolver"}
                    </button>
                  )}
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
            const tipos = novoTipo
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
            if (tipos.length === 0) return;
            // Descrição só faz sentido quando é um único equipamento por vez.
            const descricao = tipos.length === 1 ? novaDescricao.trim() : "";
            tipos.forEach((tipo) => onAddItem(colaborador.id, tipo, descricao));
            setNovoTipo("");
            setNovaDescricao("");
          }}
          className="mt-3 space-y-2"
        >
          <input
            value={novoTipo}
            onChange={(e) => setNovoTipo(e.target.value)}
            placeholder="Tipo (separe vários com vírgula: monitor, teclado, mouse)"
            className="w-full rounded-md border bg-transparent px-3 py-1.5 text-sm outline-none"
            style={{ borderColor: "var(--border)" }}
          />
          <input
            value={novaDescricao}
            onChange={(e) => setNovaDescricao(e.target.value)}
            placeholder="Descrição/modelo (opcional, só se for 1 equipamento)"
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

      {!isBau && (
        <button
          type="button"
          onClick={() => onDuplicate(colaborador.id)}
          className="mt-4 w-full rounded-md border px-3 py-1.5 text-xs font-semibold"
          style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
        >
          Duplicar colaborador (com os mesmos equipamentos)
        </button>
      )}

      <button
        type="button"
        onClick={() => onDelete(colaborador.id)}
        className="mt-2 w-full rounded-md border px-3 py-1.5 text-xs font-semibold"
        style={{ borderColor: "#e5484d", color: "#e5484d" }}
      >
        {isBau ? "Remover baú" : "Remover colaborador"}
      </button>
    </div>
  );
}
