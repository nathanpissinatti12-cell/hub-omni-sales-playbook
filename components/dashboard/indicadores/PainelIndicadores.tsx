"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CRONOGRAMA,
  N3,
  N4,
  PESSOAS,
  BDR_PADRAO,
  closerKpis,
  indicadoresPlanos,
  isGrupo,
  mesesCiclo,
  rotuloMes,
  type Indicador,
  type LinhaTabela,
} from "@/lib/indicadores";
import {
  corDe,
  diasUteis,
  diasUteisDoMes,
  fatorAno,
  fatorMes,
  fatorTrimestre,
  fmt,
  iso,
  limitesTrimestre,
  num,
  resolveMeta,
  status,
} from "@/lib/indicadoresCalc";
import {
  GraficoBurnup,
  GraficoComparativo,
  GraficoEvolucao,
  GraficoRanking,
  type ItemComparativo,
  type ItemRanking,
  type PontoBurnup,
  type PontoEvolucao,
} from "./Graficos";

type ValorApi = { mes: string; tipo: "real" | "meta"; chave: string; valor: string | null };

/** Estado local: mapa mes -> tipo -> chave -> valor bruto (string, como digitado). */
type Mapa = Record<string, Record<string, string>>;

function chaveMapa(mes: string, tipo: string) {
  return `${mes}|${tipo}`;
}

