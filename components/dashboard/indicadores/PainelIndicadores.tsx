"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CRONOGRAMA,
  BDR_PADRAO,
  closerKpis,
  indicadoresPlanos,
  isGrupo,
  mesesCiclo,
  rotuloMes,
  type Formato,
  type Indicador,
  type LinhaTabela,
  type Unidade,
} from "@/lib/indicadores";
import type { Permissao } from "@/lib/permissaoIndicadores";
import {
  CORES,
  corDe,
  diasUteis,
  diasUteisDoMes,
  diasUteisRestantes,
  fatorAno,
  fatorMes,
  fatorTrimestre,
  fmt,
  fmtNumero,
  iso,
  limitesTrimestre,
  metaDinamica,
  num,
  parseNumeroBr,
  resolveMeta,
  ritmoNecessario,
  status,
} from "@/lib/indicadoresCalc";
import {
  GraficoBurnup,
  GraficoComparativo,
  GraficoEvolucao,
  GraficoLinhaMensal,
  GraficoRanking,
  type ItemComparativo,
  type ItemRanking,
  type PontoBurnup,
  type PontoEvolucao,
} from "./Graficos";

type ValorApi = {
  mes: string;
  tipo: "real" | "meta";
  chave: string;
  valor: string | null;
  editadoPor: string | null;
  editadoEm: string | null;
};

type FechamentoApi = { mes: string; fechadoEm: string; fechadoPor: string | null };

type HistoricoApi = {
  mes: string;
  tipo: "real" | "meta";
  chave: string;
  valorAntigo: string | null;
  valorNovo: string | null;
  acao: string;
  alteradoPor: string | null;
  alteradoEm: string;
};

type RespostaApi = {
  valores: ValorApi[];
  fechamentos: FechamentoApi[];
  historico: HistoricoApi[];
};

/** Estado local: mapa mes -> tipo -> chave -> valor bruto (string, como digitado). */
type Mapa = Record<string, Record<string, string>>;

/** Mesma indexação do Mapa, guardando quem gravou cada campo e quando. */
type Autoria = Record<string, Record<string, { por: string | null; em: string | null }>>;

function chaveMapa(mes: string, tipo: string) {
  return `${mes}|${tipo}`;
}

