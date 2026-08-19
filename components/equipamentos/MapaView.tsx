"use client";

import { useRef, useState } from "react";
import type { Colaborador, EquipamentoItem } from "./equipamentosTypes";

export function MapaView({
  colaboradores,
  itens,
  selectedId,
  onSelect,
  onMove,
}: {
  colaboradores: Colaborador[];
  itens: EquipamentoItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, posX: number, posY: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localPos, setLocalPos] = useState<Record<string, { x: number; y: number }>>({});

  function posFor(c: Colaborador) {
    return localPos[c.id] ?? { x: c.pos_x ?? 50, y: c.pos_y ?? 50 };
  }

  function clamp(v: number) {
    return Math.min(96, Math.max(4, v));
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!draggingId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100);
    setLocalPos((prev) => ({ ...prev, [draggingId]: { x, y } }));
  }

  function handlePointerUp() {
    if (draggingId && localPos[draggingId]) {
      const { x, y } = localPos[draggingId];
      onMove(draggingId, x, y);
    }
    setDraggingId(null);
  }

  return (
    <div>
      <p className="mb-2 text-xs" style={{ color: "var(--text-muted)" }}>
        Vista de cima do escritório. Arraste cada mesa para a posição real; clique para ver/editar os
        equipamentos do colaborador.
      </p>
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full select-none rounded-lg border"
        style={{
          aspectRatio: "16 / 10",
          borderColor: "var(--border)",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 24px, var(--border) 24px, var(--border) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, var(--border) 24px, var(--border) 25px)",
          backgroundColor: "var(--surface)",
        }}
      >
        {colaboradores.map((c) => {
          const pos = posFor(c);
          const qtd = itens.filter((i) => i.colaborador_id === c.id).length;
          const active = c.id === selectedId;
          return (
            <button
              key={c.id}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setDraggingId(c.id);
                onSelect(c.id);
              }}
              className="absolute flex w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-md border px-2 py-2 text-center shadow-sm"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                borderColor: active ? "var(--accent)" : "var(--border)",
                background: active ? "var(--accent)" : "var(--surface)",
                color: active ? "var(--on-accent)" : "var(--text)",
                cursor: draggingId === c.id ? "grabbing" : "grab",
                zIndex: draggingId === c.id ? 10 : 1,
              }}
              title={c.nome}
            >
              <span className="w-full truncate text-xs font-semibold">{c.nome}</span>
              <span
                className="text-[10px]"
                style={{ color: active ? "var(--on-accent)" : "var(--text-muted)" }}
              >
                {qtd === 0 ? "sem equip." : `${qtd} equip.`}
              </span>
            </button>
          );
        })}

        {colaboradores.length === 0 && (
          <p
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            Adicione um colaborador para posicioná-lo aqui.
          </p>
        )}
      </div>
    </div>
  );
}
