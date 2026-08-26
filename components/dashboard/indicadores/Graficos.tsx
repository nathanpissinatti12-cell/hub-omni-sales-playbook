"use client";

// Gráficos do Painel de Indicadores em SVG puro (sem lib externa).
// Adaptados do painel HTML original: mesma leitura visual, mas usando os
// tokens de cor do playbook em vez da paleta clara fixa do arquivo de origem.

import { CORES, corDe, type Situacao } from "@/lib/indicadoresCalc";

const COR_META = "var(--accent)";
const COR_REAL = "#EC4899";

function Vazio({ msg }: { msg: string }) {
  return (
    <p className="py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
      {msg}
    </p>
  );
}

function Legenda({ itens }: { itens: { cor: string; label: string; opacidade?: number }[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
      {itens.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <i
            className="inline-block h-3 w-3 rounded-sm"
            style={{ background: i.cor, opacity: i.opacidade ?? 1 }}
          />
          {i.label}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ranking de atingimento — barras horizontais ordenadas do pior para o melhor
// ---------------------------------------------------------------------------
export type ItemRanking = { nome: string; pct: number };

export function GraficoRanking({ dados }: { dados: ItemRanking[] }) {
  if (!dados.length) return <Vazio msg="Sem realizados lançados neste mês." />;

  const lw = 205;
  const bw = 430;
  const gap = 7;
  const bh = 21;
  const top = 22;
  const W = lw + bw + 62;
  const H = top + dados.length * (bh + gap) + 12;
  const maxPct = Math.max(120, Math.ceil(Math.max(...dados.map((d) => d.pct)) / 20) * 20);
  const x = (v: number) => lw + (v / maxPct) * bw;
  const ticks = [0, 50, 100, ...(maxPct > 100 ? [maxPct] : [])];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" fontFamily="inherit">
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={x(t)}
            y1={top - 8}
            x2={x(t)}
            y2={H - 10}
            stroke={t === 100 ? COR_META : "var(--border)"}
            strokeWidth={t === 100 ? 1.4 : 1}
            strokeDasharray={t === 100 ? "4 3" : undefined}
          />
          <text
            x={x(t)}
            y={top - 13}
            fontSize="9.5"
            fill={t === 100 ? COR_META : "var(--text-muted)"}
            textAnchor="middle"
            fontWeight={t === 100 ? 800 : 600}
          >
            {t}%
          </text>
        </g>
      ))}
      {dados.map((d, i) => {
        const y = top + i * (bh + gap);
        const cor = corDe(d.pct);
        const larguraPct = Math.min(d.pct, maxPct);
        return (
          <g key={d.nome + i}>
            <text x={lw - 9} y={y + bh / 2 + 3.5} fontSize="11" fill="var(--text)" textAnchor="end">
              {d.nome.length > 32 ? d.nome.slice(0, 31) + "…" : d.nome}
            </text>
            <rect x={lw} y={y} width={bw} height={bh} fill="var(--border)" opacity={0.35} rx={3} />
            <rect
              x={lw}
              y={y}
              width={Math.max((larguraPct / maxPct) * bw, 2)}
              height={bh}
              fill={cor}
              rx={3}
            />
            <text
              x={x(larguraPct) + 7}
              y={y + bh / 2 + 3.5}
              fontSize="10.5"
              fontWeight={800}
              fill={cor}
            >
              {d.pct.toFixed(0)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Comparativo entre pessoas para um mesmo KPI
// ---------------------------------------------------------------------------
export type ItemComparativo = {
  nome: string;
  real: number | null;
  meta: number | null;
  pct: number | null;
};

export function GraficoComparativo({ dados }: { dados: ItemComparativo[] }) {
  const comDado = dados.filter((d) => d.real !== null);
  if (!comDado.length) return <Vazio msg="Sem lançamentos para este indicador no mês." />;

  const W = 760;
  const H = 250;
  const ml = 52;
  const mr = 14;
  const mt = 22;
  const mb = 64;
  const pw = (W - ml - mr) / dados.length;
  const meta = dados[0]?.meta ?? 0;
  const maxV = Math.max(meta, ...comDado.map((d) => d.real as number)) * 1.18 || 1;
  const y = (v: number) => mt + (H - mt - mb) * (1 - v / maxV);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" fontFamily="inherit">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const v = maxV * f;
        return (
          <g key={f}>
            <line x1={ml} y1={y(v)} x2={W - mr} y2={y(v)} stroke="var(--border)" />
            <text x={ml - 7} y={y(v) + 3.5} fontSize="9.5" fill="var(--text-muted)" textAnchor="end">
              {v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(0)}
            </text>
          </g>
        );
      })}
      {meta > 0 && (
        <g>
          <line
            x1={ml}
            y1={y(meta)}
            x2={W - mr}
            y2={y(meta)}
            stroke={COR_META}
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text x={W - mr} y={y(meta) - 6} fontSize="9.5" fontWeight={800} fill={COR_META} textAnchor="end">
            meta proporcional
          </text>
        </g>
      )}
      {dados.map((d, i) => {
        const cx = ml + i * pw + pw / 2;
        const bwid = Math.min(pw * 0.52, 46);
        return (
          <g key={d.nome + i}>
            {d.real !== null && (
              <>
                <rect
                  x={cx - bwid / 2}
                  y={y(d.real)}
                  width={bwid}
                  height={Math.max(y(0) - y(d.real), 1)}
                  fill={corDe(d.pct)}
                  rx={3}
                />
                <text
                  x={cx}
                  y={y(d.real) - 5}
                  fontSize="10"
                  fontWeight={800}
                  fill={corDe(d.pct)}
                  textAnchor="middle"
                >
                  {d.pct !== null ? d.pct.toFixed(0) + "%" : ""}
                </text>
              </>
            )}
            <text x={cx} y={H - mb + 18} fontSize="10" fill="var(--text-muted)" textAnchor="middle">
              {d.nome.split(" ")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Burn-up — meta acumulada versus realizado acumulado
// ---------------------------------------------------------------------------
export type PontoBurnup = { mes: string; rotulo: string; meta: number; real: number | null };

export function GraficoBurnup({ serie, vazioMsg }: { serie: PontoBurnup[]; vazioMsg: string }) {
  if (!serie.length) return <Vazio msg="Fora do ciclo do cronograma." />;
  const temReal = serie.some((d) => d.real !== null);
  if (!temReal) return <Vazio msg={vazioMsg} />;

  const W = 760;
  const H = 248;
  const ml = 62;
  const mr = 16;
  const mt = 20;
  const mb = 44;
  const maxV = (serie[serie.length - 1]?.meta ?? 1) * 1.1;
  const x = (i: number) => ml + (W - ml - mr) * (serie.length > 1 ? i / (serie.length - 1) : 0.5);
  const y = (v: number) => mt + (H - mt - mb) * (1 - v / maxV);

  const pontosMeta = serie.map((d, i) => `${x(i)},${y(d.meta)}`).join(" ");
  const pontosReal = serie
    .map((d, i) => (d.real !== null ? `${x(i)},${y(d.real)}` : null))
    .filter(Boolean)
    .join(" ");

  const comReal = serie.filter((d) => d.real !== null);
  const ultimo = comReal[comReal.length - 1];
  const idxUltimo = ultimo ? serie.indexOf(ultimo) : -1;
  const gap = ultimo ? (ultimo.real as number) - ultimo.meta : 0;

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" fontFamily="inherit">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = maxV * f;
          return (
            <g key={f}>
              <line x1={ml} y1={y(v)} x2={W - mr} y2={y(v)} stroke="var(--border)" />
              <text x={ml - 7} y={y(v) + 3.5} fontSize="9.5" fill="var(--text-muted)" textAnchor="end">
                {(v / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        <polyline points={pontosMeta} fill="none" stroke={COR_META} strokeWidth={2} strokeDasharray="5 4" />
        {serie.map((d, i) => (
          <circle key={"m" + i} cx={x(i)} cy={y(d.meta)} r={3} fill={COR_META} />
        ))}

        {pontosReal && <polyline points={pontosReal} fill="none" stroke={COR_REAL} strokeWidth={2.5} />}
        {serie.map((d, i) =>
          d.real !== null ? <circle key={"r" + i} cx={x(i)} cy={y(d.real)} r={4} fill={COR_REAL} /> : null
        )}

        {ultimo && (
          <text
            x={x(idxUltimo)}
            y={y(ultimo.real as number) - 9}
            fontSize="10.5"
            fontWeight={800}
            fill={gap >= 0 ? CORES.ok : CORES.bad}
            textAnchor="middle"
          >
            {(gap >= 0 ? "+" : "−") +
              "R$ " +
              Math.abs(gap).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
          </text>
        )}

        {serie.map((d, i) => (
          <text
            key={"x" + i}
            x={x(i)}
            y={H - mb + 20}
            fontSize="10"
            fill="var(--text-muted)"
            textAnchor="middle"
          >
            {d.rotulo}
          </text>
        ))}
      </svg>
      <Legenda
        itens={[
          { cor: COR_META, label: "Meta acumulada" },
          { cor: COR_REAL, label: "Realizado acumulado" },
        ]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Evolução mensal — meta do mês (fantasma) versus realizado
// ---------------------------------------------------------------------------
export type PontoEvolucao = { rotulo: string; real: number | null; meta: number | null; pct: number | null };

export function GraficoEvolucao({ serie }: { serie: PontoEvolucao[] }) {
  const temReal = serie.some((d) => d.real !== null);
  if (!temReal) return <Vazio msg="Sem histórico lançado para este indicador." />;

  const W = 760;
  const H = 240;
  const ml = 62;
  const mr = 16;
  const mt = 20;
  const mb = 44;
  const valores = [
    ...serie.map((d) => d.real),
    ...serie.map((d) => d.meta),
  ].filter((v): v is number => v !== null);
  const maxV = Math.max(...valores) * 1.18 || 1;
  const x = (i: number) => ml + (W - ml - mr) * (serie.length > 1 ? i / (serie.length - 1) : 0.5);
  const y = (v: number) => mt + (H - mt - mb) * (1 - v / maxV);
  const bw = Math.min(((W - ml - mr) / serie.length) * 0.42, 40);

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" fontFamily="inherit">
        {[0, 0.25, 0.5, 0.75, 1].map((f) => {
          const v = maxV * f;
          return (
            <g key={f}>
              <line x1={ml} y1={y(v)} x2={W - mr} y2={y(v)} stroke="var(--border)" />
              <text x={ml - 7} y={y(v) + 3.5} fontSize="9.5" fill="var(--text-muted)" textAnchor="end">
                {v >= 1000 ? (v / 1000).toFixed(1) + "k" : v.toFixed(1)}
              </text>
            </g>
          );
        })}
        {serie.map((d, i) => (
          <g key={i}>
            {d.meta !== null && (
              <rect
                x={x(i) - bw}
                y={y(d.meta)}
                width={bw}
                height={Math.max(y(0) - y(d.meta), 1)}
                fill={COR_META}
                opacity={0.22}
                rx={2}
              />
            )}
            {d.real !== null && (
              <rect
                x={x(i)}
                y={y(d.real)}
                width={bw}
                height={Math.max(y(0) - y(d.real), 1)}
                fill={corDe(d.pct)}
                rx={2}
              />
            )}
            <text x={x(i)} y={H - mb + 20} fontSize="10" fill="var(--text-muted)" textAnchor="middle">
              {d.rotulo}
            </text>
          </g>
        ))}
      </svg>
      <Legenda
        itens={[
          { cor: COR_META, label: "Meta do mês", opacidade: 0.35 },
          { cor: CORES.ok, label: "Realizado (cor pelo atingimento)" },
        ]}
      />
    </>
  );
}

export function corSituacao(s: Situacao): string {
  return CORES[s];
}