/** "15/10 às 14:32" — data curta, que é o que importa pra saber se é de hoje. */
function quando(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })} às ${d.toLocaleTimeString(
    "pt-BR",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
}

export function PainelIndicadores({ unidade, permissao }: { unidade: Unidade; permissao: Permissao }) {
  const { n3: N3, n4: N4 } = unidade;
  // Colaborador só enxerga a própria linha do N5 — o seletor de pessoa e o
  // comparativo entre pessoas somem junto, senão mostrariam nome de colega.
  const PESSOAS = useMemo(
    () =>
      permissao.somentePessoa
        ? unidade.pessoas.filter((p) => p.chave === permissao.somentePessoa)
        : unidade.pessoas,
    [unidade.pessoas, permissao.somentePessoa]
  );
  const meses = useMemo(() => mesesCiclo(), []);
  // Abre no mês corrente, não em janeiro: com os 12 meses na lista, começar pelo
  // primeiro faria o painel abrir sempre num mês vazio.
  const [mesAtivo, setMesAtivo] = useState(() => {
    const hoje = new Date();
    const atual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
    return meses.includes(atual) ? atual : meses[0];
  });
  const [dtIni, setDtIni] = useState("");
  const [dtFim, setDtFim] = useState("");
  const [mapa, setMapa] = useState<Mapa>({});
  const [autoria, setAutoria] = useState<Autoria>({});
  const [fechados, setFechados] = useState<Record<string, FechamentoApi>>({});
  const [pessoaSel, setPessoaSel] = useState(PESSOAS[0]?.chave ?? "");
  const [kpiComp, setKpiComp] = useState("ini");
  const [indEvo, setIndEvo] = useState("n3_mrr_out");
  const [historico, setHistorico] = useState<HistoricoApi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState("");

  // ---- carga ---------------------------------------------------------------
  // Uma função só, usada na abertura e no botão "Atualizar" do histórico: a
  // mesma chamada traz lançamentos, fechamentos e histórico.
  const carregar = useCallback(() => {
    return fetch(`/api/dashboard/indicadores?unidade=${unidade.slug}`)
      .then((r) => (r.ok ? r.json() : { valores: [], fechamentos: [], historico: [] }))
      .then((resp: RespostaApi) => {
        const m: Mapa = {};
        const a: Autoria = {};
        for (const row of resp.valores ?? []) {
          const k = chaveMapa(row.mes, row.tipo);
          m[k] = m[k] || {};
          m[k][row.chave] = row.valor ?? "";
          a[k] = a[k] || {};
          a[k][row.chave] = { por: row.editadoPor, em: row.editadoEm };
        }
        setMapa(m);
        setAutoria(a);
        setFechados(Object.fromEntries((resp.fechamentos ?? []).map((f) => [f.mes, f])));
        setHistorico(resp.historico ?? []);
      })
      .catch(() => setAviso("Não foi possível carregar os lançamentos."));
  }, [unidade.slug]);

  useEffect(() => {
    carregar().finally(() => setCarregando(false));
  }, [carregar]);

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
          body: JSON.stringify({ unidade: unidade.slug, mes: mesAtivo, tipo, chave, valor: valor === "" ? null : valor }),
        })
          .then((r) => {
            // 409 = mês fechado. A tela já esconde os campos nesse caso, então
            // isto só acontece se o mês for fechado em outra aba enquanto esta
            // está aberta — e aí a mensagem precisa dizer o motivo real.
            if (r.status === 409) {
              setAviso("Mês fechado — este lançamento não foi salvo. Recarregue a página.");
              return;
            }
            if (!r.ok) throw new Error();
            // A autoria local fica sem nome: quem salvou foi o próprio usuário, e
            // o painel não conhece o nome dele — o nome real vem no próximo
            // carregamento. Mostrar o autor anterior aqui seria mentira.
            const k = chaveMapa(mesAtivo, tipo);
            setAutoria((prev) => ({
              ...prev,
              [k]: { ...(prev[k] || {}), [chave]: { por: null, em: new Date().toISOString() } },
            }));
            setAviso(`Salvo às ${new Date().toLocaleTimeString("pt-BR")}`);
          })
          .catch(() => setAviso("Falha ao salvar — verifique a conexão."));
      }, 700);
    },
    [mesAtivo, unidade.slug]
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
  const autoriaReal = autoria[chaveMapa(mesAtivo, "real")] || {};
  const metasBrutas = useMemo(() => mapa[chaveMapa(mesAtivo, "meta")] || {}, [mapa, mesAtivo]);
  const metasOverride = useMemo(() => {
    const out: Record<string, number | null> = {};
    for (const [k, v] of Object.entries(metasBrutas)) out[k] = num(v);
    return out;
  }, [metasBrutas]);

  // ---- fechamento do mês ---------------------------------------------------
  // Mês fechado trava a edição de todo mundo, Head incluído: se o Head pudesse
  // editar sem reabrir, o fechamento não garantiria nada. A API recusa de novo
  // do lado dela — isto aqui é só pra não oferecer um campo que não vai gravar.
  const fechamento = fechados[mesAtivo] ?? null;
  const mesTravado = fechamento !== null;
  const podeEditarMeta = permissao.podeEditarMeta && !mesTravado;
  const podeEditarRealGeral = permissao.ehHead && !mesTravado;

  async function alternarFechamento() {
    const fechando = !mesTravado;
    if (
      fechando &&
      !confirm(
        `Fechar ${rotuloMes(mesAtivo)}? Ninguém mais lança neste mês — nem você — até reabrir.`
      )
    ) {
      return;
    }
    const r = await fetch("/api/dashboard/indicadores/fechamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ unidade: unidade.slug, mes: mesAtivo, fechado: fechando }),
    });
    if (!r.ok) {
      setAviso("Não foi possível alterar o fechamento.");
      return;
    }
    const { fechamentos } = (await r.json()) as { fechamentos: FechamentoApi[] };
    setFechados(Object.fromEntries(fechamentos.map((f) => [f.mes, f])));
    setAviso(`${rotuloMes(mesAtivo)} ${fechando ? "fechado" : "reaberto"}.`);
  }

  // ---- chips do período ----------------------------------------------------
  const duPeriodo = diasUteis(dtIni, dtFim);
  const duMes = diasUteisDoMes(dtIni);
  const duRestantes = diasUteisRestantes(dtFim);
  const pctMes = (fatorMes(dtIni, dtFim) * 100).toFixed(0);
  const pctTri = (fatorTrimestre(dtFim) * 100).toFixed(0);
  const pctAno = (fatorAno(dtFim) * 100).toFixed(0);

  // null quando a unidade ainda não tem time cadastrado — o N5 vira aviso.
  const pessoa = PESSOAS.find((p) => p.chave === pessoaSel) ?? PESSOAS[0] ?? null;

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
    if (!pessoa) return [];
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
  }, [PESSOAS, kpiComp, reais, metasOverride, dtIni, dtFim]);

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
        const metasDoMes = mapa[chaveMapa(k, "meta")] || {};
        // Mês fora do cronograma de MRR (jan–jul) entra como zero: não há meta
        // de MRR definida antes de agosto.
        accMeta +=
          (num(metasDoMes["n3_mrr_out"]) ?? CRONOGRAMA[k]?.out ?? 0) +
          (num(metasDoMes["n3_mrr_in"]) ?? CRONOGRAMA[k]?.inb ?? 0);
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
  const planos = useMemo(() => indicadoresPlanos([...N3, ...N4]), [N3, N4]);

  /**
   * Chave de lançamento -> nome legível e formato. O histórico guarda a chave
   * crua ("n4_reun", "sara_ini"), que não diz nada pra quem lê, e sem o formato
   * não dá pra saber se 3000 é R$ 3.000,00 ou 3.000 reuniões.
   */
  const indicePorChave = useMemo(() => {
    const m = new Map<string, { nome: string; fmt: Formato }>();
    for (const l of [...N3, ...N4]) {
      if (!isGrupo(l)) m.set(l.id, { nome: l.nome, fmt: l.fmt });
    }
    for (const p of unidade.pessoas) {
      const quem = p.nome.split(" — ")[0];
      for (const k of p.kpis) {
        m.set(`${p.chave}_${k.id}`, { nome: `${quem} · ${k.nome}`, fmt: k.fmt });
      }
    }
    return m;
  }, [N3, N4, unidade.pessoas]);

  /**
   * Série do ano inteiro de UM indicador, para o gráfico que abre ao clicar no
   * nome dele. A meta de cada mês segue a mesma ordem de precedência do painel:
   * override lançado > cronograma do mês > meta fixa da definição.
   */
  const serieMensal = useCallback(
    (ind: Indicador, chave: string): PontoEvolucao[] =>
      meses.map((k) => {
        const real = num((mapa[chaveMapa(k, "real")] || {})[chave]);
        const override = num((mapa[chaveMapa(k, "meta")] || {})[chave]);
        let meta = override;
        if (meta === null) {
          if (ind.id === "n3_mrr_out") meta = CRONOGRAMA[k]?.out ?? null;
          else if (ind.id === "n3_mrr_in") meta = CRONOGRAMA[k]?.inb ?? null;
          else meta = ind.meta;
        }
        return { rotulo: rotuloMes(k), real, meta, pct: status(real, meta, ind.dir).pct };
      }),
    [mapa, meses]
  );

  const serieEvolucao = useMemo((): PontoEvolucao[] => {
    const def = planos.find((r) => r.id === indEvo);
    if (!def) return [];
    return meses.map((k) => {
      const doMes = mapa[chaveMapa(k, "real")] || {};
      const real = num(doMes[indEvo]);
      let meta = def.meta;
      if (indEvo === "n3_mrr_out") meta = CRONOGRAMA[k]?.out ?? null;
      if (indEvo === "n3_mrr_in") meta = CRONOGRAMA[k]?.inb ?? null;
      const override = num((mapa[chaveMapa(k, "meta")] || {})[indEvo]);
      if (override !== null) meta = override;
      const pct = meta !== null ? status(real, meta, def.dir).pct : null;
      return { rotulo: rotuloMes(k), real, meta, pct };
    });
  }, [indEvo, mapa, meses, planos]);

  // ---- ações ---------------------------------------------------------------
  async function limparMes() {
    if (!confirm(`Limpar os realizados de ${rotuloMes(mesAtivo)}? As metas e os demais meses são mantidos.`)) {
      return;
    }
    const r = await fetch(`/api/dashboard/indicadores?unidade=${unidade.slug}&mes=${mesAtivo}`, { method: "DELETE" });
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
          Indicadores mensais usam o recorte selecionado; <b>Resultado do trimestre</b> é acumulado e
          ponderado pelas metas de cada mês do cronograma (ago–dez/2026), já que as metas crescem mês
          a mês. Taxas (%) e valores unitários não são proporcionalizados.
        </p>
        <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
          A coluna <b>Meta</b> é editável e vale só para o <b>mês de registro</b> selecionado aqui —
          os demais meses seguem intactos. Campo em branco usa a meta padrão do indicador (mostrada
          em cinza dentro do campo); apagar o que você digitou volta pra ela.
        </p>
        <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
          <b>Falta por dia útil</b> é quanto ainda precisa sair por dia para fechar o mês na meta
          cheia — aparece só nos indicadores que acumulam ao longo do mês e em que mais é melhor.
          Taxas, valores unitários, trimestre e ciclo anual mostram travessão, porque nesses casos a
          média diária não existe.
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <Campo label="Mês de registro">
            <Select
              value={mesAtivo}
              onChange={setMesAtivo}
              opcoes={meses.map((m) => ({ valor: m, rotulo: rotuloMes(m) }))}
            />
          </Campo>
          <Campo label="Início">
            <input type="date" value={dtIni} onChange={(e) => setDtIni(e.target.value)} className={inputCls} style={inputStyle} />
          </Campo>
          <Campo label="Fim">
            <input type="date" value={dtFim} onChange={(e) => setDtFim(e.target.value)} className={inputCls} style={inputStyle} />
          </Campo>
          <Chip label="Dias úteis do período" valor={duPeriodo || "—"} />
          <Chip label="Dias úteis do mês" valor={duMes || "—"} />
          <Chip label="Dias úteis restantes" valor={duRestantes} />
          <Chip label="Proporção do mês" valor={`${pctMes}%`} />
          <Chip label="Trimestre decorrido" valor={`${pctTri}%`} />
          <Chip label="Ciclo ARR decorrido" valor={`${pctAno}%`} />
        </div>

        {/* Estado do fechamento. Fica junto do seletor de mês porque é o estado
            DAQUELE mês, não do painel inteiro. */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
          {mesTravado ? (
            <span className="text-sm">
              🔒 <b>{rotuloMes(mesAtivo)} fechado</b>
              <span style={{ color: "var(--text-muted)" }}>
                {fechamento?.fechadoPor ? ` por ${fechamento.fechadoPor}` : ""}
                {fechamento?.fechadoEm ? ` em ${quando(fechamento.fechadoEm)}` : ""} — nenhum
                lançamento é aceito até reabrir.
              </span>
            </span>
          ) : (
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {rotuloMes(mesAtivo)} está <b>aberto</b> para lançamento.
            </span>
          )}
          {permissao.ehHead && (
            <button
              onClick={alternarFechamento}
              className="rounded-md px-3 py-1.5 text-sm font-semibold"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            >
              {mesTravado ? `Reabrir ${rotuloMes(mesAtivo)}` : `Fechar ${rotuloMes(mesAtivo)}`}
            </button>
          )}
        </div>
      </Painel>

      {/* ---------------- N3 ---------------- */}
      {permissao.verN3 && (
      <Painel titulo="Head Comercial" tag="N3" tagCor="var(--accent)" desc="8 indicadores, todos com meta">
        <Tabela
          defs={N3}
          prefixo=""
          reais={reais}
          metasBrutas={metasBrutas}
          metasOverride={metasOverride}
          dtIni={dtIni}
          dtFim={dtFim}
          onChange={setValor}
          podeEditarMeta={podeEditarMeta}
          podeEditarReal={podeEditarRealGeral}
          autoriaReal={autoriaReal}
          serieMensal={serieMensal}
        />
        <Secao titulo="Ranking de atingimento — N3">
          <GraficoRanking dados={ranking(N3, "")} />
        </Secao>
      </Painel>
      )}

      {/* ---------------- N4 ---------------- */}
      <Painel titulo="Supervisão" tag="N4" tagCor="#EC4899" desc="9 indicadores agregados por função">
        <Tabela
          defs={N4}
          prefixo=""
          reais={reais}
          metasBrutas={metasBrutas}
          metasOverride={metasOverride}
          dtIni={dtIni}
          dtFim={dtFim}
          onChange={setValor}
          podeEditarMeta={podeEditarMeta}
          podeEditarReal={podeEditarRealGeral}
          autoriaReal={autoriaReal}
          serieMensal={serieMensal}
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
        desc={
          pessoa
            ? "Selecione a pessoa para lançar e ler os indicadores individuais."
            : `O time de ${unidade.nome} ainda não foi cadastrado.`
        }
      >
        {pessoa == null ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O N5 é nominal: cada linha é a meta e a nota de uma pessoa específica. Como o time desta
            unidade ainda não foi cadastrado, não há o que lançar aqui — mostrar o time de outra
            unidade colocaria meta individual no nome de quem não trabalha nela. Para ligar esta
            seção, informe as pessoas desta unidade e elas entram em <code>UNIDADES</code>, em
            <code className="mx-1">lib/indicadores.ts</code>. O N3 e o N4 acima já funcionam
            normalmente.
          </p>
        ) : (
          <>
            {PESSOAS.length > 1 && (
              <div className="mb-4 max-w-xs">
                <Campo label="Pessoa">
                  <Select
                    value={pessoaSel}
                    onChange={setPessoaSel}
                    opcoes={PESSOAS.map((p) => ({ valor: p.chave, rotulo: p.nome }))}
                  />
                </Campo>
              </div>
            )}
            <Tabela
              defs={[{ grupo: pessoa.nome, cor: "p5" }, ...pessoa.kpis]}
              prefixo={`${pessoa.chave}_`}
              reais={reais}
              metasBrutas={metasBrutas}
              metasOverride={metasOverride}
              dtIni={dtIni}
              dtFim={dtFim}
              onChange={setValor}
              podeEditarMeta={podeEditarMeta}
              podeEditarReal={!mesTravado}
              autoriaReal={autoriaReal}
              serieMensal={serieMensal}
            />
            <Secao titulo="Ranking de atingimento — pessoa selecionada">
              <GraficoRanking dados={rankingPessoa} />
            </Secao>
            {permissao.somentePessoa == null && (
              <Secao
                titulo="Comparativo entre pessoas"
                acao={
                  <Select
                    value={kpiComp}
                    onChange={setKpiComp}
                    opcoes={kpisComparaveis.map((k) => ({ valor: k.id, rotulo: k.nome }))}
                  />
                }
              >
                <GraficoComparativo dados={comparativo} />
              </Secao>
            )}
          </>
        )}
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
            <Select
              value={indEvo}
              onChange={setIndEvo}
              opcoes={planos.map((r) => ({ valor: r.id, rotulo: r.nome }))}
            />
          }
        >
          <GraficoEvolucao serie={serieEvolucao} />
        </Secao>
      </Painel>

      {/* ---------------- histórico ---------------- */}
      <Painel
        titulo="Últimas alterações"
        desc="Toda vez que um número muda, fica registrado aqui — inclusive quando é apagado."
      >
        <Historico
          itens={historico}
          indicePorChave={indicePorChave}
          onAtualizar={() => {
            carregar().then(() => setAviso("Histórico atualizado."));
          }}
        />
      </Painel>

      {/* ---------------- dados ---------------- */}
      <Painel titulo="Dados">
        <div className="flex flex-wrap items-center gap-3">
          {permissao.podeExportar && (
            <button onClick={exportar} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
              Exportar JSON
            </button>
          )}
          {permissao.podeLimparMes && !mesTravado && (
            <button onClick={limparMes} className="rounded-md px-4 py-2 text-sm font-semibold" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
              Limpar realizados do mês
            </button>
          )}
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

