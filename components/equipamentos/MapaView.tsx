"use client";

import { useRef, useState } from "react";
import type { Colaborador, EquipamentoItem } from "./equipamentosTypes";

/* -------------------------------------------------------------------------
 * Projeção isométrica (dimétrica 2:1)
 *
 * O plano do piso é medido em "unidades de chão" (x = fundo→direita,
 * y = fundo→esquerda, z = altura). A projeção é:
 *
 *   sx = x - y
 *   sy = (x + y) / 2 - z
 *
 * Isso mantém o container do mapa SEM transform nenhum: o arraste continua
 * sendo percentual puro (pos_x / pos_y em 0-100), exatamente como antes.
 * O visual 3D vem do desenho de cada mesa (caixas isométricas em CSS) e da
 * textura do piso, não de uma transformação global — assim o pointer math
 * do drag não muda em nada.
 * ---------------------------------------------------------------------- */

const SCALE = 0.58; // mobiliário desenhado em ~1px/unidade e reduzido aqui

function iso(x: number, y: number, z = 0) {
  return { sx: x - y, sy: (x + y) / 2 - z };
}

/**
 * Paleta fixa do escritório (charcoal + madeira), inspirada nas fotos reais.
 *
 * Decisão deliberada: a CENA (piso, divisórias, mesas, torres) usa cores fixas
 * nos dois temas — é um retrato do escritório, como uma foto/render; um piso
 * escuro invertido para branco no tema claro perderia todo o volume das
 * sombras. Tudo que é INTERFACE (moldura, texto de apoio, chips de nome,
 * seleção) continua usando os tokens --border / --text-muted / --accent /
 * --on-accent, então o amarelo da marca acompanha o tema normalmente.
 */
const C = {
  wallTop: "#46464b",
  wallX: "#232327", // face voltada para baixo-direita (mais sombra)
  wallY: "#313136", // face voltada para baixo-esquerda (mais luz)
  woodTop: "linear-gradient(155deg, #c08c48 0%, #a3742f 45%, #8a6029 100%)",
  woodX: "#4d3519",
  woodY: "#6a4a23",
  pedestalTop: "#2a2a2e",
  pedestalX: "#141416",
  pedestalY: "#1f1f23",
  metalTop: "#3a3a3f",
  metalX: "#151517",
  metalY: "#232327",
  screenTop: "#2c2c31",
  screenBack: "#1a1a1e",
  screenFace: "linear-gradient(160deg, #2b3138 0%, #14171b 60%, #0d0f12 100%)",
  towerTop: "#2e2e33",
  towerX: "#0f0f11",
  towerY: "#1b1b1f",
  chairTop: "#212126",
  chairX: "#111113",
  chairY: "#1a1a1e",
  plasticTop: "#33333a",
  plasticX: "#141416",
  plasticY: "#202024",
  floor: "#131315",
};

/**
 * Cores por setor: cada setor pega o próximo matiz no "ângulo dourado"
 * (~137.5°), o que espalha as cores ao máximo mesmo com muitos setores —
 * evita tons vizinhos parecidos que um hash puro por texto pode gerar.
 * A ordem vem de `setores` (lista ordenada e estável de nomes únicos).
 */
function construirCoresDosSetores(setores: string[]): Record<string, string> {
  const mapa: Record<string, string> = {};
  setores.forEach((setor, i) => {
    const hue = (i * 137.508) % 360;
    const sat = 62 + (i % 3) * 9; // 62 / 71 / 80
    const light = 50 + (i % 2) * 11; // 50 / 61
    mapa[setor] = `hsl(${hue}, ${sat}%, ${light}%)`;
  });
  return mapa;
}

type Face = { color?: string; background?: string };