export function PainelIndicadores() {
  const meses = useMemo(() => mesesCiclo(), []);
  const [mesAtivo, setMesAtivo] = useState(meses[0]);
  const [dtIni, setDtIni] = useState("");
  const [dtFim, setDtFim] = useState("");
  const [mapa, setMapa] = useState<Mapa>({});
  const [pessoaSel, setPessoaSel] = useState(PESSOAS[0].chave);
  const [kpiComp, setKpiComp] = useState("ini");
  const [indEvo, setIndEvo] = useState("n3_mrr_out");
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState("");

  // ---- carga inicial -------------------------------------------------------
  useEffect(() => {
    fetch("/api/dashboard/indicadores")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: ValorApi[]) => {
        const m: Mapa = {};
        for (const row of rows) {
          const k = chaveMapa(row.mes, row.tipo);
          m[k] = m[k] || {};
          m[k][row.chave] = row.valor ?? "";
        }
        setMapa(m);
      })
      .catch(() => setAviso("Não foi possível carregar os lançamentos."))
      .finally(() => setCarregando(false));
  }, []);

  // Período default: do primeiro dia do mês ativo até hoje (ou fim do mês).
  useEffect(() => {
    const [ano, mes] = mesAtivo.split("-").map(Number);
    const primeiro = new Date(ano, mes - 1, 1);
    const ultimo = new Date(ano, mes, 0);
    const hoje = new Date();
    setDtIni(iso(primeiro));
    setDtFim(iso(hoje >= primeiro && hoje < ultimo ? hoje : ultimo));
  }, [mesAtivo]);

  // ---- gravação com debounce por chave ------------------------------------
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const gravar = useCallback(
    (tipo: "real" | "meta", chave: string, valor: string) => {
      const id = `${mesAtivo}|${tipo}|${chave}`;
      clearTimeout(timers.current[id]);
      timers.current[id] = setTimeout(() => {
        fetch("/api/dashboard/indicadores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mes: mesAtivo, tipo, chave, valor: valor === "" ? null : valor }),
        })
          .then((r) => {
            if (!r.ok) throw new Error();
            setAviso(`Salvo às ${new Date().toLocaleTimeString("pt-BR")}`);
          })
          .catch(() => setAviso("Falha ao salvar — verifique a conexão."));
      }, 700);
    },
    [mesAtivo]
  );

  const setValor = useCallback(
    (tipo: "real" | "meta", chave: string, valor: string) => {
      const k = chaveMapa(mesAtivo, tipo);
      setMapa((prev) => ({ ...prev, [k]: { ...(prev[k] || {}), [chave]: valor } }));
      gravar(tipo, chave, valor);
    },
    [mesAtivo, gravar]
  );

  const reais = mapa[chaveMapa(mesAtivo, "real")] || {};
  const metasOverride = useMemo(() => {
    const brutos = mapa[chaveMapa(mesAtivo, "meta")] || {};
    const out: Record<string, number | null> = {};
    for (const [k, v] of Object.entries(brutos)) out[k] = num(v);
    return out;
  }, [mapa, mesAtivo]);

  // ---- chips do período ----------------------------------------------------
  const duPeriodo = diasUteis(dtIni, dtFim);
  const duMes = diasUteisDoMes(dtIni);
  const pctMes = (fatorMes(dtIni, dtFim) * 100).toFixed(0);
  const pctTri = (fatorTrimestre(dtFim) * 100).toFixed(0);
  const pctAno = (fatorAno(dtFim) * 100).toFixed(0);

  const pessoa = PESSOAS.find((p) => p.chave === pessoaSel) ?? PESSOAS[0];

  // ---- rankings ------------------------------------------------------------
  const ranking = useCallback(
    (defs: LinhaTabela[] | Indicador[], prefixo: string): ItemRanking[] => {
      const out: ItemRanking[] = [];
      for (const l of defs as LinhaTabela[]) {
        if (isGrupo(l)) continue;
        const ind = l as Indicador;
        if (ind.meta === null) continue; // baseline não entra no ranking
        const chave = prefixo + ind.id;
        const { proporcional } = resolveMeta(ind, chave, metasOverride, dtIni, dtFim);
        const st = status(num(reais[chave]), proporcional, ind.dir);
        if (st.pct === null) continue;
        out.push({ nome: ind.nome, pct: st.pct });
      }
      return out.sort((a, b) => a.pct - b.pct);
    },
    [reais, metasOverride, dtIni, dtFim]
  );

  const rankingPessoa = useMemo((): ItemRanking[] => {
    const out: ItemRanking[] = [];
    for (const ind of pessoa.kpis) {
      const chave = `${pessoa.chave}_${ind.id}`;
      const { proporcional } = resolveMeta(ind, chave, metasOverride, dtIni, dtFim);
      const st = status(num(reais[chave]), proporcional, ind.dir);
      if (st.pct === null) continue;
      out.push({ nome: ind.nome, pct: st.pct });
    }
    return out.sort((a, b) => a.pct - b.pct);
  }, [pessoa, reais, metasOverride, dtIni, dtFim]);

  // ---- comparativo entre pessoas ------------------------------------------
  const comparativo = useMemo((): ItemComparativo[] => {
    return PESSOAS.map((p) => {
      const def = p.kpis.find((k) => k.id === kpiComp);
      if (!def) return null;
      const chave = `${p.chave}_${kpiComp}`;
      const { proporcional } = resolveMeta(def, chave, metasOverride, dtIni, dtFim);
      const real = num(reais[chave]);
      const st = status(real, proporcional, def.dir);
      return { nome: p.nome.split(" — ")[0], real, meta: proporcional, pct: st.pct };
    }).filter((x): x is ItemComparativo => x !== null);
  }, [kpiComp, reais, metasOverride, dtIni, dtFim]);

  const kpisComparaveis = useMemo(() => {
    const lista = BDR_PADRAO.map((k) => ({ id: k.id, nome: k.nome }));
    for (const k of closerKpis(0, 0)) {
      if (!lista.some((x) => x.id === k.id)) lista.push({ id: k.id, nome: k.nome });
    }
    return lista;
  }, []);

  // ---- burn-ups ------------------------------------------------------------
  const serieBurnup = useCallback(
    (mesesJanela: string[]): PontoBurnup[] => {
      let accMeta = 0;
      let accReal = 0;
      return mesesJanela.map((k) => {
        accMeta += CRONOGRAMA[k].out + CRONOGRAMA[k].inb;
        const doMes = mapa[chaveMapa(k, "real")] || {};
        const out = num(doMes["n3_mrr_out"]);
        const inb = num(doMes["n3_mrr_in"]);
        const temLancamento = out !== null || inb !== null;
        if (temLancamento) accReal += (out ?? 0) + (inb ?? 0);
        return {
          mes: k,
          rotulo: rotuloMes(k),
          meta: accMeta,
          real: temLancamento ? accReal : null,
        };
      });
    },
    [mapa]
  );

  const mesesTrimestre = useMemo(() => {
    const L = limitesTrimestre(`${mesAtivo}-15`);
    return meses.filter((k) => {
      const [ano, mes] = k.split("-").map(Number);
      const primeiro = iso(new Date(ano, mes - 1, 1));
      return primeiro >= L.ini && primeiro <= L.fim;
    });
  }, [mesAtivo, meses]);

  // ---- evolução mensal -----------------------------------------------------
  const serieEvolucao = useMemo((): PontoEvolucao[] => {
    const def = indicadoresPlanos().find((r) => r.id === indEvo);
    if (!def) return [];
    return meses.map((k) => {
      const doMes = mapa[chaveMapa(k, "real")] || {};
      const real = num(doMes[indEvo]);
      let meta = def.meta;
      if (indEvo === "n3_mrr_out") meta = CRONOGRAMA[k].out;
      if (indEvo === "n3_mrr_in") meta = CRONOGRAMA[k].inb;
      const pct = meta !== null ? status(real, meta, def.dir).pct : null;
      return { rotulo: rotuloMes(k), real, meta, pct };
    });
  }, [indEvo, mapa, meses]);

  // ---- ações ---------------------------------------------------------------
  async function limparMes() {
    if (!confirm(`Limpar os realizados de ${rotuloMes(mesAtivo)}? As metas e os demais meses são mantidos.`)) {
      return;
    }
    const r = await fetch(`/api/dashboard/indicadores?mes=${mesAtivo}`, { method: "DELETE" });
    if (!r.ok) {
      setAviso("Não foi possível limpar.");
      return;
    }
    setMapa((prev) => ({ ...prev, [chaveMapa(mesAtivo, "real")]: {} }));
    setAviso(`Realizados de ${rotuloMes(mesAtivo)} limpos.`);
  }

  function exportar() {
    const blob = new Blob([JSON.stringify(mapa, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `omni_indicadores_${mesAtivo}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (carregando) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Carregando indicadores…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---------------- período ---------------- */}
      <Painel titulo="Período de apuração">
        <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
          A meta comparada é sempre a proporcional aos dias úteis decorridos — nunca a meta cheia.
          Indicadores mensais usam o recorte selecionado; <b>Resultado do trimestre</b> e <b>ARR</b> são
          acumulados e ponderados pelas metas de cada mês do cronograma (ago–dez/2026), já que as metas
          crescem mês a mês. Taxas (%) e valores unitários não são proporcionalizados.
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <Campo label="Mês de registro">
            <select value={mesAtivo} onChange={(e) => setMesAtivo(e.target.value)} className={inputCls} style={inputStyle}>
              {meses.map((m) => (
                <option key={m} value={m}>
                  {rotuloMes(m)}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Início">
            <input type="date" value={dtIni} onChange={(e) => setDtIni(e.target.value)} className={inputCls} style={inputStyle} />
          </Campo>
          <Campo label="Fim">
            <input type="date" value={dtFim} onChange={(e) => setDtFim(e.target.value)} className={inputCls} style={inputStyle} />
          </Campo>
          <Chip label="Dias úteis do período" valor={duPeriodo || "—"} />
          <Chip label="Dias úteis do mês" valor={duMes || "—"} />
          <Chip label="Proporção do mês" valor={`${pctMes}%`} />
          <Chip label="Trimestre decorrido" valor={`${pctTri}%`} />
          <Chip label="Ciclo ARR decorrido" valor={`${pctAno}%`} />
        </div>
      </Painel>

      {/* ---------------- N3 ---------------- */}
      <Painel titulo="Head Comercial" tag="N3" tagCor="var(--accent)" desc="13 indicadores · 9 com meta · 4 em baseline">
        <Tabela
          defs={N3}
          prefixo=""
          reais={reais}
          metasOverride={metasOverride}
          dtIni={dtIni}
          dtFim={dtFim}
          onChange={setValor}
        />
        <Secao titulo="Ranking de atingimento — N3">
          <GraficoRanking dados={ranking(N3, "")} />
        </Secao>
      </Painel>

      {/* ---------------- N4 ---------------- */}
      <Painel titulo="Supervisão" tag="N4" tagCor="#EC4899" desc="9 indicadores agregados por função">
        <Tabela
          defs={N4}
          prefixo=""
          reais={reais}
          metasOverride={metasOverride}
          dtIni={dtIni}
          dtFim={dtFim}
          onChange={setValor}
        />
        <Secao titulo="Ranking de atingimento — N4">
          <GraficoRanking dados={ranking(N4, "")} />
        </Secao>
      </Painel>

      {/* ---------------- N5 ---------------- */}
      <Painel
        titulo="Operação individual"
        tag="N5"
        tagCor="#0EA5E9"
        desc="Selecione a pessoa para lançar e ler os indicadores individuais."
      >
        <div className="mb-4 max-w-xs">
          <Campo label="Pessoa">
            <select value={pessoaSel} onChange={(e) => setPessoaSel(e.target.value)} className={inputCls} style={inputStyle}>
              {PESSOAS.map((p) => (
                <option key={p.chave} value={p.chave}>
                  {p.nome}
                </option>
              ))}
            </select>
          </Campo>
        </div>
        <Tabela
          defs={[{ grupo: pessoa.nome, cor: "p5" }, ...pessoa.kpis]}
          prefixo={`${pessoa.chave}_`}
          reais={reais}
          metasOverride={metasOverride}
          dtIni={dtIni}
          dtFim={dtFim}
          onChange={setValor}
        />
        <Secao titulo="Ranking de atingimento — pessoa selecionada">
          <GraficoRanking dados={rankingPessoa} />
        </Secao>
        <Secao
          titulo="Comparativo entre pessoas"
          acao={
            <select value={kpiComp} onChange={(e) => setKpiComp(e.target.value)} className={inputCls} style={inputStyle}>
              {kpisComparaveis.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nome}
                </option>
              ))}
            </select>
          }
        >
          <GraficoComparativo dados={comparativo} />
        </Secao>
      </Painel>

      {/* ---------------- evolução ---------------- */}
      <Painel
        titulo="Evolução e ritmo"
        desc="Curvas acumuladas do cronograma ago–dez/2026, alimentadas pelo histórico de cada mês registrado."
      >
        <Secao titulo="Burn-up do trimestre" primeira>
          <GraficoBurnup
            serie={serieBurnup(mesesTrimestre)}
            vazioMsg="Lance o MRR novo (outbound e inbound) para desenhar a curva."
          />
        </Secao>
        <Secao titulo="Burn-up do ARR — ciclo ago–dez/2026">
          <GraficoBurnup
            serie={serieBurnup(meses)}
            vazioMsg="Lance o MRR novo (outbound e inbound) para desenhar a curva."
          />
        </Secao>
        <Secao
          titulo="Evolução mensal"
          acao={
            <select value={indEvo} onChange={(e) => setIndEvo(e.target.value)} className={inputCls} style={inputStyle}>
              {indicadoresPlanos().map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nome}
                </option>
              ))}
            </select>
          }
        >
          <GraficoEvolucao serie={serieEvolucao} />
        </Secao>
      </Painel>

      {/* ---------------- dados ---------------- */}
      <Painel titulo="Dados">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportar} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
            Exportar JSON
          </button>
          <button onClick={limparMes} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
            Limpar realizados do mês
          </button>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {aviso}
          </span>
        </div>
        <p className="mt-4 rounded-r-lg py-3 pl-4 pr-3 text-sm" style={{ borderLeft: "3px solid var(--accent)", background: "var(--surface)", color: "var(--text-muted)" }}>
          📌 Os lançamentos são salvos automaticamente no banco e ficam visíveis para todos os
          administradores. Instrumento de leitura da quinzenal — não substitui a medição contínua.
        </p>
      </Painel>
    </div>
  );
}

// ===========================================================================
// Subcomponentes de layout
// ===========================================================================

const inputCls = "rounded-md border bg-transparent px-3 py-2 text-sm outline-none";
const inputStyle = { borderColor: "var(--border)", color: "var(--text)" } as const;

function Painel({
  titulo,
  tag,
  tagCor,
  desc,
  children,
}: {
  titulo: string;
  tag?: string;
  tagCor?: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <h2 className="flex items-center gap-2.5 text-lg font-semibold">
        {tag && (
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider"
            style={{ background: tagCor, color: "#fff" }}
          >
            {tag}
          </span>
        )}
        {titulo}
      </h2>
      {desc && (
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {desc}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({ label, valor }: { label: string; valor: string | number }) {
  return (
    <div className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)" }}>
      <span className="block text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <b className="text-base" style={{ color: "var(--accent)" }}>
        {valor}
      </b>
    </div>
  );
}

function Secao({
  titulo,
  acao,
  primeira,
  children,
}: {
  titulo: string;
  acao?: React.ReactNode;
  primeira?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={primeira ? "" : "mt-6 border-t pt-5"} style={primeira ? undefined : { borderColor: "var(--border)" }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          {titulo}
        </span>
        {acao}
      </div>
      {children}
    </div>
  );
}

// ===========================================================================
// Tabela de indicadores
// ===========================================================================

function Tabela({
  defs,
  prefixo,
  reais,
  metasOverride,
  dtIni,
  dtFim,
  onChange,
}: {
  defs: LinhaTabela[];
  prefixo: string;
  reais: Record<string, string>;
  metasOverride: Record<string, number | null>;
  dtIni: string;
  dtFim: string;
  onChange: (tipo: "real" | "meta", chave: string, valor: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {["Indicador", "Meta", "Meta proporcional", "Realizado", "Atingimento"].map((h, i) => (
              <th
                key={h}
                className={`whitespace-nowrap border-b-2 px-2 py-2 text-[10px] font-extrabold uppercase tracking-wide ${
                  i === 0 ? "text-left" : "text-right"
                }`}
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {defs.map((linha, idx) => {
            if (isGrupo(linha)) {
              const cor =
                linha.cor === "p4" ? "#EC4899" : linha.cor === "p5" ? "#0EA5E9" : "var(--accent)";
              return (
                <tr key={`g${idx}`}>
                  <td
                    colSpan={5}
                    className="px-2 py-2 text-[10px] font-extrabold uppercase tracking-wide"
                    style={{ color: cor, background: "var(--bg, transparent)" }}
                  >
                    {linha.grupo}
                  </td>
                </tr>
              );
            }

            const ind = linha as Indicador;
            const chave = prefixo + ind.id;
            const semMeta = ind.meta === null;
            const { base, proporcional } = resolveMeta(ind, chave, metasOverride, dtIni, dtFim);
            const real = num(reais[chave]);
            const st = status(real, proporcional, ind.dir);

            return (
              <tr key={chave} style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="px-2 py-2">
                  <span className="font-semibold">{ind.nome}</span>
                  {ind.hint && (
                    <span className="block text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>
                      {ind.hint}
                    </span>
                  )}
                </td>
                <td className="px-2 py-2 text-right tabular-nums">
                  {semMeta ? (
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide"
                      style={{ background: "rgba(180,83,9,.18)", color: "#D97706" }}
                    >
                      sem meta
                    </span>
                  ) : (
                    <span className="font-bold">{fmt(base, ind.fmt)}</span>
                  )}
                </td>
                <td className="px-2 py-2 text-right font-extrabold tabular-nums" style={{ color: "var(--accent)" }}>
                  {proporcional === null ? "—" : fmt(proporcional, ind.fmt)}
                </td>
                <td className="px-2 py-2 text-right">
                  <input
                    type="number"
                    step="0.01"
                    value={reais[chave] ?? ""}
                    onChange={(e) => onChange("real", chave, e.target.value)}
                    className="w-28 rounded-md border bg-transparent px-2 py-1 text-right text-sm outline-none"
                    style={inputStyle}
                  />
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-right font-extrabold tabular-nums">
                  <span
                    className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                    style={{ background: corDe(st.pct) }}
                  />
                  <span style={{ color: corDe(st.pct) }}>
                    {st.pct === null ? "—" : st.pct.toFixed(0) + "%"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
