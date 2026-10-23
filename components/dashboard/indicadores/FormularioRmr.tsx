"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Indicador, Pessoa } from "@/lib/indicadores";
import { CORES, num, status } from "@/lib/indicadoresCalc";
import { rotuloMes } from "@/lib/indicadores";
import { gerarXlsx, type Aba, type Celula } from "@/lib/planilhaXlsx";
import {
  COLUNAS_PLANO,
  EXEMPLOS_PORQUES,
  STATUS_PLANO,
  dataBr,
  secoesPendentes,
  linhaPlanoVazia,
  rmrVazio,
  rmrVazioDeFato,
  type LinhaPlano,
  type Rmr,
} from "@/lib/rmr";
import { sugestaoDoMes } from "@/lib/rmrSugestao";
import { GraficoColunasMensal } from "./Graficos";
import { SeloAtingimento } from "./SeloAtingimento";

/** pendente = há texto não gravado; salvo = o servidor confirmou. */
type EstadoSalvamento = "limpo" | "pendente" | "salvando" | "salvo" | "erro";

type Salvo = {
  mes: string;
  pessoa: string;
  conteudo: Rmr;
  atualizadoEm: string;
  atualizadoPor: string | null;
};

const inputCls = "w-full rounded border px-2 py-1.5 text-sm";
const inputStyle = {
  borderColor: "var(--border)",
  background: "var(--surface)",
  color: "var(--text)",
} as const;