// Os <select> levam fundo sólido (não transparente) porque a lista aberta é
// desenhada pelo sistema operacional, fora do fluxo do painel: sem cor própria
// ela herda branco e o texto claro do tema escuro some. O color-scheme do
// globals.css já resolve isso na maioria dos navegadores — isto é a garantia.
const selectStyle = {
  borderColor: "var(--border)",
  color: "var(--text)",
  background: "var(--surface)",
} as const;

const optionStyle = { background: "var(--surface)", color: "var(--text)" } as const;

/** <select> com as cores do tema aplicadas também nas opções. */
function Select({
  value,
  onChange,
  opcoes,
}: {
  value: string;
  onChange: (v: string) => void;
  opcoes: { valor: string; rotulo: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} style={selectStyle}>
      {opcoes.map((o) => (
        <option key={o.valor} value={o.valor} style={optionStyle}>
          {o.rotulo}
        </option>
      ))}
    </select>
  );
}

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
// Histórico de alterações
// ===========================================================================

const ACAO_ROTULO: Record<string, string> = {
  gravou: "",
  apagou: "campo apagado",
  limpou_mes: "limpeza do mês inteiro",
};

/**
 * Lista das últimas alterações da unidade. Vem pronta da API, já filtrada pela
 * permissão — o colaborador só recebe as próprias linhas, então aqui não há o
 * que esconder.
 */
