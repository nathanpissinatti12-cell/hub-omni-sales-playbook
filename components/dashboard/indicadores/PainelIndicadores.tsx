"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ANOS_PAINEL,
  anoPainelPadrao,
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
import { gerarXlsx, type Aba, type Celula } from "@/lib/planilhaXlsx";
import {
  CORES,
  corAreaDe,
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
  projecaoFechamento,
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

/**
 * Estado de gravação de um campo. "pendente" é o intervalo entre a última tecla
 * e o envio; os outros três são o resultado. Fica por campo, e não só na
 * mensagem geral no rodapé, porque quem digita no meio da tabela não enxerga o
 * rodapé.
 */
type EstadoCampo = "pendente" | "salvando" | "salvo" | "erro";

/**
 * Cores dos níveis N4 e N5. São tons escurecidos do rosa e do azul que vinham
 * da identidade antiga: no tema Platinum, texto branco sobre #EC4899 dava
 * contraste 3,5 e sobre #0EA5E9 dava 2,8 — abaixo do mínimo de 4,5 para texto
 * pequeno, que é o tamanho da etiqueta e do cabeçalho de grupo. Estes dão 6,1 e
 * 5,9. O N3 continua no roxo da marca, que já estava correto.
 */
const COR_N4 = "#BE185D";
const COR_N5 = "#0369A1";

function chaveMapa(mes: string, tipo: string) {
  return `${mes}|${tipo}`;
}

/**
 * Mantém uma data dentro de [ini, fim]. Datas ISO comparam como texto, então
 * basta o operador — nada de Date aqui, que só traria fuso horário pro meio.
 */
function dentroDe(valor: string, ini: string, fim: string): string {
  if (!valor) return ini;
  if (valor < ini) return ini;
  if (valor > fim) return fim;
  return valor;
}

/** Mês que o painel abre dentro de um ciclo: o corrente, se for daquele ciclo. */
function mesPadraoDoCiclo(meses: string[]): string {
  const hoje = new Date();
  const atual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  return meses.includes(atual) ? atual : meses[0];
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
  // Ciclo (ano) e os 12 meses dele. O ano não é fixo no código: virado o ano, o
  // painel precisa abrir no ciclo novo em vez de voltar pra janeiro do anterior.
  const [ano, setAno] = useState(() => anoPainelPadrao());
  const meses = useMemo(() => mesesCiclo(ano), [ano]);
  // Abre no mês corrente, não em janeiro: com os 12 meses na lista, começar pelo
  // primeiro faria o painel abrir sempre num mês vazio.
  const [mesAtivo, setMesAtivo] = useState(() => mesPadraoDoCiclo(mesesCiclo(anoPainelPadrao())));

  // Trocar de ciclo precisa levar o mês junto: sem isto, mesAtivo continuaria
  // num mês do ano anterior e a tela mostraria dado de um ciclo com o seletor
  // apontando para outro.
  useEffect(() => {
    if (!meses.includes(mesAtivo)) setMesAtivo(mesPadraoDoCiclo(meses));
  }, [meses, mesAtivo]);
  const [dtIni, setDtIni] = useState("");
  const [dtFim, setDtFim] = useState("");
  const [mapa, setMapa] = useState<Mapa>({});
  const [fechados, setFechados] = useState<Record<string, FechamentoApi>>({});
  const [pessoaSel, setPessoaSel] = useState(PESSOAS[0]?.chave ?? "");
  const [kpiComp, setKpiComp] = useState("ini");
  const [indEvo, setIndEvo] = useState("n3_mrr_out");
  const [historico, setHistorico] = useState<HistoricoApi[]>([]);
  // Só a DATA de cada lançamento, sem o autor: a linha com autoria embaixo do
  // realizado saiu a pedido (5d294b2) por poluir a célula mais lida. Aqui o uso
  // é outro — dizer se o painel está servindo número de hoje ou da semana
  // passada — e aparece agregado no resumo, não na célula.
  const [edicoes, setEdicoes] = useState<Record<string, Record<string, string>>>({});
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState("");

  // ---- carga ---------------------------------------------------------------
  // Uma função só, usada na abertura e no botão "Atualizar" do histórico: a
  // mesma chamada traz lançamentos, fechamentos e histórico.
  // Devolve o mapa que acabou de ler, além de jogar no estado: a exportação
  // precisa do dado na mão, e `setMapa` só reflete no próximo render.
  const carregar = useCallback(async (): Promise<Mapa | null> => {
    try {
      const r = await fetch(`/api/dashboard/indicadores?unidade=${unidade.slug}`);
      const resp: RespostaApi = r.ok ? await r.json() : { valores: [], fechamentos: [], historico: [] };
      const m: Mapa = {};
      const ed: Record<string, Record<string, string>> = {};
      for (const row of resp.valores ?? []) {
        const k = chaveMapa(row.mes, row.tipo);
        m[k] = m[k] || {};
        m[k][row.chave] = row.valor ?? "";
        if (row.editadoEm) {
          ed[k] = ed[k] || {};
          ed[k][row.chave] = row.editadoEm;
        }
      }
      setMapa(m);
      setEdicoes(ed);
      setFechados(Object.fromEntries((resp.fechamentos ?? []).map((f) => [f.mes, f])));
      setHistorico(resp.historico ?? []);
      return m;
    } catch {
      setAviso("Não foi possível carregar os lançamentos.");
      return null;
    }
  }, [unidade.slug]);

  useEffect(() => {
    carregar().finally(() => setCarregando(false));
  }, [carregar]);

  // Primeiro e último dia do mês de registro. O período NUNCA sai daqui: a meta
  // de MRR é escolhida pelo mês da data de início, então um período apontando
  // para outro mês faria a tabela mostrar a meta de agosto ao lado do realizado
  // de outubro — número errado com cara de certo.
  const limitesDoMes = useMemo(() => {
    const [ano, mes] = mesAtivo.split("-").map(Number);
    return { ini: iso(new Date(ano, mes - 1, 1)), fim: iso(new Date(ano, mes, 0)) };
  }, [mesAtivo]);

  // Período default: do primeiro dia do mês ativo até hoje (ou fim do mês).
  useEffect(() => {
    const hoje = iso(new Date());
    setDtIni(limitesDoMes.ini);
    setDtFim(hoje > limitesDoMes.fim ? limitesDoMes.fim : hoje < limitesDoMes.ini ? limitesDoMes.fim : hoje);
  }, [limitesDoMes]);

  function mudarInicio(valor: string) {
    const novo = dentroDe(valor, limitesDoMes.ini, limitesDoMes.fim);
    setDtIni(novo);
    // Fim antes do início zerava a meta proporcional e apagava o atingimento da
    // tela inteira, sem dizer por quê.
    if (dtFim < novo) setDtFim(novo);
  }

  function mudarFim(valor: string) {
    const novo = dentroDe(valor, limitesDoMes.ini, limitesDoMes.fim);
    setDtFim(novo < dtIni ? dtIni : novo);
  }

  // ---- gravação -----------------------------------------------------------
  // Grava depois de uma pausa na digitação, para não mandar uma requisição por
  // tecla. O que ainda não foi enviado fica em `pendentes`, e é isso que
  // permite descarregar na hora quando o campo perde o foco ou o mês troca —
  // sem isso, digitar e sair rápido perdia o último valor em silêncio.
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pendentes = useRef<Record<string, { mes: string; tipo: "real" | "meta"; chave: string; valor: string }>>({});
  const [estados, setEstados] = useState<Record<string, EstadoCampo>>({});

  const enviar = useCallback(
    (id: string): Promise<void> => {
      const p = pendentes.current[id];
      if (!p) return Promise.resolve();
      delete pendentes.current[id];
      clearTimeout(timers.current[id]);
      setEstados((prev) => ({ ...prev, [id]: "salvando" }));

      return fetch("/api/dashboard/indicadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unidade: unidade.slug,
          mes: p.mes,
          tipo: p.tipo,
          chave: p.chave,
          valor: p.valor === "" ? null : p.valor,
        }),
      })
        .then((r) => {
          // 409 = mês fechado. A tela já esconde os campos nesse caso, então
          // isto só acontece se o mês for fechado em outra aba enquanto esta
          // está aberta — e aí a mensagem precisa dizer o motivo real.
          if (r.status === 409) {
            setEstados((prev) => ({ ...prev, [id]: "erro" }));
            setAviso("Mês fechado — este lançamento não foi salvo. Recarregue a página.");
            return;
          }
          if (!r.ok) throw new Error();
          setEstados((prev) => ({ ...prev, [id]: "salvo" }));
          // Sem isto o resumo continuaria dizendo "dado de 3 dias atrás" logo
          // depois de alguém lançar, até a próxima carga.
          const k = chaveMapa(p.mes, p.tipo);
          setEdicoes((prev) => ({
            ...prev,
            [k]: { ...(prev[k] || {}), [p.chave]: new Date().toISOString() },
          }));
          setAviso(`Salvo às ${new Date().toLocaleTimeString("pt-BR")}`);
        })
        .catch(() => {
          setEstados((prev) => ({ ...prev, [id]: "erro" }));
          setAviso("Falha ao salvar — verifique a conexão.");
        });
    },
    [unidade.slug]
  );

  const setValor = useCallback(
    (tipo: "real" | "meta", chave: string, valor: string) => {
      const k = chaveMapa(mesAtivo, tipo);
      setMapa((prev) => ({ ...prev, [k]: { ...(prev[k] || {}), [chave]: valor } }));

      const id = `${mesAtivo}|${tipo}|${chave}`;
      pendentes.current[id] = { mes: mesAtivo, tipo, chave, valor };
      setEstados((prev) => ({ ...prev, [id]: "pendente" }));
      clearTimeout(timers.current[id]);
      timers.current[id] = setTimeout(() => enviar(id), 700);
    },
    [mesAtivo, enviar]
  );

  /** Espera sair tudo que ainda não foi gravado — antes de exportar, por exemplo. */
  const descarregarPendentes = useCallback(
    () => Promise.all(Object.keys(pendentes.current).map((id) => enviar(id))).then(() => undefined),
    [enviar]
  );

  /** Descarrega o que estiver pendente de um campo — usado quando ele perde o foco. */
  const gravarAgora = useCallback(
    (tipo: "real" | "meta", chave: string) => enviar(`${mesAtivo}|${tipo}|${chave}`),
    [mesAtivo, enviar]
  );

  // Trocar de mês (ou sair da página) não pode deixar lançamento pendente para
  // trás: a tabela já estaria mostrando outro mês e o valor sumiria sem aviso.
  useEffect(() => {
    return () => {
      void descarregarPendentes();
    };
  }, [mesAtivo, descarregarPendentes]);

  const estadoDe = useCallback(
    (tipo: "real" | "meta", chave: string): EstadoCampo | undefined =>
      estados[`${mesAtivo}|${tipo}|${chave}`],
    [estados, mesAtivo]
  );

  const reais = mapa[chaveMapa(mesAtivo, "real")] || {};
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
  // Null = o ano ainda não tem cronograma, então não há ciclo de ARR para medir.
  const fAno = fatorAno(dtFim);
  const pctAno = fAno === null ? null : (fAno * 100).toFixed(0);

  /**
   * Há quantos dias úteis entrou o lançamento mais recente do mês. É a medida de
   * frescor que importa: o painel pode parecer saudável servindo número parado,
   * e as colunas de ritmo e projeção assumem que o realizado é de hoje.
   *
   * Null em mês que não é o corrente — ali a pergunta não faz sentido.
   */
  const frescor = useMemo(() => {
    if (mesAtivo !== iso(new Date()).slice(0, 7)) return null;
    const datas = Object.values(edicoes[chaveMapa(mesAtivo, "real")] || {});
    if (datas.length === 0) return null;
    const maisRecente = datas.reduce((x, y) => (x > y ? x : y));
    const dia = maisRecente.slice(0, 10);
    // diasUteis conta as duas pontas; aqui o que vale é o intervalo.
    const atraso = Math.max(diasUteis(dia, iso(new Date())) - 1, 0);
    return { dia, atraso };
  }, [mesAtivo, edicoes]);

  // ---- resumo do topo ------------------------------------------------------
  /**
   * Os números que respondem "estamos no caminho?" sem rolar a página. Saem dos
   * mesmos indicadores da tabela, respeitando a permissão: quem não vê N3 não
   * recebe o cartão de MRR, e o colaborador só conta as próprias linhas.
   */
  const resumo = useMemo(() => {
    const visiveis: { ind: Indicador; chave: string }[] = [];
    if (permissao.verN3) {
      for (const l of N3) if (!isGrupo(l)) visiveis.push({ ind: l, chave: l.id });
    }
    if (permissao.verN4) {
      for (const l of N4) if (!isGrupo(l)) visiveis.push({ ind: l, chave: l.id });
    }
    for (const p of PESSOAS) {
      for (const ind of p.kpis) visiveis.push({ ind, chave: `${p.chave}_${ind.id}` });
    }

    let foraDaMeta = 0;
    let comMeta = 0;
    let semLancamento = 0;
    for (const { ind, chave } of visiveis) {
      if (ind.meta === null) continue;
      const { base, proporcional } = resolveMeta(ind, chave, metasOverride, dtIni, dtFim);
      if (base === null) continue; // mês sem cronograma: não há o que cobrar
      comMeta++;
      const real = num(reais[chave]);
      if (real === null) {
        semLancamento++;
        continue;
      }
      const pct = status(real, proporcional, ind.dir).pct;
      if (pct !== null && pct < 85) foraDaMeta++;
    }

    /** Cartão de um indicador: realizado, meta proporcional e projeção. */
    const cartao = (chave: string, rotulo: string) => {
      const linha = visiveis.find((v) => v.chave === chave);
      if (!linha) return null;
      const { base, proporcional } = resolveMeta(linha.ind, chave, metasOverride, dtIni, dtFim);
      const real = num(reais[chave]);
      return {
        rotulo,
        fmt: linha.ind.fmt,
        real,
        proporcional,
        pct: status(real, proporcional, linha.ind.dir).pct,
        projecao: projecaoFechamento(linha.ind, real, dtIni, dtFim),
        base,
      };
    };

    // MRR do mês é a soma de outbound e inbound — os dois cartões separados
    // ocupariam metade da faixa dizendo quase a mesma coisa.
    let mrr: ReturnType<typeof cartao> = null;
    if (permissao.verN3) {
      const out = cartao("n3_mrr_out", "");
      const inb = cartao("n3_mrr_in", "");
      const soma = (a: number | null, b: number | null) =>
        a === null && b === null ? null : (a ?? 0) + (b ?? 0);
      if (out && inb) {
        const real = soma(out.real, inb.real);
        const proporcional = soma(out.proporcional, inb.proporcional);
        mrr = {
          rotulo: "MRR novo do mês",
          fmt: "brl",
          real,
          proporcional,
          pct: status(real, proporcional, "up").pct,
          projecao: soma(out.projecao, inb.projecao),
          base: soma(out.base, inb.base),
        };
      }
    }

    // Reuniões e SAL são agregados do N4: quem não vê o nível não vê o cartão.
    // Para o n5 a faixa fica só com o contador, que é o que vale para ele — o
    // "x de y abaixo de 85%" conta as linhas dele.
    const doN4 = permissao.verN4
      ? [cartao("n4_reun", "Reuniões agendadas"), cartao("n4_sql", "SAL")]
      : [];

    return {
      cartoes: [mrr, ...doN4].filter(
        (c): c is NonNullable<typeof c> => c !== null
      ),
      foraDaMeta,
      comMeta,
      semLancamento,
    };
  }, [N3, N4, PESSOAS, permissao.verN3, permissao.verN4, reais, metasOverride, dtIni, dtFim]);

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
  // Só os níveis que a pessoa enxerga. Sem o filtro, o seletor de evolução
  // listaria indicador de N3/N4 para quem não vê aquele nível — e o gráfico
  // sairia vazio, porque a API nem manda esses lançamentos.
  const planos = useMemo(
    () =>
      indicadoresPlanos([
        ...(permissao.verN3 ? N3 : []),
        ...(permissao.verN4 ? N4 : []),
      ]),
    [N3, N4, permissao.verN3, permissao.verN4]
  );

  // O padrão é um indicador do N3; quem não vê o N3 precisa cair no primeiro
  // indicador que enxerga, senão o seletor abre num item que não está na lista.
  useEffect(() => {
    if (planos.length > 0 && !planos.some((r) => r.id === indEvo)) setIndEvo(planos[0].id);
  }, [planos, indEvo]);

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
  // Guardada de propósito: o botão saiu da tela a pedido, a função não. Religar
  // é um botão chamando ela, com as guardas `podeLimparMes` e mês não travado.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  /**
   * Planilha do ciclo: um .xlsx com uma aba por mês, jan a dez. O Excel mostra
   * as abas na barra de baixo, que é como se compara mês com mês sem filtrar
   * nada — era o que faltava no CSV, que por formato só tem uma folha.
   *
   * Os números vão como número, não como texto: quem formata com R$ ou vírgula
   * é o Excel, conforme o idioma de quem abre.
   *
   * A meta exportada é a CHEIA do mês, não a proporcional: numa planilha de 12
   * meses, metas que mudam conforme o dia da consulta não se comparam entre si.
   */
  // Guardada de propósito, como `limparMes`: religar é um botão chamando ela,
  // atrás de `permissao.podeExportar`.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function exportar() {
    // Duas coisas antes de montar o arquivo: mandar o que ainda está pendente de
    // gravação (senão a releitura abaixo apagaria da tela o que foi digitado
    // agora) e reler o banco (senão a planilha sai sem o que outra pessoa
    // lançou depois que esta página abriu).
    setAviso("Montando a planilha…");
    await descarregarPendentes();
    const relido = await carregar();
    const fonte = relido ?? mapa;
    if (!relido) {
      setAviso("Não consegui atualizar antes de exportar — a planilha saiu com o que estava na tela.");
    }

    const UNIDADE_ROTULO: Record<Formato, string> = { brl: "R$", pct: "%", x: "x", num: "nº" };
    const CABECALHO: Celula[] = [
      "Nível",
      "Pessoa",
      "Indicador",
      "Unidade do valor",
      "Meta cheia do mês",
      "Realizado",
      "Atingimento %",
    ];

    const abas: Aba[] = meses.map((mes) => {
      const reaisDoMes = fonte[chaveMapa(mes, "real")] || {};
      const metasDoMes = fonte[chaveMapa(mes, "meta")] || {};
      const overridesDoMes: Record<string, number | null> = {};
      for (const [k, v] of Object.entries(metasDoMes)) overridesDoMes[k] = num(v);

      // Mês inteiro como janela: a exportação não é "até hoje", é o fechamento
      // de cada mês.
      const [a, m] = mes.split("-").map(Number);
      const ini = iso(new Date(a, m - 1, 1));
      const fim = iso(new Date(a, m, 0));

      const linhas: Celula[][] = [CABECALHO];

      const linha = (ind: Indicador, chave: string, nivel: string, pessoa: string) => {
        const { base } = resolveMeta(ind, chave, overridesDoMes, ini, fim);
        const real = num(reaisDoMes[chave]);
        if (base === null && real === null) return; // nada a dizer sobre este mês
        const pct = status(real, base, ind.dir).pct;
        linhas.push([
          nivel,
          pessoa,
          ind.nome,
          UNIDADE_ROTULO[ind.fmt],
          base,
          real,
          pct === null ? null : Math.round(pct),
        ]);
      };

      for (const l of N3) if (!isGrupo(l)) linha(l, l.id, "N3", "");
      for (const l of N4) if (!isGrupo(l)) linha(l, l.id, "N4", "");
      for (const p of PESSOAS) {
        for (const ind of p.kpis) linha(ind, `${p.chave}_${ind.id}`, "N5", p.nome.split(" — ")[0]);
      }

      return { nome: rotuloMes(mes), linhas };
    });

    const blob = new Blob([gerarXlsx(abas)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `onvox_indicadores_${unidade.slug}_${ano}.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
    if (relido) setAviso(`Planilha de ${ano} exportada às ${new Date().toLocaleTimeString("pt-BR")}.`);
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
      {/* ---------------- resumo ----------------
          Primeiro bloco da página de propósito: antes disto, quem abria o painel
          via a configuração do período antes de ver qualquer número. */}
      <Resumo
        resumo={resumo}
        mes={rotuloMes(mesAtivo)}
        diasRestantes={duRestantes}
        fechado={mesTravado}
        frescor={frescor}
      />

      {/* ---------------- período ---------------- */}
      <Painel titulo="Período de apuração">
        <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
          A meta comparada é sempre a proporcional aos dias úteis decorridos — nunca a meta cheia.
          Indicadores mensais usam o recorte selecionado; <b>Resultado do trimestre</b> é acumulado e
          ponderado pelas metas de cada mês do cronograma do ciclo, já que as metas crescem mês a
          mês. Taxas (%) e valores unitários não são proporcionalizados.
        </p>
        <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
          O recorte de <b>Início</b> e <b>Fim</b> fica sempre dentro do mês de registro: fora dele, a
          meta do cronograma seria a de outro mês e a comparação não valeria nada.
        </p>
        <p className="mb-4 text-sm" style={{ color: "var(--text-muted)" }}>
          Mês sem cronograma de MRR definido aparece como <b>sem meta</b> nos indicadores de MRR e no
          resultado do trimestre — os demais funcionam normalmente, porque não dependem do
          cronograma. É o caso de todo mês anterior a agosto/2026 e de um ciclo novo enquanto as
          metas não forem definidas.
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
          <Campo label="Ciclo">
            <Select
              value={String(ano)}
              onChange={(v) => setAno(Number(v))}
              opcoes={ANOS_PAINEL.map((a) => ({ valor: String(a), rotulo: String(a) }))}
            />
          </Campo>
          <Campo label="Mês de registro">
            <Select
              value={mesAtivo}
              onChange={setMesAtivo}
              opcoes={meses.map((m) => ({ valor: m, rotulo: rotuloMes(m) }))}
            />
          </Campo>
          <Campo label="Início">
            <input
              type="date"
              value={dtIni}
              min={limitesDoMes.ini}
              max={limitesDoMes.fim}
              onChange={(e) => mudarInicio(e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </Campo>
          <Campo label="Fim">
            <input
              type="date"
              value={dtFim}
              min={dtIni || limitesDoMes.ini}
              max={limitesDoMes.fim}
              onChange={(e) => mudarFim(e.target.value)}
              className={inputCls}
              style={inputStyle}
            />
          </Campo>
          <Chip label="Dias úteis do período" valor={duPeriodo || "—"} />
          <Chip label="Dias úteis do mês" valor={duMes || "—"} />
          <Chip label="Dias úteis restantes" valor={duRestantes} />
          <Chip label="Proporção do mês" valor={`${pctMes}%`} />
          <Chip label="Trimestre decorrido" valor={`${pctTri}%`} />
          <Chip label="Ciclo ARR decorrido" valor={pctAno === null ? "—" : `${pctAno}%`} />
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
          estadoDe={estadoDe}
          onSairDoCampo={gravarAgora}
          duPeriodo={duPeriodo}
          serieMensal={serieMensal}
        />
      </Painel>
      )}

      {/* ---------------- N4 ---------------- */}
      {permissao.verN4 && (
      <Painel titulo="Supervisão" tag="N4" tagCor={COR_N4} desc="9 indicadores agregados por função">
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
          estadoDe={estadoDe}
          onSairDoCampo={gravarAgora}
          duPeriodo={duPeriodo}
          serieMensal={serieMensal}
        />
        <Secao titulo="Ranking de atingimento — N4">
          <GraficoRanking dados={ranking(N4, "")} />
        </Secao>
      </Painel>
      )}

      {/* ---------------- N5 ---------------- */}
      <Painel
        titulo="Operação individual"
        tag="N5"
        tagCor={COR_N5}
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
              estadoDe={estadoDe}
              onSairDoCampo={gravarAgora}
              duPeriodo={duPeriodo}
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

      {/* ---------------- evolução ----------------
          Os dois burn-ups são do MRR, que é N3: para quem não vê o N3 eles
          sairiam como "lance o MRR" — pedindo um lançamento que a pessoa não
          pode fazer. E sem nenhum indicador de N3/N4 visível (o caso do n5) o
          painel inteiro não tem o que mostrar: a evolução da linha individual
          abre clicando no nome do indicador, na tabela do N5. */}
      {(permissao.verN3 || planos.length > 0) && (
      <Painel
        titulo="Evolução e ritmo"
        desc={
          permissao.verN3
            ? "Curvas acumuladas do cronograma do ciclo, alimentadas pelo histórico de cada mês registrado."
            : "Histórico mês a mês dos indicadores que você acompanha."
        }
      >
        {permissao.verN3 && (
          <>
            <Secao titulo="Burn-up do trimestre" primeira>
              <GraficoBurnup
                serie={serieBurnup(mesesTrimestre)}
                vazioMsg="Lance o MRR novo (outbound e inbound) para desenhar a curva."
              />
            </Secao>
            <Secao titulo={`Burn-up do ARR — ciclo ${ano}`}>
              <GraficoBurnup
                serie={serieBurnup(meses)}
                vazioMsg="Lance o MRR novo (outbound e inbound) para desenhar a curva."
              />
            </Secao>
          </>
        )}
        {planos.length > 0 && (
          <Secao
            titulo="Evolução mensal"
            primeira={!permissao.verN3}
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
        )}
      </Painel>
      )}

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
      {/* Os dois botões saíram a pedido: "Exportar planilha (Excel)" e "Limpar
          realizados do mês". As funções `exportar` e `limparMes` continuam
          inteiras logo acima — religar é um botão chamando cada uma, com as
          guardas de permissão que estavam aqui (`podeExportar`, `podeLimparMes`
          e mês não travado).

          Vale dizer o que a remoção de "Limpar realizados" evita: era a única
          ação da tela que apaga lançamento em lote. Sem botão, não há como
          disparar por engano — e o histórico de alterações, que registra
          inclusive a limpeza, continua intacto. */}
      <Painel titulo="Dados">
        <div className="flex flex-wrap items-center gap-3">
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
// Resumo do topo
// ===========================================================================

type CartaoResumo = {
  rotulo: string;
  fmt: Formato;
  real: number | null;
  proporcional: number | null;
  pct: number | null;
  projecao: number | null;
  base: number | null;
};

/**
 * Faixa de abertura do painel: o estado do mês em uma olhada. Mostra o
 * realizado contra a meta proporcional (que é a régua de hoje) e, ao lado, onde
 * o mês fecha no ritmo atual — as duas perguntas que a tabela abaixo responde
 * indicador por indicador.
 */
function Resumo({
  resumo,
  mes,
  diasRestantes,
  fechado,
  frescor,
}: {
  resumo: { cartoes: CartaoResumo[]; foraDaMeta: number; comMeta: number; semLancamento: number };
  mes: string;
  diasRestantes: number;
  fechado: boolean;
  /** Último lançamento do mês corrente e há quantos dias úteis entrou. */
  frescor: { dia: string; atraso: number } | null;
}) {
  if (resumo.cartoes.length === 0 && resumo.comMeta === 0) return null;

  return (
    <section
      className="rounded-lg border p-5"
      style={{ borderColor: "var(--border)", background: "var(--surface)" }}
    >
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-lg font-semibold">{mes}</h2>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>
          {fechado
            ? "mês fechado"
            : diasRestantes > 0
              ? `${diasRestantes} dia${diasRestantes > 1 ? "s" : ""} útil${diasRestantes > 1 ? "eis" : ""} restante${diasRestantes > 1 ? "s" : ""}`
              : "sem dia útil restante"}
        </span>
        {/* Frescor: a partir de 5 dias úteis sem lançamento, o aviso deixa de
            ser informação de rodapé e vira o dado mais importante da faixa —
            porque "falta por dia" e "projeção no ritmo" passam a estar
            calculando em cima de número velho. */}
        {frescor !== null && !fechado && (
          <span
            className={`text-sm${frescor.atraso >= 5 ? " font-bold" : ""}`}
            style={{ color: frescor.atraso >= 5 ? CORES.warn : "var(--text-muted)" }}
            title={`Lançamento mais recente deste mês: ${frescor.dia.split("-").reverse().join("/")}`}
          >
            ·{" "}
            {frescor.atraso === 0
              ? "lançado hoje"
              : frescor.atraso === 1
                ? "sem lançar desde ontem"
                : `sem lançar há ${frescor.atraso} dias úteis`}
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {resumo.cartoes.map((c) => (
          <div key={c.rotulo} className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
            <span
              className="block text-[10px] font-bold uppercase tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              {c.rotulo}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <b className="text-xl tabular-nums">{fmt(c.real, c.fmt)}</b>
              <span className="text-sm font-bold tabular-nums" style={{ color: corDe(c.pct) }}>
                {c.pct === null ? "—" : `${c.pct.toFixed(0)}%`}
              </span>
            </div>
            <span className="mt-0.5 block text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>
              meta até hoje {fmt(c.proporcional, c.fmt)}
            </span>
            {c.projecao !== null && (
              <span className="mt-1 block text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>
                no ritmo, fecha em{" "}
                <b style={{ color: corDe(status(c.projecao, c.base, "up").pct) }}>
                  {fmt(c.projecao, c.fmt)}
                </b>
              </span>
            )}
          </div>
        ))}

        {/* Os dois contadores não são indicador: são o estado do preenchimento e
            do atingimento do mês, que é o que diz se vale olhar a tabela. */}
        <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
          <span
            className="block text-[10px] font-bold uppercase tracking-wide"
            style={{ color: "var(--text-muted)" }}
          >
            Atenção
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <b className="text-xl tabular-nums" style={{ color: resumo.foraDaMeta > 0 ? CORES.bad : CORES.ok }}>
              {resumo.foraDaMeta}
            </b>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              de {resumo.comMeta} abaixo de 85%
            </span>
          </div>
          <span className="mt-0.5 block text-[11px] leading-snug" style={{ color: "var(--text-muted)" }}>
            {resumo.semLancamento === 0
              ? "todos os indicadores com meta já têm lançamento"
              : `${resumo.semLancamento} ainda sem lançamento`}
          </span>
        </div>
      </div>
    </section>
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
const MARCA_ESTADO: Record<EstadoCampo, { simbolo: string; titulo: string; cor: string }> = {
  pendente: { simbolo: "•", titulo: "Digitando — ainda não salvo", cor: "var(--text-muted)" },
  salvando: { simbolo: "…", titulo: "Salvando…", cor: "var(--text-muted)" },
  salvo: { simbolo: "✓", titulo: "Salvo", cor: CORES.ok },
  erro: { simbolo: "!", titulo: "Não salvou — veja a mensagem no fim da página", cor: CORES.bad },
};

function CampoValor({
  formato,
  valor,
  placeholder,
  title,
  forte,
  estado,
  onChange,
  onSair,
}: {
  formato: Formato;
  valor: string;
  placeholder?: string;
  title?: string;
  forte?: boolean;
  estado?: EstadoCampo;
  onChange: (valorCanonico: string) => void;
  onSair?: () => void;
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
        onBlur={() => {
          setRascunho(null);
          // Sair do campo grava na hora, sem esperar a pausa da digitação:
          // trocar de mês ou fechar a aba logo depois perderia o valor.
          onSair?.();
        }}
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
      {/* Largura fixa mesmo sem marca, senão a coluna "pula" ao salvar. */}
      <span
        className="w-3 text-center text-xs font-bold"
        aria-live="polite"
        title={estado ? MARCA_ESTADO[estado].titulo : undefined}
        style={{ color: estado ? MARCA_ESTADO[estado].cor : "transparent" }}
      >
        {estado ? MARCA_ESTADO[estado].simbolo : ""}
      </span>
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
  estadoDe,
  onSairDoCampo,
  duPeriodo,
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
  estadoDe: (tipo: "real" | "meta", chave: string) => EstadoCampo | undefined;
  onSairDoCampo: (tipo: "real" | "meta", chave: string) => void;
  /** Dias úteis já decorridos no recorte — usado na explicação da projeção. */
  duPeriodo: number;
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
            {["Indicador", "Meta", "Meta proporcional", "Realizado", "Falta por dia útil", "Projeção no ritmo", "Atingimento"].map((h, i) => (
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
                linha.cor === "p4" ? COR_N4 : linha.cor === "p5" ? COR_N5 : "var(--accent)";
              return (
                <tr key={`g${idx}`}>
                  <td
                    colSpan={7}
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
            const projecao = projecaoFechamento(ind, real, dtIni, dtFim);

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
                      estado={estadoDe("meta", chave)}
                      onChange={(v) => onChange("meta", chave, v)}
                      onSair={() => onSairDoCampo("meta", chave)}
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
                      estado={estadoDe("real", chave)}
                      onChange={(v) => onChange("real", chave, v)}
                      onSair={() => onSairDoCampo("real", chave)}
                    />
                  ) : (
                    <span className="tabular-nums">{fmt(num(reais[chave] ?? ""), ind.fmt)}</span>
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
                {/* Projeção: onde o mês fecha mantendo o ritmo de até agora. A
                    cor compara com a meta CHEIA, porque a projeção é do mês
                    inteiro — compará-la com a proporcional misturaria duas
                    réguas. */}
                <td className="whitespace-nowrap px-2 py-2 text-right tabular-nums">
                  {projecao === null ? (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  ) : (
                    <span
                      style={{ color: corDe(status(projecao, base, ind.dir).pct) }}
                      title={`No ritmo de ${fmt(real, ind.fmt)} em ${duPeriodo} dia(s) útil(eis), o mês fecha em ${fmt(
                        projecao,
                        ind.fmt
                      )} — a meta cheia é ${fmt(base, ind.fmt)}`}
                    >
                      {fmt(projecao, ind.fmt)}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-right font-extrabold tabular-nums">
                  <span
                    className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
                    style={{ background: corAreaDe(st.pct) }}
                  />
                  <span style={{ color: corDe(st.pct) }}>
                    {st.pct === null ? "—" : st.pct.toFixed(0) + "%"}
                  </span>
                </td>
              </tr>
              {expandido && (
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td colSpan={7} className="px-2 pb-4 pt-1">
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