export function FormularioRmr({
  unidadeSlug,
  unidadeNome,
  pessoas,
  meses,
  reaisPorMes,
  metasPorMes,
  salvos,
}: {
  unidadeSlug: string;
  unidadeNome: string;
  pessoas: Pessoa[];
  meses: string[];
  reaisPorMes: Record<string, Record<string, string>>;
  metasPorMes: Record<string, Record<string, number | null>>;
  salvos: Salvo[];
}) {
  const mesInicial = useMemo(() => {
    // Abre no mês anterior ao corrente: RMR se faz sobre mês terminado. Se esse
    // mês não estiver no ciclo (virada de ano), cai no último mês conhecido.
    const hoje = new Date();
    const anterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
    const chave = `${anterior.getFullYear()}-${String(anterior.getMonth() + 1).padStart(2, "0")}`;
    return meses.includes(chave) ? chave : (meses[meses.length - 1] ?? "");
  }, [meses]);

  const [mes, setMes] = useState(mesInicial);
  const [pessoaChave, setPessoaChave] = useState(pessoas[0]?.chave ?? "");
  const [doc, setDoc] = useState<Rmr>(rmrVazio());
  const [estado, setEstado] = useState<EstadoSalvamento>("limpo");
  const [aviso, setAviso] = useState("");
  /** Relatórios gravados nesta sessão — `salvos` é a foto da abertura da página. */
  const [gravados, setGravados] = useState<Set<string>>(new Set());

  const pessoa = pessoas.find((p) => p.chave === pessoaChave) ?? pessoas[0];

  const sugestao = useMemo(
    () =>
      pessoa
        ? sugestaoDoMes(pessoa, mes, reaisPorMes[mes] ?? {}, metasPorMes[mes] ?? {})
        : { resultado: [], priorizacao: [], problema: "" },
    [pessoa, mes, reaisPorMes, metasPorMes]
  );

  const registro = salvos.find((s) => s.mes === mes && s.pessoa === pessoaChave) ?? null;
  const pendentes = secoesPendentes(doc);
  // Mês sem nenhum lançamento daquela pessoa. Sem este aviso a seção 1 mostra
  // nove linhas de "sem lançamento" e quem olha conclui que o dado sumiu — o
  // formulário abre no mês anterior ao corrente, que pode estar vazio.
  const semLancamento = doc.resultado.length > 0 && doc.resultado.every((l) => !l.realizado.trim());
  /** Indicador com a série aberta. Um de cada vez: abrir todos devolveria o
      problema que a tabela resolve, que é caber na tela. */
  const [aberto, setAberto] = useState<string | null>(null);

  /**
   * Um ponto por mês do ciclo do relatório: o realizado e o atingimento que dá a
   * cor da coluna. A meta não vem por mês porque na tela ela é uma régua só — a
   * do mês do relatório, congelada.
   */
  const colunasDoAno = useCallback(
    (ind: Indicador) =>
      meses
        .filter((m) => m.slice(0, 4) === mes.slice(0, 4))
        .map((m) => {
          const chave = `${pessoaChave}_${ind.id}`;
          const real = num((reaisPorMes[m] ?? {})[chave]);
          const override = (metasPorMes[m] ?? {})[chave];
          const metaDoMesCorrente = override === undefined || override === null ? ind.meta : override;
          return { rotulo: rotuloMes(m), real, pct: status(real, metaDoMesCorrente, ind.dir).pct };
        }),
    [meses, mes, pessoaChave, reaisPorMes, metasPorMes]
  );

  /**
   * A meta que serve de régua: a do MÊS DO RELATÓRIO, não a de hoje.
   *
   * É o ponto que o Nathan levantou — se a meta virar 200 em novembro, o
   * relatório de outubro continua mostrando 175, porque era isso que outubro
   * cobrava. Cada relatório fica congelado com a régua da própria época.
   */
  const metaDoMes = useCallback(
    (ind: Indicador): number | null => {
      const override = (metasPorMes[mes] ?? {})[`${pessoaChave}_${ind.id}`];
      return override === undefined || override === null ? ind.meta : override;
    },
    [metasPorMes, mes, pessoaChave]
  );

  // O documento de impressão é levado para fora desta árvore, direto no <body>:
  // é o que permite esconder todos os irmãos dele na impressão sem que o
  // formulário continue ocupando páginas. Só depois do primeiro render, porque
  // no servidor não existe `document`.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  // O que ainda não foi gravado. Guarda mês e pessoa junto do documento porque a
  // gravação pode acontecer DEPOIS de trocar de pessoa na tela — e aí gravar no
  // par errado escreveria o diagnóstico de um no relatório do outro.
  const pendente = useRef<{ mes: string; pessoa: string; doc: Rmr } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const jaExiste = useCallback(
    (m: string, p: string) =>
      salvos.some((s) => s.mes === m && s.pessoa === p) || gravados.has(`${m}|${p}`),
    [salvos, gravados]
  );

  const gravar = useCallback(
    async (alvo: { mes: string; pessoa: string; doc: Rmr }) => {
      setEstado("salvando");
      try {
        const r = await fetch("/api/dashboard/indicadores/rmr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            unidade: unidadeSlug,
            mes: alvo.mes,
            pessoa: alvo.pessoa,
            conteudo: alvo.doc,
          }),
        });
        if (!r.ok) {
          const corpo = (await r.json().catch(() => null)) as { error?: string } | null;
          setEstado("erro");
          setAviso(corpo?.error ?? "Não foi possível salvar.");
          return;
        }
        setGravados((g) => new Set(g).add(`${alvo.mes}|${alvo.pessoa}`));
        setEstado("salvo");
        setAviso("");
      } catch {
        setEstado("erro");
        setAviso("Falha ao salvar — o texto continua na tela, tente de novo.");
      }
    },
    [unidadeSlug]
  );

  /**
   * Grava o que estiver pendente. `forcar` ignora a guarda de documento em
   * branco: é o clique no botão, que é intenção explícita.
   */
  const descarregar = useCallback(
    async (forcar = false) => {
      const alvo = pendente.current;
      pendente.current = null;
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      if (!alvo) return;
      // Sem isto, passear pelo seletor criaria uma linha em branco para cada
      // pessoa e mês visitados — e o seletor passaria a marcar todos com ✓.
      if (!forcar && rmrVazioDeFato(alvo.doc) && !jaExiste(alvo.mes, alvo.pessoa)) {
        setEstado("limpo");
        return;
      }
      await gravar(alvo);
    },
    [gravar, jaExiste]
  );

  // Trocar de mês ou de pessoa troca o documento inteiro. Relatório que ainda
  // não existe nasce com as seções 1 e 2 já preenchidas pelo painel.
  useEffect(() => {
    if (registro) {
      // As seções 1 e 2 não são texto da pessoa: são a leitura do painel naquele
      // mês. Por isso são relidas na abertura, e não restauradas como foram
      // gravadas — lançamento feito DEPOIS de o relatório existir aparece
      // sozinho. Antes o documento guardava a foto do dia em que foi aberto, e
      // bastava alguém lançar mais tarde para a tabela da seção 1 discordar do
      // gráfico logo abaixo dela, que sempre leu o painel direto.
      //
      // O texto escrito continua intacto: o que entra aqui é só o que o painel
      // já responde sozinho.
      setDoc({ ...registro.conteudo, resultado: sugestao.resultado });
    } else {
      setDoc({
        ...rmrVazio(),
        resultado: sugestao.resultado,
        // O enunciado do pior desvio entra nos dois lugares onde ele é cobrado:
        // o problema dos 5 porquês e o desvio do pedido de suporte.
        problema: sugestao.problema,
        pedido: { ...rmrVazio().pedido, desvio: sugestao.problema },
      });
    }
    setEstado("limpo");
    setAviso("");
    // `sugestao` só muda junto com mes/pessoa, que são as dependências reais.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mes, pessoaChave]);

  // Sair da página não pode levar junto meia hora de diagnóstico.
  useEffect(() => {
    return () => {
      void descarregar();
    };
  }, [descarregar]);

  /**
   * Toda alteração passa por aqui: guarda o pendente e arma o relógio. Salvar só
   * ao sair do campo não bastaria — nesta tela a pessoa escreve minutos seguidos
   * dentro de UMA área de texto, sem nunca tirar o foco dela.
   */
  function registrarMudanca(novo: Rmr) {
    setDoc(novo);
    pendente.current = { mes, pessoa: pessoaChave, doc: novo };
    setEstado("pendente");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void descarregar(), 4000);
  }

  function alterar<K extends keyof Rmr>(campo: K, valor: Rmr[K]) {
    registrarMudanca({ ...doc, [campo]: valor });
  }

  /** Troca de mês ou de pessoa grava o anterior antes de abrir o próximo. */
  function trocarMes(novo: string) {
    void descarregar();
    setMes(novo);
  }

  function trocarPessoa(nova: string) {
    void descarregar();
    setPessoaChave(nova);
  }

  /** Repõe a seção 1 com os números de agora, sem tocar no texto escrito. */
  function recarregarNumeros() {
    // Não sobrescreve texto escrito: o enunciado só entra onde o campo está
    // vazio. Quem reescreveu o problema de propósito não perde a redação.
    registrarMudanca({
      ...doc,
      resultado: sugestao.resultado,
      problema: doc.problema.trim() ? doc.problema : sugestao.problema,
      pedido: {
        ...doc.pedido,
        desvio: doc.pedido.desvio.trim() ? doc.pedido.desvio : sugestao.problema,
      },
    });
    setAviso("Seção 1 atualizada com os lançamentos do painel.");
  }

  /*
   * SAÍDAS DESLIGADAS NA TELA, CÓDIGO INTEIRO
   *
   * Nem o PDF nem a planilha têm botão agora, a pedido. Nada foi removido:
   *
   * - PDF: `DocumentoImpressao` continua montado por portal no <body>, com a
   *   faixa da marca e as regras de @media print em globals.css. Religar é um
   *   botão chamando `window.print()`. Enquanto isso, Ctrl+P na página ainda
   *   imprime o relatório formatado — o documento está lá, só não há botão.
   *
   * - Planilha: `exportar` abaixo, com o layout em linhas e as datas em
   *   dd/mm/aaaa. Religar é um botão chamando ela.
   */

  /**
   * Exportação em planilha. Único lugar que conhece o layout do relatório em
   * linhas — útil se um dia a saída precisar virar CSV, e-mail ou anexo de
   * automação.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function exportar() {
    if (!pessoa) return;
    const linhas: Celula[][] = [
      [`RMR | ${rotuloMes(mes).toUpperCase()} — ${pessoa.nome}`, "DIAGNÓSTICO E PLANO DE AÇÃO"],
      [],
      ["A narrativa do ciclo:", doc.narrativa],
      [],
      ["1. RESULTADO — O QUE OS INDICADORES MOSTRAM"],
      ["Indicador", "Realizado", "Meta / referência", "Diferença", "Atingimento", "Situação"],
      ...doc.resultado.map((l): Celula[] => [
        l.indicador,
        l.realizado,
        l.meta,
        l.diferenca,
        l.pct,
        l.atingida === null ? (l.realizado ? "sem meta" : "sem lançamento") : l.atingida ? "realizada" : "não realizada",
      ]),
      [],
      ["2. PRIORIZAÇÃO — DESVIO DO CICLO"],
      ["Prioridade", "Indicador com desvio"],
      ...doc.priorizacao
        .filter((l) => l.indicador.trim())
        .map((l, i): Celula[] => [i + 1, l.indicador]),
      [],
      ["3. 5 PORQUÊS — CAMINHO ATÉ A CAUSA RAIZ"],
      ["PROBLEMA:", doc.problema],
      ["Etapa", "Análise"],
      ...doc.porques.map((p, i): Celula[] => [`Por quê? ${i + 1}`, p]),
      [],
      ["4. CAUSA RAIZ E GOVERNABILIDADE"],
      ["CAUSA RAIZ:", doc.causaRaiz],
      [
        "É acionável no meu nível?",
        doc.acionavel ? "SIM ( X )" : "SIM (   )",
        doc.precisaSuporte ? "PRECISO DE SUPORTE ( X )" : "PRECISO DE SUPORTE (   )",
      ],
      [],
      ["5. PLANO DE AÇÃO — 5W2H"],
      COLUNAS_PLANO.map((c) => c.rotulo),
      ...doc.plano.map((l): Celula[] =>
        COLUNAS_PLANO.map((c) => (c.tipo === "data" ? dataBr(l[c.chave]) : l[c.chave]))
      ),
      [],
      ["6. PEDIDO DE SUPORTE — DECISÃO NECESSÁRIA"],
      ["O desvio, com número", "A causa raiz", "O que eu preciso", "O impacto de não resolver"],
      [doc.pedido.desvio, doc.pedido.causa, doc.pedido.precisa, doc.pedido.impacto],
      [],
      ["7. FECHAMENTO — MENSAGEM PARA A COORDENAÇÃO"],
      [doc.mensagem],
    ];

    // Uma aba só, como a planilha original: o relatório se lê de cima a baixo,
    // na ordem do raciocínio. Quebrar em abas perderia o encadeamento.
    const aba: Aba = { nome: `RMR ${rotuloMes(mes)}`, linhas };
    const blob = new Blob([gerarXlsx([aba])], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `rmr_${unidadeSlug}_${pessoa.chave}_${mes}.xlsx`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  if (!pessoa) return null;

  return (
    // Um onBlur no contêiner cobre todos os campos: em React o blur borbulha.
    // Sair de um campo grava na hora, sem esperar os 4 segundos do relógio.
    <div className="space-y-5" onBlur={() => void descarregar()}>
      {/* ---------------- seleção ---------------- */}
      <section
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Campo label="Mês do relatório">
          <select value={mes} onChange={(e) => trocarMes(e.target.value)} className={inputCls} style={inputStyle}>
            {meses.map((m) => (
              <option key={m} value={m}>
                {rotuloMes(m)}
                {salvos.some((s) => s.mes === m && s.pessoa === pessoaChave) ? " ✓" : ""}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Pessoa">
          <select
            value={pessoaChave}
            onChange={(e) => trocarPessoa(e.target.value)}
            className={inputCls}
            style={inputStyle}
            disabled={pessoas.length === 1}
          >
            {pessoas.map((p) => (
              <option key={p.chave} value={p.chave}>
                {p.nome}
              </option>
            ))}
          </select>
        </Campo>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: estado === "erro" ? CORES.bad : "var(--text-muted)" }}>
            {estado === "salvando"
              ? "salvando…"
              : estado === "pendente"
                ? "alterações não salvas"
                : estado === "salvo"
                  ? "salvo"
                  : estado === "erro"
                    ? "não salvo"
                    : registro
                      ? `salvo em ${new Date(registro.atualizadoEm).toLocaleDateString("pt-BR")}${registro.atualizadoPor ? ` por ${registro.atualizadoPor}` : ""}`
                      : "não preenchido"}
          </span>
          <button
            type="button"
            onClick={() => void descarregar(true)}
            disabled={estado === "salvando"}
            className="rounded px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: "var(--accent)" }}
          >
            {estado === "salvando" ? "Salvando…" : "Salvar agora"}
          </button>
        </div>

        {/* Só aparece quando há o que dizer. A explicação de que grava sozinho
            saiu: o indicador ao lado dos botões já mostra o estado, e a frase
            ocupava uma linha fixa para repetir o que se vê acontecer. */}
        {aviso && (
          <p className="w-full text-xs" style={{ color: estado === "erro" ? CORES.bad : "var(--text-muted)" }}>
            {aviso}
          </p>
        )}

        {/* O que falta. Com sete seções é fácil salvar pela metade e não
            perceber — ainda mais agora que grava sozinho e não há um "enviar"
            que obrigue a conferir. */}
        <p className="w-full text-xs">
          {pendentes.length === 0 ? (
            <span style={{ color: CORES.ok }}>Relatório completo.</span>
          ) : (
            <span style={{ color: CORES.warn }}>
              Falta responder: <b>{pendentes.join(" · ")}</b>
            </span>
          )}
        </p>
      </section>

      {/* ---------------- narrativa ---------------- */}
      <Secao titulo="A narrativa do ciclo" numero="">
        <p className="mb-2 text-xs" style={{ color: "var(--text-muted)" }}>
          Uma frase: o que aconteceu no mês e o que este relatório vai apurar.
        </p>
        <AreaTexto
          valor={doc.narrativa}
          onChange={(v) => alterar("narrativa", v)}
          linhas={2}
          placeholder="A receita superou a meta, porém a entrada de negociações ficou muito abaixo do planejado…"
        />
      </Secao>

      {/* ---------------- 1. resultado ---------------- */}
      <Secao
        titulo="Resultado — o que os indicadores mostram"
        numero="1"
        acao={
          <button
            type="button"
            onClick={recarregarNumeros}
            className="text-xs font-semibold hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Atualizar com os lançamentos do painel
          </button>
        }
      >
        <p className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
          Vem do painel, comparando com a meta <b>cheia</b> do mês — no fechamento a pergunta não é
          se está no ritmo, é se entregou o combinado. 
        </p>
        {semLancamento ? (
          <p className="py-2 text-sm" style={{ color: CORES.warn }}>
            Sem lançamentos em {rotuloMes(mes)} para {pessoa.nome.split(" ")[0]}.
          </p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                <th className="pb-2 pr-3">Indicador</th>
                <th className="pb-2 pr-3 text-right">Realizado</th>
                <th className="pb-2 pr-3 text-right">Meta</th>
                <th className="pb-2 pr-3 text-right">Diferença</th>
                <th className="pb-2 text-right">Atingimento</th>
              </tr>
            </thead>
            <tbody>
              {doc.resultado.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    Nenhum indicador lançado neste mês para esta pessoa.
                  </td>
                </tr>
              )}
              {doc.resultado.map((l, i) => (
                <Fragment key={`${l.indicador}-${i}`}>
                <tr style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="py-2.5 pr-3">
                    {/* Botão de verdade, não div com onClick: a linha é
                        navegável por teclado como qualquer outro controle. */}
                    <button
                      type="button"
                      onClick={() => setAberto((x) => (x === l.indicador ? null : l.indicador))}
                      className="text-left hover:underline"
                      style={{ color: "var(--text)" }}
                      aria-expanded={aberto === l.indicador}
                    >
                      {l.indicador}
                      <span className="ml-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {aberto === l.indicador ? "▲" : "▼"}
                      </span>
                    </button>
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums">{l.realizado || "—"}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {l.meta}
                  </td>
                  <td className="py-2.5 pr-3 text-right tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {l.diferenca || "—"}
                  </td>
                  {/* O mesmo selo do painel — bolinha e porcentagem —, aqui em
                      leitura binária: no fechamento não existe "quase". As
                      palavras "realizada / não realizada" saíram da tela e
                      continuam no PDF, que é onde a cor não ajuda: papel em
                      preto e branco, ou quem não distingue verde de vermelho. */}
                  <td className="py-2.5 text-right font-extrabold">
                    <SeloAtingimento
                      atingida={l.atingida}
                      texto={l.pct}
                      vazio={l.realizado ? "sem meta" : "sem lançamento"}
                    />
                  </td>
                </tr>
                {aberto === l.indicador && (
                  <tr>
                    <td colSpan={5} className="px-2 pb-4 pt-1">
                      <span
                        className="mb-1 block text-[10px] font-bold uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {l.indicador} — mês a mês
                      </span>
                      {/* Só o mês a mês: o ranking "todos os meses, do maior
                          para o menor" saiu da tela a pedido. O componente
                          continua em Graficos.tsx. */}
                      {(() => {
                        const ind = pessoa.kpis.find((k) => k.nome === l.indicador) ?? pessoa.kpis[0];
                        return (
                          <GraficoColunasMensal
                            serie={colunasDoAno(ind)}
                            meta={metaDoMes(ind)}
                            formato={ind.fmt}
                          />
                        );
                      })()}
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Secao>

      {/* ---------------- 2. priorização ---------------- */}
      <Secao titulo="Priorização — o Top 3 desvios do ciclo" numero="2">
        <p className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
          As três frentes que este ciclo vai atacar, na ordem em que a reunião começa. O tamanho de
          cada desvio está na seção 1, acima — aqui a pergunta é qual deles você escolhe.
        </p>
        {/* Campo, não lista pronta: quem escolhe a frente assume a escolha. E a
            ordem da reunião nem sempre é a ordem do desvio — o menor dos três
            pode ser o que destrava os outros dois. */}
        <ol className="max-w-xl space-y-2">
          {doc.priorizacao.map((l, i) => (
            <li key={i} className="flex items-center gap-x-3">
              <b className="text-sm" style={{ color: "var(--text-muted)" }}>
                {i + 1}.
              </b>
              <input
                className={inputCls}
                style={inputStyle}
                value={l.indicador}
                onChange={(e) => {
                  const lista = doc.priorizacao.map((o, j) =>
                    j === i ? { ...o, indicador: e.target.value } : o
                  );
                  alterar("priorizacao", lista);
                }}
                placeholder={
                  i === 0 ? "Indicador que a reunião ataca primeiro" : "Indicador"
                }
                aria-label={`Prioridade ${i + 1}`}
              />
            </li>
          ))}
        </ol>
      </Secao>

      {/* ---------------- 3. 5 porquês ---------------- */}
      <Secao titulo="5 Porquês — caminho até a causa raiz" numero="3">
        <label className="block text-xs font-bold" htmlFor="problema">
          Problema (indicador + realizado + meta)
        </label>
        <AreaTexto
          id="problema"
          valor={doc.problema}
          onChange={(v) => alterar("problema", v)}
          linhas={2}
          placeholder="Negociações iniciadas — 13 realizadas vs. 32 de meta."
        />
        <p className="mb-1 mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
          Cada resposta pergunta o porquê da anterior — é assim que se chega na causa raiz, e não em
          cinco versões do mesmo motivo. Os exemplos em cinza são só sugestão de como responder.
        </p>
        <div className="space-y-2">
          {doc.porques.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-24 shrink-0 pt-2 text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                Por quê? {i + 1}
              </span>
              <AreaTexto
                valor={p}
                onChange={(v) => {
                  const nova = [...doc.porques];
                  nova[i] = v;
                  alterar("porques", nova);
                }}
                linhas={2}
                placeholder={EXEMPLOS_PORQUES[i]}
              />
            </div>
          ))}
        </div>
      </Secao>

      {/* ---------------- 4. causa raiz ---------------- */}
      <Secao titulo="Causa raiz e governabilidade" numero="4">
        <AreaTexto
          valor={doc.causaRaiz}
          onChange={(v) => alterar("causaRaiz", v)}
          linhas={3}
          placeholder="Baixo volume de novas oportunidades de entrada, decorrente de…"
        />
        <div className="mt-3 flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={doc.acionavel}
              onChange={(e) => alterar("acionavel", e.target.checked)}
            />
            É acionável no meu nível
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={doc.precisaSuporte}
              onChange={(e) => alterar("precisaSuporte", e.target.checked)}
            />
            Preciso de suporte
          </label>
        </div>
      </Secao>

      {/* ---------------- 5. plano 5W2H ---------------- */}
      <Secao
        titulo="Plano de ação — 5W2H"
        numero="5"
        acao={
          <button
            type="button"
            onClick={() => alterar("plano", [...doc.plano, linhaPlanoVazia()])}
            className="text-xs font-semibold hover:underline"
            style={{ color: "var(--accent)" }}
          >
            + frente
          </button>
        }
      >
        <div className="space-y-4">
          {doc.plano.map((linha, i) => (
            <div key={i} className="rounded-lg border p-3" style={{ borderColor: "var(--border)" }}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                  Frente {i + 1}
                </span>
                {doc.plano.length > 1 && (
                  <button
                    type="button"
                    onClick={() => alterar("plano", doc.plano.filter((_, j) => j !== i))}
                    className="text-xs hover:underline"
                    style={{ color: "#DC2626" }}
                  >
                    remover
                  </button>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {COLUNAS_PLANO.map((col) => (
                  <div key={col.chave}>
                    <label className="mb-1 block text-[11px] font-bold" htmlFor={`p${i}-${col.chave}`}>
                      {col.rotulo}
                    </label>
                    {col.chave === "status" ? (
                      <select
                        id={`p${i}-${col.chave}`}
                        value={linha.status}
                        onChange={(e) => trocarPlano(doc, alterar, i, "status", e.target.value)}
                        className={inputCls}
                        style={inputStyle}
                      >
                        {STATUS_PLANO.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : col.tipo === "data" ? (
                      <input
                        id={`p${i}-${col.chave}`}
                        type="date"
                        value={linha[col.chave]}
                        /* O prazo não pode ser anterior ao começo: o seletor já
                           impede, em vez de aceitar e virar relatório estranho. */
                        min={col.chave === "prazo" ? linha.quando || undefined : undefined}
                        onChange={(e) => trocarPlano(doc, alterar, i, col.chave, e.target.value)}
                        className={inputCls}
                        style={inputStyle}
                      />
                    ) : (
                      <input
                        id={`p${i}-${col.chave}`}
                        value={linha[col.chave]}
                        onChange={(e) => trocarPlano(doc, alterar, i, col.chave, e.target.value)}
                        className={inputCls}
                        style={inputStyle}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Secao>

      {/* ---------------- 6. pedido de suporte ---------------- */}
      <Secao titulo="Pedido de suporte — decisão necessária" numero="6">
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["desvio", "O desvio, com número"],
              ["causa", "A causa raiz"],
              ["precisa", "O que eu preciso"],
              ["impacto", "O impacto de não resolver"],
            ] as const
          ).map(([campo, rotulo]) => (
            <div key={campo}>
              <label className="mb-1 block text-xs font-bold" htmlFor={`pd-${campo}`}>
                {rotulo}
              </label>
              <AreaTexto
                id={`pd-${campo}`}
                valor={doc.pedido[campo]}
                onChange={(v) => alterar("pedido", { ...doc.pedido, [campo]: v })}
                linhas={3}
              />
            </div>
          ))}
        </div>
      </Secao>

      {/* Fica sempre montado, para refletir o formulário como ele está agora —
          sem estado, sem espera entre clicar e imprimir. aria-hidden porque é
          cópia: quem usa leitor de tela lê o formulário. */}
      {montado &&
        createPortal(
          <DocumentoImpressao doc={doc} pessoa={pessoa.nome} mes={rotuloMes(mes)} unidade={unidadeNome} />,
          document.body
        )}

      {/* ---------------- 7. fechamento ---------------- */}
      <Secao titulo="Fechamento — mensagem para a coordenação" numero="7">
        <AreaTexto
          valor={doc.mensagem}
          onChange={(v) => alterar("mensagem", v)}
          linhas={4}
          placeholder="Setembro entregou receita acima da meta, mas a formação de novas negociações ficou em…"
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(doc.mensagem)}
            disabled={!doc.mensagem.trim()}
            className="rounded border px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Copiar mensagem
          </button>
          {rmrVazioDeFato(doc) && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Relatório ainda em branco — nada foi escrito além dos números do painel.
            </span>
          )}
        </div>
      </Secao>
    </div>
  );
}

/**
 * O relatório como documento, para a impressão em PDF. É outra árvore, não o
 * formulário escondido: área de texto imprime só a parte visível, então um
 * diagnóstico longo sairia cortado no papel. Aqui o texto é texto.
 */
function DocumentoImpressao({
  doc,
  pessoa,
  mes,
  unidade,
}: {
  doc: Rmr;
  pessoa: string;
  mes: string;
  unidade: string;
}) {
  const planoPreenchido = doc.plano.filter((l) => l.oQue.trim() || l.causa.trim());

  return (
    <div id="rmr-impressao" aria-hidden="true">
      <div style={{ color: "#000", fontSize: "11pt", lineHeight: 1.45 }}>
        {/* Faixa da marca. Sangra para as margens da página com margem negativa:
            `@page` reserva 16mm e sem isso a tarja ficaria flutuando com borda
            branca em volta, parecendo um retângulo solto. */}
        <div
          style={{
            background: "#a224db",
            color: "#fff",
            margin: "-16mm -16mm 6mm",
            padding: "7mm 16mm",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8mm",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "16pt", lineHeight: 1.2 }}>RMR — {mes}</h1>
            <p style={{ margin: "1mm 0 0", fontSize: "10.5pt" }}>
              {pessoa} · {unidade}
            </p>
          </div>
          {/* A versão clara da logo, que é a branca — a mesma do cabeçalho do
              site não apareceria sobre o roxo. */}
          <img
            src="/assets/onvox-logo-dark.png"
            alt="Onvox"
            style={{ height: "9mm", width: "auto", flexShrink: 0 }}
          />
        </div>

        <p style={{ margin: "0 0 6mm", fontSize: "10pt", color: "#444" }}>
          Diagnóstico e plano de ação · gerado em {new Date().toLocaleDateString("pt-BR")}
        </p>

        {doc.narrativa.trim() && (
          <Bloco titulo="A narrativa do ciclo">
            <Paragrafo texto={doc.narrativa} />
          </Bloco>
        )}

        <Bloco titulo="1. Resultado — o que os indicadores mostram">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9.5pt" }}>
            <thead>
              <tr>
                {["Indicador", "Realizado", "Meta", "Diferença", "Atingimento"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      textAlign: i === 0 ? "left" : "right",
                      borderBottom: "1px solid #000",
                      padding: "1mm 2mm 1mm 0",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doc.resultado.map((l, i) => (
                <tr key={`${l.indicador}-${i}`}>
                  <td style={{ padding: "1mm 2mm 1mm 0", borderBottom: "1px solid #ddd" }}>{l.indicador}</td>
                  <td style={{ textAlign: "right", padding: "1mm 2mm", borderBottom: "1px solid #ddd" }}>
                    {l.realizado || "—"}
                  </td>
                  <td style={{ textAlign: "right", padding: "1mm 2mm", borderBottom: "1px solid #ddd" }}>{l.meta}</td>
                  <td style={{ textAlign: "right", padding: "1mm 2mm", borderBottom: "1px solid #ddd" }}>
                    {l.diferenca || "—"}
                  </td>
                  <td style={{ textAlign: "right", padding: "1mm 0 1mm 2mm", borderBottom: "1px solid #ddd" }}>
                    {l.atingida === null ? "—" : `${l.pct} · ${l.atingida ? "realizada" : "não realizada"}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Bloco>

        {/* Vaga em branco não vira item numerado no papel: o relatório
            impresso mostra as frentes escolhidas, não as três linhas do
            formulário. */}
        {doc.priorizacao.some((l) => l.indicador.trim()) && (
          <Bloco titulo="2. Priorização — o Top 3 desvios do ciclo">
            <ol style={{ margin: 0, paddingLeft: "6mm" }}>
              {doc.priorizacao
                .filter((l) => l.indicador.trim())
                .map((l, i) => (
                  <li key={i}>{l.indicador}</li>
                ))}
            </ol>
          </Bloco>
        )}

        <Bloco titulo="3. 5 Porquês — caminho até a causa raiz">
          <Paragrafo rotulo="Problema" texto={doc.problema} />
          {doc.porques.map((p, i) =>
            p.trim() ? <Paragrafo key={i} rotulo={`Por quê? ${i + 1}`} texto={p} /> : null
          )}
        </Bloco>

        <Bloco titulo="4. Causa raiz e governabilidade">
          <Paragrafo texto={doc.causaRaiz} />
          <p style={{ margin: "2mm 0 0", fontSize: "10pt" }}>
            Acionável no meu nível: <b>{doc.acionavel ? "sim" : "não"}</b> · Precisa de suporte:{" "}
            <b>{doc.precisaSuporte ? "sim" : "não"}</b>
          </p>
        </Bloco>

        {planoPreenchido.length > 0 && (
          <Bloco titulo="5. Plano de ação — 5W2H">
            {planoPreenchido.map((l, i) => (
              <div key={i} style={{ marginBottom: "3mm", breakInside: "avoid" }}>
                <p style={{ margin: "0 0 1mm", fontWeight: 700 }}>
                  {i + 1}. {l.oQue || l.causa}
                </p>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9.5pt" }}>
                  <tbody>
                    {COLUNAS_PLANO.filter((c) => c.chave !== "oQue" && l[c.chave].trim()).map((c) => (
                      <tr key={c.chave}>
                        <td style={{ width: "34mm", padding: "0.6mm 2mm 0.6mm 0", verticalAlign: "top", color: "#444" }}>
                          {c.rotulo}
                        </td>
                        <td style={{ padding: "0.6mm 0", verticalAlign: "top" }}>
                          {c.tipo === "data" ? dataBr(l[c.chave]) : l[c.chave]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </Bloco>
        )}

        {(doc.pedido.desvio.trim() || doc.pedido.precisa.trim()) && (
          <Bloco titulo="6. Pedido de suporte — decisão necessária">
            <Paragrafo rotulo="O desvio, com número" texto={doc.pedido.desvio} />
            <Paragrafo rotulo="A causa raiz" texto={doc.pedido.causa} />
            <Paragrafo rotulo="O que eu preciso" texto={doc.pedido.precisa} />
            <Paragrafo rotulo="O impacto de não resolver" texto={doc.pedido.impacto} />
          </Bloco>
        )}

        {doc.mensagem.trim() && (
          <Bloco titulo="7. Fechamento — mensagem para a coordenação">
            <Paragrafo texto={doc.mensagem} />
          </Bloco>
        )}
      </div>
    </div>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rmr-bloco" style={{ marginBottom: "5mm" }}>
      <h2
        style={{
          margin: "0 0 1.5mm",
          fontSize: "11.5pt",
          color: "#19014b",
          borderBottom: "1.5px solid #a224db",
          paddingBottom: "1mm",
        }}
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}

/** Campo vazio não vira linha em branco no papel. */
function Paragrafo({ rotulo, texto }: { rotulo?: string; texto: string }) {
  if (!texto.trim()) return null;
  return (
    <p style={{ margin: "0 0 1.5mm", whiteSpace: "pre-line" }}>
      {rotulo && <b>{rotulo}: </b>}
      {texto}
    </p>
  );
}

/** Troca um campo de uma frente do plano sem recriar o documento inteiro na tela. */
function trocarPlano(
  doc: Rmr,
  alterar: <K extends keyof Rmr>(campo: K, valor: Rmr[K]) => void,
  indice: number,
  campo: keyof LinhaPlano,
  valor: string
) {
  const nova = [...doc.plano];
  nova[indice] = { ...nova[indice], [campo]: valor };
  alterar("plano", nova);
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function Secao({
  titulo,
  numero,
  acao,
  children,
}: {
  titulo: string;
  numero: string;
  acao?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {/* O número vem na mesma bolinha roxa que o painel usa para N3, N4 e N5
            — lá é a etiqueta do nível, aqui é a ordem da seção, e as duas telas
            passam a marcar "este bloco é tal coisa" do mesmo jeito.

            `items-center` no lugar de `items-baseline`: com a bolinha, alinhar
            pela linha de base do texto deixaria o círculo subindo acima do
            título. */}
        <h2 className="flex items-center gap-2.5 text-base font-semibold">
          {numero && (
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold"
              style={{ background: "var(--accent)", color: "#fff" }}
              aria-hidden="true"
            >
              {numero}
            </span>
          )}
          {titulo}
        </h2>
        {acao}
      </div>
      {children}
    </section>
  );
}

function AreaTexto({
  id,
  valor,
  onChange,
  linhas,
  placeholder,
}: {
  id?: string;
  valor: string;
  onChange: (v: string) => void;
  linhas: number;
  placeholder?: string;
}) {
  return (
    <textarea
      id={id}
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      rows={linhas}
      placeholder={placeholder}
      className="w-full rounded border px-2 py-1.5 text-sm"
      style={inputStyle}
    />
  );
}