function Historico({
  itens,
  indicePorChave,
  onAtualizar,
}: {
  itens: HistoricoApi[];
  indicePorChave: Map<string, { nome: string; fmt: Formato }>;
  onAtualizar: () => void;
}) {
  // A lista chega no carregamento da página, então o que você acabou de digitar
  // só aparece depois de atualizar — daí o botão, em vez de deixar a lista
  // silenciosamente velha.
  const [verTudo, setVerTudo] = useState(false);
  const visiveis = verTudo ? itens : itens.slice(0, 12);

  if (itens.length === 0) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Nenhuma alteração registrada ainda. O histórico começou a ser gravado em 16/10/2026 — os
          lançamentos anteriores a essa data não têm rastro.
        </p>
        <button
          onClick={onAtualizar}
          className="rounded-md px-3 py-1.5 text-sm font-semibold"
          style={{ border: "1px solid var(--border)", color: "var(--text)" }}
        >
          Atualizar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-end gap-3">
        <button
          onClick={onAtualizar}
          className="rounded-md px-3 py-1.5 text-sm font-semibold"
          style={{ border: "1px solid var(--border)", color: "var(--text)" }}
        >
          Atualizar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {["Quando", "Quem", "Indicador", "De → para"].map((h, i) => (
                <th
                  key={h}
                  className={`whitespace-nowrap border-b-2 px-2 py-2 text-[10px] font-extrabold uppercase tracking-wide ${
                    i === 3 ? "text-right" : "text-left"
                  }`}
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visiveis.map((h, i) => {
              const def = indicePorChave.get(h.chave);
              const formato = def?.fmt ?? "num";
              const extra = ACAO_ROTULO[h.acao] ?? h.acao;
              return (
                <tr key={`${h.alteradoEm}-${h.chave}-${i}`} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="whitespace-nowrap px-2 py-2 tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {quando(h.alteradoEm)}
                  </td>
                  <td className="px-2 py-2">{h.alteradoPor ?? "—"}</td>
                  <td className="px-2 py-2">
                    {/* Chave sem definição acontece quando um indicador sai do
                        painel: o lançamento antigo continua no histórico, e
                        mostrar a chave crua é melhor que sumir com a linha. */}
                    <span className="font-semibold">{def?.nome ?? h.chave}</span>
                    <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {h.tipo === "real" ? "realizado" : "meta"} · {rotuloMes(h.mes)}
                      {extra ? ` · ${extra}` : ""}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-right tabular-nums">
                    <span style={{ color: "var(--text-muted)" }}>{fmt(num(h.valorAntigo), formato)}</span>
                    <span className="mx-1.5" aria-hidden="true">
                      →
                    </span>
                    <b>{fmt(num(h.valorNovo), formato)}</b>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {itens.length > 12 && (
        <button
          onClick={() => setVerTudo((v) => !v)}
          className="mt-3 text-sm font-semibold hover:underline"
          style={{ color: "var(--accent)" }}
        >
          {verTudo ? "Mostrar menos" : `Ver todas as ${itens.length} alterações`}
        </button>
      )}
    </div>
  );
}

// ===========================================================================
// Tabela de indicadores
// ===========================================================================

/**
 * Campo numérico com a unidade do indicador ao lado. O símbolo fica fora do
 * <input type="number"> de propósito: dentro dele o navegador só aceita número
 * puro, e misturar máscara com digitação quebra o parse do valor.
 */
function CampoValor({
  formato,
  valor,
  placeholder,
  title,
  forte,
  onChange,
}: {
  formato: Formato;
  valor: string;
  placeholder?: string;
  title?: string;
  forte?: boolean;
  onChange: (valorCanonico: string) => void;
}) {
  // Enquanto o campo está sendo digitado ele mostra o rascunho cru; ao sair,
  // volta a exibir o valor gravado já formatado. Sem isso, reformatar a cada
  // tecla embaralharia o cursor no meio do número.
  const [rascunho, setRascunho] = useState<string | null>(null);
  const sufixo = formato === "pct" ? "%" : formato === "x" ? "x" : null;
  const formatado = fmtNumero(num(valor), formato);

  return (
    <div className="flex items-center justify-end gap-1">
      {formato === "brl" && (
        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          R$
        </span>
      )}
      <input
        type="text"
        inputMode="decimal"
        value={rascunho ?? formatado}
        placeholder={placeholder}
        title={title}
        onFocus={() => setRascunho(formatado)}
        onChange={(e) => {
          setRascunho(e.target.value);
          const canonico = parseNumeroBr(e.target.value);
          if (canonico !== null) onChange(canonico);
        }}
        onBlur={() => setRascunho(null)}
        className={`w-24 rounded-md border bg-transparent px-2 py-1 text-right text-sm outline-none${
          forte ? " font-bold" : ""
        }`}
        style={inputStyle}
      />
      {sufixo && (
        <span className="w-3 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          {sufixo}
        </span>
      )}
    </div>
  );
}

function Tabela({
  defs,
  prefixo,
  reais,
  metasBrutas,
  metasOverride,
  dtIni,
  dtFim,
  onChange,
  podeEditarMeta,
  podeEditarReal,
  autoriaReal,
  serieMensal,
}: {
  defs: LinhaTabela[];
  prefixo: string;
  reais: Record<string, string>;
  metasBrutas: Record<string, string>;
  metasOverride: Record<string, number | null>;
  dtIni: string;
  dtFim: string;
  onChange: (tipo: "real" | "meta", chave: string, valor: string) => void;
  podeEditarMeta: boolean;
  podeEditarReal: boolean;
  autoriaReal: Record<string, { por: string | null; em: string | null }>;
  serieMensal: (ind: Indicador, chave: string) => PontoEvolucao[];
}) {
  // Qual indicador está com o gráfico do ano aberto. Um por vez: abrir vários
  // empurraria a tabela pra longe e o comparativo se perderia.
  const [aberto, setAberto] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {["Indicador", "Meta", "Meta proporcional", "Realizado", "Falta por dia útil", "Atingimento"].map((h, i) => (
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
                    colSpan={6}
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
            const ritmo = ritmoNecessario(ind, base, real, dtFim);
            const quem = autoriaReal[chave];

            const expandido = aberto === chave;

            return (
              <Fragment key={chave}>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => setAberto(expandido ? null : chave)}
                    aria-expanded={expandido}
                    className="text-left"
                    title="Ver a evolução deste indicador no ano"
                  >
                    <span className="font-semibold hover:underline">
                      {ind.nome}
                      <span className="ml-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {expandido ? "▲" : "▼"}
                      </span>
                    </span>
                  </button>
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
                  ) : podeEditarMeta ? (
                    <CampoValor
                      formato={ind.fmt}
                      valor={metasBrutas[chave] ?? ""}
                      placeholder={fmtNumero(metaDinamica(ind, dtIni, dtFim) ?? ind.meta, ind.fmt)}
                      title={`Meta de ${ind.nome} só para o mês selecionado. Em branco usa a meta padrão (${fmt(
                        metaDinamica(ind, dtIni, dtFim) ?? ind.meta,
                        ind.fmt
                      )}).`}
                      forte
                      onChange={(v) => onChange("meta", chave, v)}
                    />
                  ) : (
                    // Quem não é Head lê a meta, não digita.
                    <span className="font-bold">
                      {fmt(num(metasBrutas[chave] ?? "") ?? metaDinamica(ind, dtIni, dtFim) ?? ind.meta, ind.fmt)}
                    </span>
                  )}
                </td>
                <td className="px-2 py-2 text-right font-extrabold tabular-nums" style={{ color: "var(--accent)" }}>
                  {proporcional === null ? "—" : fmt(proporcional, ind.fmt)}
                </td>
                <td className="px-2 py-2 text-right">
                  {podeEditarReal ? (
                    <CampoValor
                      formato={ind.fmt}
                      valor={reais[chave] ?? ""}
                      onChange={(v) => onChange("real", chave, v)}
                    />
                  ) : (
                    <span className="tabular-nums">{fmt(num(reais[chave] ?? ""), ind.fmt)}</span>
                  )}
                  {/* Autoria do último lançamento. Sem isto, um número
                      sobrescrito não deixa pista de quem mexeu — e o histórico
                      completo fica no banco, não na tela. */}
                  {quem?.em && (
                    <span className="mt-0.5 block text-[10px] leading-tight" style={{ color: "var(--text-muted)" }}>
                      {quem.por ? `${quem.por} · ` : ""}
                      {quando(quem.em)}
                    </span>
                  )}
                </td>
                {/* Ritmo necessário: só para indicador que acumula no mês e em
                    que mais é melhor. Nos demais a conta não existe, e inventar
                    um número aqui seria pior que deixar vazio. */}
                <td className="whitespace-nowrap px-2 py-2 text-right tabular-nums">
                  {ritmo === null ? (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  ) : ritmo.falta === 0 ? (
                    <span style={{ color: CORES.ok }} title="Meta cheia do mês já alcançada">
                      no alvo
                    </span>
                  ) : ritmo.porDia === null ? (
                    <span style={{ color: CORES.bad }} title="Não há mais dia útil neste mês">
                      {fmt(ritmo.falta, ind.fmt)} / sem dia
                    </span>
                  ) : (
                    <span title={`Faltam ${fmt(ritmo.falta, ind.fmt)} para a meta cheia, em ${ritmo.diasRestantes} dia(s) útil(eis)`}>
                      {fmt(ritmo.porDia, ind.fmt)}
                      <span className="ml-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        /dia
                      </span>
                    </span>
                  )}
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
              {expandido && (
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td colSpan={6} className="px-2 pb-4 pt-1">
                    <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                      {ind.nome} — mês a mês
                    </p>
                    <GraficoLinhaMensal serie={serieMensal(ind, chave)} />
                  </td>
                </tr>
              )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
