"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MapaView } from "./MapaView";
import { TabelaView } from "./TabelaView";
import { ColaboradorPainel } from "./ColaboradorPainel";
import type { Colaborador, EquipamentoItem } from "./equipamentosTypes";

type ViewMode = "mapa" | "tabela";

export function EquipamentosPanel() {
  const [view, setView] = useState<ViewMode>("mapa");
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [itens, setItens] = useState<EquipamentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [novoNome, setNovoNome] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [colRes, itRes] = await Promise.all([
        fetch("/api/equipamentos/colaboradores"),
        fetch("/api/equipamentos/itens"),
      ]);
      if (colRes.ok) setColaboradores(await colRes.json());
      if (itRes.ok) setItens(await itRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const selected = useMemo(
    () => colaboradores.find((c) => c.id === selectedId) ?? null,
    [colaboradores, selectedId]
  );

  async function handleAddColaborador(e: React.FormEvent) {
    e.preventDefault();
    const nome = novoNome.trim();
    if (!nome) return;
    const res = await fetch("/api/equipamentos/colaboradores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, posX: 50, posY: 50 }),
    });
    if (res.ok) {
      const created: Colaborador = await res.json();
      setNovoNome("");
      setColaboradores((prev) => [...prev, created]);
      setSelectedId(created.id);
      setView("mapa");
    }
  }

  async function handleMove(id: string, posX: number, posY: number) {
    setColaboradores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pos_x: posX, pos_y: posY } : c))
    );
    await fetch(`/api/equipamentos/colaboradores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posX, posY }),
    });
  }

  async function handleUpdateColaborador(id: string, input: { nome: string; setor: string | null }) {
    const atual = colaboradores.find((c) => c.id === id);
    const res = await fetch(`/api/equipamentos/colaboradores/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: input.nome,
        setor: input.setor,
        posX: atual?.pos_x ?? null,
        posY: atual?.pos_y ?? null,
      }),
    });
    if (res.ok) {
      const updated: Colaborador = await res.json();
      setColaboradores((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
  }

  async function handleDeleteColaborador(id: string) {
    await fetch(`/api/equipamentos/colaboradores/${id}`, { method: "DELETE" });
    setColaboradores((prev) => prev.filter((c) => c.id !== id));
    setItens((prev) => prev.map((i) => (i.colaborador_id === id ? { ...i, colaborador_id: null } : i)));
    if (selectedId === id) setSelectedId(null);
  }

  async function handleDuplicateColaborador(id: string) {
    const origem = colaboradores.find((c) => c.id === id);
    if (!origem) return;

    const posX = Math.min(96, (origem.pos_x ?? 50) + 6);
    const posY = Math.min(96, (origem.pos_y ?? 50) + 6);
    const res = await fetch("/api/equipamentos/colaboradores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: `${origem.nome} (cópia)`, setor: origem.setor, posX, posY }),
    });
    if (!res.ok) return;
    const novo: Colaborador = await res.json();
    setColaboradores((prev) => [...prev, novo]);

    const itensOrigem = itens.filter((i) => i.colaborador_id === id);
    for (const item of itensOrigem) {
      const itemRes = await fetch("/api/equipamentos/itens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: item.tipo, descricao: item.descricao, colaboradorId: novo.id }),
      });
      if (itemRes.ok) {
        const criado: EquipamentoItem = await itemRes.json();
        setItens((prev) => [criado, ...prev]);
      }
    }

    setSelectedId(novo.id);
    setView("mapa");
  }

  async function handleAddItem(colaboradorId: string, tipo: string, descricao: string) {
    const res = await fetch("/api/equipamentos/itens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, descricao, colaboradorId }),
    });
    if (res.ok) {
      const created: EquipamentoItem = await res.json();
      setItens((prev) => [created, ...prev]);
    }
  }

  async function handleUnassignItem(itemId: string) {
    const item = itens.find((i) => i.id === itemId);
    if (!item) return;
    const res = await fetch(`/api/equipamentos/itens/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: item.tipo, descricao: item.descricao, colaboradorId: null }),
    });
    if (res.ok) {
      const updated: EquipamentoItem = await res.json();
      setItens((prev) => prev.map((i) => (i.id === itemId ? updated : i)));
    }
  }

  async function handleDeleteItem(itemId: string) {
    await fetch(`/api/equipamentos/itens/${itemId}`, { method: "DELETE" });
    setItens((prev) => prev.filter((i) => i.id !== itemId));
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Controle de Equipamentos</h1>
        </div>

        <div className="flex gap-1 rounded-md border p-1" style={{ borderColor: "var(--border)" }}>
          {(["mapa", "tabela"] as ViewMode[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className="rounded px-3 py-1.5 text-xs font-semibold capitalize"
              style={{
                background: view === v ? "var(--accent)" : "transparent",
                color: view === v ? "var(--on-accent)" : "var(--text)",
              }}
            >
              {v === "mapa" ? "Planta baixa" : "Tabela"}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAddColaborador} className="mt-6 flex flex-wrap gap-2">
        <input
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
          placeholder="Nome do colaborador"
          className="min-w-[220px] flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none"
          style={{ borderColor: "var(--border)" }}
        />
        <button
          type="submit"
          disabled={!novoNome.trim()}
          className="rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50"
          style={{ background: "var(--accent)", color: "var(--on-accent)" }}
        >
          Adicionar colaborador
        </button>
      </form>

      {loading ? (
        <p className="mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
          Carregando...
        </p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            {view === "mapa" ? (
              <MapaView
                colaboradores={colaboradores}
                itens={itens}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onMove={handleMove}
              />
            ) : (
              <TabelaView
                colaboradores={colaboradores}
                itens={itens}
                onSelect={setSelectedId}
              />
            )}
          </div>

          <div>
            <ColaboradorPainel
              colaborador={selected}
              itens={itens.filter((i) => i.colaborador_id === selected?.id)}
              onUpdate={handleUpdateColaborador}
              onDelete={handleDeleteColaborador}
              onDuplicate={handleDuplicateColaborador}
              onAddItem={handleAddItem}
              onUnassignItem={handleUnassignItem}
              onDeleteItem={handleDeleteItem}
              onClose={() => setSelectedId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