/** Caixa isométrica: (x,y,z) é o canto do fundo, na base. */
function IsoBox({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  top,
  faceX,
  faceY,
  shadow,
}: {
  x: number;
  y: number;
  z?: number;
  w: number;
  d: number;
  h: number;
  top: Face;
  faceX: Face;
  faceY: Face;
  shadow?: string;
}) {
  const topO = iso(x, y, z + h);
  const xO = iso(x + w, y, z + h); // face +X (olha para baixo-direita)
  const yO = iso(x, y + d, z + h); // face +Y (olha para baixo-esquerda)

  const base: React.CSSProperties = {
    position: "absolute",
    transformOrigin: "0 0",
    pointerEvents: "none",
  };

  return (
    <>
      <div
        style={{
          ...base,
          left: xO.sx,
          top: xO.sy,
          width: d,
          height: h,
          transform: "matrix(-1, 0.5, 0, 1, 0, 0)",
          background: faceX.background ?? faceX.color,
        }}
      />
      <div
        style={{
          ...base,
          left: yO.sx,
          top: yO.sy,
          width: w,
          height: h,
          transform: "matrix(1, 0.5, 0, 1, 0, 0)",
          background: faceY.background ?? faceY.color,
        }}
      />
      <div
        style={{
          ...base,
          left: topO.sx,
          top: topO.sy,
          width: w,
          height: d,
          transform: "matrix(1, 0.5, -1, 0.5, 0, 0)",
          background: top.background ?? top.color,
          boxShadow: shadow,
        }}
      />
    </>
  );
}

/** Só a face de topo (usada para o realce de seleção no chão). */
function IsoTile({
  x,
  y,
  w,
  d,
  background,
  border,
}: {
  x: number;
  y: number;
  w: number;
  d: number;
  background: string;
  border?: string;
}) {
  const o = iso(x, y, 0);
  return (
    <div
      style={{
        position: "absolute",
        left: o.sx,
        top: o.sy,
        width: w,
        height: d,
        transformOrigin: "0 0",
        transform: "matrix(1, 0.5, -1, 0.5, 0, 0)",
        background,
        border,
        pointerEvents: "none",
      }}
    />
  );
}

/** Cena de uma estação de trabalho, desenhada de trás para frente. */
function Estacao({
  qtd,
  active,
  setorColor,
}: {
  qtd: number;
  active: boolean;
  setorColor: string | null;
}) {
  const vazio = qtd === 0;
  const dual = qtd >= 5;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        transform: `scale(${SCALE})`,
        transformOrigin: "0 0",
        pointerEvents: "none",
      }}
    >
      {/* sombra difusa no chão (fica parada no hover) */}
      <div
        style={{
          position: "absolute",
          left: -104,
          top: -34,
          width: 210,
          height: 118,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55), rgba(0,0,0,0) 68%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="iso-desk-art"
        style={{ position: "absolute", left: 0, top: 0, width: 0, height: 0 }}
      >
      {setorColor && (
        <IsoTile
          x={-62}
          y={-52}
          w={126}
          d={104}
          background={`color-mix(in srgb, ${setorColor} 26%, transparent)`}
          border={`1px solid color-mix(in srgb, ${setorColor} 55%, transparent)`}
        />
      )}
      {active && (
        <IsoTile
          x={-62}
          y={-52}
          w={126}
          d={104}
          background="color-mix(in srgb, var(--accent) 18%, transparent)"
          border="1px solid var(--accent)"
        />
      )}

      {/* divisórias da baia (charcoal, meia-altura) */}
      <IsoBox
        x={-56}
        y={-46}
        w={112}
        d={8}
        h={36}
        top={{ color: C.wallTop }}
        faceX={{ color: C.wallX }}
        faceY={{
          background: `linear-gradient(180deg, ${C.wallY} 0%, #1d1d21 100%)`,
        }}
      />
      <IsoBox
        x={-56}
        y={-38}
        w={8}
        d={48}
        h={36}
        top={{ color: C.wallTop }}
        faceX={{
          background: `linear-gradient(180deg, ${C.wallX} 0%, #17171a 100%)`,
        }}
        faceY={{ color: C.wallY }}
      />

      {/* mesa: pedestal escuro + tampo de madeira */}
      <IsoBox
        x={-46}
        y={-36}
        w={90}
        d={48}
        h={26}
        top={{ color: C.pedestalTop }}
        faceX={{ color: C.pedestalX }}
        faceY={{
          background: `linear-gradient(180deg, ${C.pedestalY} 0%, #0d0d0f 100%)`,
        }}
      />
      <IsoBox
        x={-47}
        y={-37}
        w={92}
        d={50}
        h={4}
        z={26}
        top={{ background: C.woodTop }}
        faceX={{ color: C.woodX }}
        faceY={{ color: C.woodY }}
        shadow="inset 0 0 0 1px rgba(255,255,255,0.07)"
      />

      {!vazio && (
        <>
          {/* torre do PC no chão, ao lado da mesa */}
          <IsoBox
            x={48}
            y={-16}
            w={13}
            d={26}
            h={36}
            top={{ color: C.towerTop }}
            faceX={{ color: C.towerX }}
            faceY={{
              background: `linear-gradient(180deg, ${C.towerY} 0%, #0b0b0d 70%), radial-gradient(circle at 50% 22%, color-mix(in srgb, var(--accent) 60%, transparent) 0 2px, transparent 3px)`,
            }}
          />

          {/* monitores (2 telas quando o colaborador tem bastante equipamento) */}
          {(dual ? [-40, 2] : [-19]).map((mx) => (
            <span key={mx}>
              <IsoBox
                x={mx + 13}
                y={-28}
                w={12}
                d={8}
                h={5}
                z={30}
                top={{ color: C.plasticTop }}
                faceX={{ color: C.plasticX }}
                faceY={{ color: C.plasticY }}
              />
              <IsoBox
                x={mx}
                y={-29}
                w={dual ? 36 : 38}
                d={4}
                h={22}
                z={35}
                top={{ color: C.screenTop }}
                faceX={{ color: C.screenBack }}
                faceY={{ background: C.screenFace }}
              />
            </span>
          ))}

          {/* teclado e mouse */}
          <IsoBox
            x={-22}
            y={-10}
            w={40}
            d={12}
            h={2}
            z={30}
            top={{
              background: `linear-gradient(160deg, #33333a, #17171a)`,
            }}
            faceX={{ color: C.plasticX }}
            faceY={{ color: C.plasticY }}
          />
          <IsoBox
            x={23}
            y={-8}
            w={8}
            d={10}
            h={3}
            z={30}
            top={{ color: C.plasticTop }}
            faceX={{ color: C.plasticX }}
            faceY={{ color: C.plasticY }}
          />
        </>
      )}

      {/* cadeira */}
      <IsoBox
        x={-4}
        y={28}
        w={8}
        d={8}
        h={22}
        top={{ color: C.metalTop }}
        faceX={{ color: C.metalX }}
        faceY={{ color: C.metalY }}
      />
      <IsoBox
        x={-16}
        y={18}
        w={32}
        d={28}
        h={5}
        z={22}
        top={{ background: "linear-gradient(160deg, #2a2a30, #17171b)" }}
        faceX={{ color: C.chairX }}
        faceY={{ color: C.chairY }}
      />
      <IsoBox
        x={-16}
        y={42}
        w={32}
        d={4}
        h={26}
        z={27}
        top={{ color: C.chairTop }}
        faceX={{ color: C.chairX }}
        faceY={{ background: "linear-gradient(180deg, #26262c, #131316)" }}
      />
      </div>
    </div>
  );
}

