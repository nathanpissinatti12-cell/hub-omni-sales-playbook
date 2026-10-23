"use client";

// Gráficos do Painel de Indicadores em SVG puro (sem lib externa).
// Adaptados do painel HTML original: mesma leitura visual, mas usando os
// tokens de cor do playbook em vez da paleta clara fixa do arquivo de origem.

import { Fragment } from "react";
import { CORES, CORES_AREA, corAreaDe, corDe, fmt, type Situacao } from "@/lib/indicadoresCalc";
import type { Formato } from "@/lib/indicadores";

const COR_META = "var(--accent)";
// Mesmo rosa escurecido das etiquetas N4 (ver COR_N4 no painel): a barra sozinha
// passaria com o tom claro, mas usar dois rosas diferentes na mesma tela não.
const COR_REAL = "#BE185D";

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
// Colunas por mês, com a régua da meta e o eixo só nos números que importam
// ---------------------------------------------------------------------------

/** "230", "1,2k", "R$ 4,9k" — curto o bastante para caber no eixo. */
function rotuloEixo(v: number, formato: Formato): string {
  if (formato === "pct") return `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
  if (formato === "x") return `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}x`;
  const n = Math.abs(v) >= 1000 ? `${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}k` : v.toLocaleString("pt-BR", { maximumFractionDigits: 0 });
  return formato === "brl" ? `R$ ${n}` : n;
}

/**
 * Uma coluna por mês com o realizado, e a meta do mês do relatório como régua
 * tracejada atravessando o gráfico.
 *
 * O eixo mostra SÓ o zero e a meta; o valor de cada mês vai escrito em cima da
 * coluna. As marcas automáticas (211.2, 158.4, 105.6…) não significam nada para
 * quem lê — são divisões da escala, não valores que aconteceram.
 *
 * Escrever o valor na coluna também desfaz a briga por espaço no eixo: o melhor
 * mês da Sara (179) e a meta (175) ficam a quatro pixels um do outro, e enquanto
 * os dois eram marca de eixo, um tinha de sumir. Agora cada um tem o seu lugar —
 * e dá para ler o valor de TODO mês, não só do melhor e do pior.
 *
 * Coluna, não ponto: volume por mês se compara por altura, e barra vazia deixa
 * explícito o mês sem lançamento.
 */
export function GraficoColunasMensal({
  serie,
  meta,
  formato,
}: {
  serie: { rotulo: string; real: number | null; pct: number | null }[];
  meta: number | null;
  formato: Formato;
}) {
  const reais = serie.map((d) => d.real).filter((v): v is number => v !== null);
  if (reais.length === 0) return <Vazio msg="Sem realizado lançado neste ciclo para este indicador." />;

  const W = 760;
  const H = 240;
  const ml = formato === "brl" ? 74 : 56;
  const mr = 16;
  const mt = 18;
  const mb = 40;

  const maior = Math.max(...reais);
  // A escala precisa caber a meta, senão a régua sai do gráfico, e deixar folga
  // em cima da coluna mais alta para o rótulo dela não ser cortado.
  const escala = Math.max(maior, meta ?? 0) * 1.14 || 1;
  const y = (v: number) => mt + (1 - v / escala) * (H - mt - mb);
  const pw = (W - ml - mr) / serie.length;

  // O eixo guarda só o zero e a META. O valor de cada mês passou a ser escrito
  // EM CIMA da coluna, que resolve de uma vez o problema dos rótulos colados:
  // antes o melhor mês (179) e a meta (175) disputavam o mesmo lugar no eixo, e
  // um dos dois tinha de sumir. Agora cada um tem o seu espaço — e dá para ler o
  // valor de todo mês, não só do melhor e do pior.
  const eixo: { v: number; destaque: boolean }[] = [{ v: 0, destaque: false }];
  if (meta !== null) eixo.push({ v: meta, destaque: true });

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" fontFamily="inherit">
        {/* A régua é desenhada sempre, mesmo quando o rótulo dela perdeu a
            disputa por espaço: sem a linha, o gráfico deixaria de ter referência. */}
        {meta !== null && (
          <line
            x1={ml}
            x2={W - mr}
            y1={y(meta)}
            y2={y(meta)}
            stroke={COR_META}
            strokeWidth={2}
            strokeDasharray="6 5"
          />
        )}
        {eixo.map((m) => (
          <g key={m.v}>
            {!m.destaque && (
              <line x1={ml} x2={W - mr} y1={y(m.v)} y2={y(m.v)} stroke="var(--border)" strokeWidth={1} />
            )}
            <text
              x={ml - 8}
              y={y(m.v) + 3.5}
              fontSize="10.5"
              fontWeight={m.destaque ? 700 : 400}
              fill={m.destaque ? COR_META : "var(--text-muted)"}
              textAnchor="end"
            >
              {rotuloEixo(m.v, formato)}
            </text>
          </g>
        ))}

        {serie.map((d, i) => {
          const cx = ml + i * pw + pw / 2;
          const bw = Math.min(pw * 0.56, 34);
          return (
            <g key={d.rotulo + i}>
              {d.real !== null && (
                <>
                  <rect
                    x={cx - bw / 2}
                    y={y(d.real)}
                    width={bw}
                    height={Math.max(y(0) - y(d.real), 2)}
                    fill={corAreaDe(d.pct)}
                    rx={3}
                  />
                  {/* O número em cima da coluna, na cor do semáforo: é o que
                      mostra "passou da meta" sem o leitor medir altura. */}
                  <text
                    x={cx}
                    y={y(d.real) - 6}
                    fontSize="10.5"
                    fontWeight={700}
                    fill={corDe(d.pct)}
                    textAnchor="middle"
                  >
                    {rotuloEixo(d.real, formato)}
                  </text>
                </>
              )}
              <text x={cx} y={H - mb + 18} fontSize="9.5" fill="var(--text-muted)" textAnchor="middle">
                {d.rotulo}
              </text>
            </g>
          );
        })}
      </svg>
      <Legenda
        itens={[
          { cor: COR_META, label: meta === null ? "sem meta" : `meta do mês: ${rotuloEixo(meta, formato)}` },
          { cor: CORES_AREA.ok, label: "na meta (100%+)" },
          { cor: CORES_AREA.warn, label: "quase (85–99%)" },
          { cor: CORES_AREA.bad, label: "abaixo (até 84%)" },
        ]}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Ranking mensal — todos os meses lançados, do maior para o menor, com a meta
// encaixada na posição dela
// ---------------------------------------------------------------------------
export type MesLancado = { mes: string; valor: number };

/**
 * Responde "quantos meses bateram a meta, e onde o mês atual se encaixa" — que
 * o gráfico de linha não responde de relance, porque lá o olho precisa comparar
 * cada ponto com o tracejado.
 *
 * A meta entra como uma LINHA DA LISTA, na posição em que cairia se fosse mais
 * um mês. É isso que faz a leitura ser imediata: tudo acima dela bateu, tudo
 * abaixo não. E é a meta do mês do relatório, congelada — mudar a meta em
 * novembro não reescreve o que outubro cobrava.
 *
 * Cada linha diz de que mês é, de propósito. Ordenar só por valor perderia o
 * tempo; com o rótulo, dá para ver o ranking E se os meses recentes estão no
 * topo ou no fim.
 *
 * FORA DA TELA desde 23/10/2026, a pedido: o RMR abre só o mês a mês. Mantido
 * inteiro porque voltar a mostrá-lo é uma linha de JSX.
 */
export function RankingMensal({
  pontos,
  meta,
  formato,
  dir,
  rotuloMeta,
  destaque,
}: {
  pontos: MesLancado[];
  meta: number | null;
  formato: Formato;
  dir: "up" | "down";
  /** "meta de out/26" — deixa explícito de que mês é a régua. */
  rotuloMeta: string;
  /** Mês do relatório, marcado na lista para não se perder no meio. */
  destaque?: string;
}) {
  if (pontos.length === 0) {
    return <Vazio msg="Sem lançamento deste indicador em nenhum mês." />;
  }

  const ordenados = [...pontos].sort((a, b) => b.valor - a.valor);
  const teto = Math.max(...ordenados.map((p) => p.valor), meta ?? 0) || 1;
  const bateu = (v: number) => (meta === null ? null : dir === "up" ? v >= meta : v <= meta);

  // A meta vira uma linha no meio da lista: entra antes do primeiro mês que
  // ficou abaixo dela.
  const acima = ordenados.filter((p) => p.valor > (meta ?? -Infinity));

  return (
    <div className="space-y-1">
      {ordenados.map((p, i) => {
        const ok = bateu(p.valor);
        const ehDestaque = p.mes === destaque;
        return (
          <Fragment key={p.mes}>
            {meta !== null && i === acima.length && <LinhaMeta meta={meta} formato={formato} rotulo={rotuloMeta} teto={teto} />}
            <div className="flex items-center gap-2 text-xs">
              <span
                className="w-16 shrink-0 text-right tabular-nums"
                style={{ color: ehDestaque ? "var(--text)" : "var(--text-muted)", fontWeight: ehDestaque ? 700 : 400 }}
              >
                {p.mes}
              </span>
              <span
                className="h-3 rounded-sm"
                style={{
                  width: `${Math.max((p.valor / teto) * 100, 1)}%`,
                  background: ok === null ? CORES_AREA.na : ok ? CORES_AREA.ok : CORES_AREA.bad,
                }}
              />
              <b className="tabular-nums" style={{ color: ok === null ? "var(--text-muted)" : ok ? CORES.ok : CORES.bad }}>
                {fmt(p.valor, formato)}
              </b>
            </div>
          </Fragment>
        );
      })}
      {meta !== null && acima.length === ordenados.length && (
        <LinhaMeta meta={meta} formato={formato} rotulo={rotuloMeta} teto={teto} />
      )}
    </div>
  );
}

/** A régua no meio da lista. Tracejada e roxa, como a meta nos outros gráficos. */
function LinhaMeta({
  meta,
  formato,
  rotulo,
  teto,
}: {
  meta: number;
  formato: Formato;
  rotulo: string;
  teto: number;
}) {
  return (
    <div className="flex items-center gap-2 py-0.5 text-xs">
      <span className="w-16 shrink-0 text-right font-bold" style={{ color: COR_META }}>
        meta
      </span>
      <span
        className="h-0 shrink-0"
        style={{ width: `${Math.max((meta / teto) * 100, 1)}%`, borderTop: `2px dashed ${COR_META}` }}
      />
      <b className="tabular-nums" style={{ color: COR_META }}>
        {fmt(meta, formato)}
      </b>
      <span style={{ color: "var(--text-muted)" }}>· {rotulo}</span>
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
        // Barra e rótulo pedem contrastes diferentes: a área 3:1, o texto 4,5:1.
        const corBarra = corAreaDe(d.pct);
        const corTexto = corDe(d.pct);
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
              fill={corBarra}
              rx={3}
            />
            <text
              x={x(larguraPct) + 7}
              y={y + bh / 2 + 3.5}
              fontSize="10.5"
              fontWeight={800}
              fill={corTexto}
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
                  fill={corAreaDe(d.pct)}
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
                fill={corAreaDe(d.pct)}
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
          { cor: CORES_AREA.ok, label: "Realizado: na meta (100%+)" },
          { cor: CORES_AREA.warn, label: "quase (85–99%)" },
          { cor: CORES_AREA.bad, label: "abaixo (até 84%)" },
        ]}
      />
    </>
  );
}

/**
 * Evolução do ano em LINHA — uma para o realizado, outra para a meta, com os 12
 * meses no eixo. É o gráfico que abre ao clicar no nome do indicador. O
 * GraficoEvolucao acima é de barras: com 12 pontos a barra fica estreita demais
 * e a leitura de tendência se perde.
 */
export function GraficoLinhaMensal({ serie }: { serie: PontoEvolucao[] }) {
  const temAlgo = serie.some((d) => d.real !== null || d.meta !== null);
  if (!temAlgo) return <Vazio msg="Sem meta nem realizado lançados neste ano para este indicador." />;

  const W = 760;
  const H = 230;
  const ml = 62;
  const mr = 16;
  const mt = 18;
  const mb = 40;
  const valores = [...serie.map((d) => d.real), ...serie.map((d) => d.meta)].filter(
    (v): v is number => v !== null
  );
  const maxV = Math.max(...valores, 0) * 1.18 || 1;
  const x = (i: number) => ml + ((W - ml - mr) * i) / Math.max(serie.length - 1, 1);
  const y = (v: number) => mt + (H - mt - mb) * (1 - v / maxV);

  // Mês sem valor interrompe a linha, em vez de ligar por cima do buraco —
  // ligar sugeriria um valor que nunca foi lançado.
  const segmentos = (campo: "real" | "meta") => {
    const partes: string[][] = [];
    let atual: string[] = [];
    serie.forEach((d, i) => {
      const v = d[campo];
      if (v === null) {
        if (atual.length) partes.push(atual);
        atual = [];
        return;
      }
      atual.push(`${x(i)},${y(v)}`);
    });
    if (atual.length) partes.push(atual);
    return partes;
  };

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

        {segmentos("meta").map((pontos, i) => (
          <polyline
            key={`m${i}`}
            points={pontos.join(" ")}
            fill="none"
            stroke={COR_META}
            strokeWidth={2}
            strokeDasharray="5 4"
            opacity={0.85}
          />
        ))}
        {segmentos("real").map((pontos, i) => (
          <polyline
            key={`r${i}`}
            points={pontos.join(" ")}
            fill="none"
            stroke={CORES_AREA.ok}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        ))}

        {serie.map((d, i) => (
          <g key={i}>
            {d.real !== null && <circle cx={x(i)} cy={y(d.real)} r={3.5} fill={corAreaDe(d.pct)} />}
            <text x={x(i)} y={H - mb + 18} fontSize="9.5" fill="var(--text-muted)" textAnchor="middle">
              {d.rotulo}
            </text>
          </g>
        ))}
      </svg>
      <Legenda
        itens={[
          { cor: COR_META, label: "Meta do mês (tracejado)" },
          { cor: CORES_AREA.ok, label: "Realizado: na meta (100%+)" },
          { cor: CORES_AREA.warn, label: "quase (85–99%)" },
          { cor: CORES_AREA.bad, label: "abaixo (até 84%)" },
        ]}
      />
    </>
  );
}

export function corSituacao(s: Situacao): string {
  return CORES[s];
}