export function MapaView({
  colaboradores,
  itens,
  selectedId,
  onSelect,
  onMove,
  fullscreen = false,
}: {
  colaboradores: Colaborador[];
  itens: EquipamentoItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, posX: number, posY: number) => void;
  fullscreen?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localPos, setLocalPos] = useState<Record<string, { x: number; y: number }>>({});

  function posFor(c: Colaborador) {
    return localPos[c.id] ?? { x: c.pos_x ?? 50, y: c.pos_y ?? 50 };
  }

  const setores = Array.from(
    new Set(colaboradores.map((c) => c.setor?.trim()).filter((s): s is string => !!s))
  ).sort();
  const coresDosSetores = construirCoresDosSetores(setores);

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
    <div className={fullscreen ? "flex h-full flex-col" : undefined}>
      <p className="mb-2 text-xs" style={{ color: "var(--text-muted)" }}>
        Vista isométrica do escritório. Arraste cada mesa para a posição real; clique para ver/editar
        os equipamentos do colaborador.
      </p>

      {setores.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1">
          {setores.map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: coresDosSetores[s] }}
              />
              {s}
            </span>
          ))}
        </div>
      )}

      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`relative w-full select-none overflow-hidden rounded-lg border ${fullscreen ? "flex-1" : ""}`}
        style={{
          aspectRatio: fullscreen ? undefined : "16 / 10",
          height: fullscreen ? "100%" : undefined,
          minHeight: fullscreen ? undefined : 320,
          borderColor: "var(--border)",
          backgroundColor: C.floor,
          backgroundImage: [
            // poça de luz central
            "radial-gradient(ellipse 70% 60% at 50% 42%, rgba(255,255,255,0.055), rgba(0,0,0,0) 70%)",
            // grade isométrica (26.57deg = atan(0.5), casa com a projeção 2:1)
            "repeating-linear-gradient(26.57deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 34px)",
            "repeating-linear-gradient(-26.57deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 34px)",
            // vinheta
            "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
          ].join(","),
        }}
      >
        {/* Parede de fundo com o mural geométrico amarelo/cinza e a marca OMNI */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4"
          style={{
            height: "16%",
            background: [
              "linear-gradient(180deg, #26262b 0%, #1b1b1f 70%, rgba(19,19,21,0) 100%)",
            ].join(","),
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <svg
            width="180"
            height="46"
            viewBox="0 0 180 46"
            preserveAspectRatio="none"
            style={{ opacity: 0.85 }}
          >
            <g fill="none">
              <polygon points="0,46 26,0 52,46" fill="var(--accent)" opacity="0.75" />
              <polygon points="34,46 60,6 86,46" fill="#4a4a51" />
              <polygon points="72,46 96,14 120,46" fill="var(--accent)" opacity="0.45" />
              <polygon points="110,46 138,2 166,46" fill="#3a3a41" />
              <polygon points="150,46 172,18 180,46" fill="var(--accent)" opacity="0.6" />
            </g>
          </svg>
          <span
            className="text-lg font-bold tracking-[0.35em]"
            style={{ color: "var(--accent)", opacity: 0.9 }}
          >
            OMNI
          </span>
        </div>

        {colaboradores.map((c) => {
          const pos = posFor(c);
          const qtd = itens.filter((i) => i.colaborador_id === c.id).length;
          const active = c.id === selectedId;
          const dragging = draggingId === c.id;
          const setorColor = c.setor?.trim() ? coresDosSetores[c.setor.trim()] : null;
          return (
            <button
              key={c.id}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                setDraggingId(c.id);
                onSelect(c.id);
              }}
              className="iso-desk absolute"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: 128,
                height: 108,
                marginLeft: -64,
                marginTop: -54,
                background: "transparent",
                border: 0,
                padding: 0,
                cursor: dragging ? "grabbing" : "grab",
                // ordenação por profundidade: quem está mais à frente cobre quem está atrás
                zIndex: dragging ? 999 : 10 + Math.round(pos.y * 5),
                filter: dragging ? "brightness(1.12)" : undefined,
              }}
              title={`${c.nome}${c.setor ? ` — ${c.setor}` : ""}`}
              aria-label={`${c.nome}: ${qtd === 0 ? "sem equipamento" : `${qtd} equipamentos`}`}
            >
              {/* Origem da cena isométrica dentro do botão */}
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "70%",
                  width: 0,
                  height: 0,
                  display: "block",
                }}
              >
                <Estacao qtd={qtd} active={active} setorColor={setorColor} />
              </span>

              {/* Etiqueta: cores fixas para continuar legível sobre o piso escuro,
                  mas o estado selecionado usa o accent do tema. */}
              <span
                className="absolute left-1/2 top-0 flex max-w-[124px] -translate-x-1/2 flex-col items-center rounded-md px-2 py-1 text-center leading-tight"
                style={{
                  background: active ? "var(--accent)" : "rgba(16,16,18,0.86)",
                  color: active ? "var(--on-accent)" : "#f2f2ee",
                  border: `1px solid ${active ? "var(--accent)" : setorColor ?? "rgba(255,255,255,0.14)"}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
                  backdropFilter: "blur(2px)",
                }}
              >
                <span className="flex max-w-[112px] items-center gap-1 truncate text-[11px] font-semibold">
                  {setorColor && !active && (
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: setorColor }}
                    />
                  )}
                  <span className="truncate">{c.nome}</span>
                </span>
                <span
                  className="text-[9px] font-medium uppercase tracking-wide"
                  style={{
                    color: active
                      ? "var(--on-accent)"
                      : qtd === 0
                        ? "#9b9b93"
                        : "var(--accent)",
                    opacity: active ? 0.75 : 1,
                  }}
                >
                  {qtd === 0 ? "sem equip." : `${qtd} equip.`}
                </span>
              </span>
            </button>
          );
        })}

        {colaboradores.length === 0 && (
          <p
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md px-3 py-2 text-center text-sm"
            style={{
              color: "#c9c9c2",
              background: "rgba(16,16,18,0.7)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Adicione um colaborador para posicioná-lo aqui.
          </p>
        )}
      </div>
    </div>
  );
}
