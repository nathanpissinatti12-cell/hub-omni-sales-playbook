"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Pessoa } from "@/lib/indicadores";
import { rotuloMes } from "@/lib/indicadores";
import { gerarXlsx, type Aba, type Celula } from "@/lib/planilhaXlsx";
import {
  COLUNAS_PLANO,
  SEIS_M,
  STATUS_PLANO,
  linhaPlanoVazia,
  rmrVazio,
  rmrVazioDeFato,
  type LinhaPlano,
  type Rmr,
} from "@/lib/rmr";
import { sugestaoDoMes } from "@/lib/rmrSugestao";

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
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState("");

  const pessoa = pessoas.find((p) => p.chave === pessoaChave) ?? pessoas[0];

  const sugestao = useMemo(
    () =>
      pessoa
        ? sugestaoDoMes(pessoa, mes, reaisPorMes[mes] ?? {}, metasPorMes[mes] ?? {})
        : { resultado: [], priorizacao: [] },
    [pessoa, mes, reaisPorMes, metasPorMes]
  );

  const registro = salvos.find((s) => s.mes === mes && s.pessoa === pessoaChave) ?? null;

  // Trocar de mês ou de pessoa troca o documento inteiro. Relatório que ainda
  // não existe nasce com as seções 1 e 2 já preenchidas pelo painel.
  useEffect(() => {
    if (registro) {
      setDoc(registro.conteudo);
    } else {
      setDoc({ ...rmrVazio(), resultado: sugestao.resultado, priorizacao: sugestao.priorizacao });
    }
    setAviso("");
    // `sugestao` só muda junto com mes/pessoa, que são as dependências reais.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mes, pessoaChave]);

  const alterar = useCallback(<K extends keyof Rmr>(campo: K, valor: Rmr[K]) => {
    setDoc((d) => ({ ...d, [campo]: valor }));
  }, []);

  async function salvar() {
    if (!pessoa) return;
    setSalvando(true);
    setAviso("");
    try {
      const r = await fetch("/api/dashboard/indicadores/rmr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unidade: unidadeSlug, mes, pessoa: pessoa.chave, conteudo: doc }),
      });
      if (!r.ok) {
        const corpo = (await r.json().catch(() => null)) as { error?: string } | null;
        setAviso(corpo?.error ?? "Não foi possível salvar.");
        return;
      }
      setAviso(`Salvo às ${new Date().toLocaleTimeString("pt-BR")}.`);
    } catch {
      setAviso("Falha ao salvar — verifique a conexão.");
    } finally {
      setSalvando(false);
    }
  }

  /** Repõe as seções 1 e 2 com os números de agora, sem tocar no texto escrito. */
  function recarregarNumeros() {
    setDoc((d) => ({ ...d, resultado: sugestao.resultado, priorizacao: sugestao.priorizacao }));
    setAviso("Seções 1 e 2 atualizadas com os lançamentos do painel.");
  }

  function exportar() {
    if (!pessoa) return;
    const linhas: Celula[][] = [
      [`RMR | ${rotuloMes(mes).toUpperCase()} — ${pessoa.nome}`, "DIAGNÓSTICO E PLANO DE AÇÃO"],
      [],
      ["A narrativa do ciclo:", doc.narrativa],
      [],
      ["1. RESULTADO — O QUE OS INDICADORES MOSTRAM"],
      ["Indicador", "Realizado", "Meta / referência", "Desvio / leitura"],
      ...doc.resultado.map((l): Celula[] => [l.indicador, l.realizado, l.meta, l.leitura]),
      [],
      ["2. PRIORIZAÇÃO — DESVIO DO CICLO"],
      ["Indicador com desvio", "GAP vs meta", "Desvio %"],
      ...doc.priorizacao.map((l): Celula[] => [l.indicador, l.gap, l.desvio]),
      [],
      ["3. DIAGNÓSTICO — CAUSAS POSSÍVEIS (6M)"],
      ["Dimensão", "Análise registrada"],
      ...SEIS_M.map((m): Celula[] => [m.rotulo, doc.seisM[m.chave]]),
      [],
      ["4. 5 PORQUÊS — CAMINHO ATÉ A CAUSA RAIZ"],
      ["PROBLEMA:", doc.problema],
      ["Etapa", "Análise"],
      ...doc.porques.map((p, i): Celula[] => [`Por quê? ${i + 1}`, p]),
      [],
      ["5. CAUSA RAIZ E GOVERNABILIDADE"],
      ["CAUSA RAIZ:", doc.causaRaiz],
      [
        "É acionável no meu nível?",
        doc.acionavel ? "SIM ( X )" : "SIM (   )",
        doc.precisaSuporte ? "PRECISO DE SUPORTE ( X )" : "PRECISO DE SUPORTE (   )",
      ],
      [],
      ["6. PLANO DE AÇÃO — 5W2H"],
      COLUNAS_PLANO.map((c) => c.rotulo),
      ...doc.plano.map((l): Celula[] => COLUNAS_PLANO.map((c) => l[c.chave])),
      [],
      ["7. PEDIDO DE SUPORTE — DECISÃO NECESSÁRIA"],
      ["O desvio, com número", "A causa raiz", "O que eu preciso", "O impacto de não resolver"],
      [doc.pedido.desvio, doc.pedido.causa, doc.pedido.precisa, doc.pedido.impacto],
      [],
      ["8. FECHAMENTO — MENSAGEM PARA A COORDENAÇÃO"],
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
    <div className="space-y-5">
      {/* ---------------- seleção ---------------- */}
      <section
        className="flex flex-wrap items-end gap-3 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <Campo label="Mês do relatório">
          <select value={mes} onChange={(e) => setMes(e.target.value)} className={inputCls} style={inputStyle}>
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
            onChange={(e) => setPessoaChave(e.target.value)}
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
          {registro && (
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              salvo em {new Date(registro.atualizadoEm).toLocaleDateString("pt-BR")}
              {registro.atualizadoPor ? ` por ${registro.atualizadoPor}` : ""}
            </span>
          )}
          <button
            type="button"
            onClick={exportar}
            className="rounded border px-3 py-1.5 text-sm font-semibold"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Exportar planilha
          </button>
          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="rounded px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: "var(--accent)" }}
          >
            {salvando ? "Salvando…" : "Salvar relatório"}
          </button>
        </div>

        {aviso && (
          <p className="w-full text-xs" style={{ color: "var(--text-muted)" }}>
            {aviso}
          </p>
        )}
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
          se está no ritmo, é se entregou o combinado. Dá para editar o texto da leitura.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                <th className="pb-2 pr-3">Indicador</th>
                <th className="pb-2 pr-3">Realizado</th>
                <th className="pb-2 pr-3">Meta</th>
                <th className="pb-2">Desvio / leitura</th>
              </tr>
            </thead>
            <tbody>
              {doc.resultado.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                    Nenhum indicador lançado neste mês para esta pessoa.
                  </td>
                </tr>
              )}
              {doc.resultado.map((l, i) => (
                <tr key={`${l.indicador}-${i}`} style={{ borderTop: "1px solid var(--border)" }}>
                  <td className="py-2 pr-3">{l.indicador}</td>
                  <td className="py-2 pr-3 tabular-nums">{l.realizado || "—"}</td>
                  <td className="py-2 pr-3 tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {l.meta}
                  </td>
                  <td className="py-2">
                    <input
                      value={l.leitura}
                      onChange={(e) => {
                        const nova = [...doc.resultado];
                        nova[i] = { ...nova[i], leitura: e.target.value };
                        alterar("resultado", nova);
                      }}
                      className={inputCls}
                      style={inputStyle}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Secao>

      {/* ---------------- 2. priorização ---------------- */}
      <Secao titulo="Priorização — o Top 3 desvios do ciclo" numero="2">
        <p className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
          Os três maiores desvios, do pior para o menos pior. A ordem define por onde a reunião
          começa.
        </p>
        {doc.priorizacao.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Nenhum indicador abaixo da meta neste mês.
          </p>
        ) : (
          <ol className="space-y-2">
            {doc.priorizacao.map((l, i) => (
              <li key={`${l.indicador}-${i}`} className="flex flex-wrap items-baseline gap-x-3 text-sm">
                <b>{i + 1}.</b>
                <span className="font-semibold">{l.indicador}</span>
                <span className="tabular-nums" style={{ color: "var(--text-muted)" }}>
                  {l.gap}
                </span>
                <span className="font-bold tabular-nums" style={{ color: "#B45309" }}>
                  desvio de {l.desvio}
                </span>
              </li>
            ))}
          </ol>
        )}
      </Secao>

      {/* ---------------- 3. 6M ---------------- */}
      <Secao titulo="Diagnóstico — causas possíveis (6M)" numero="3">
        <div className="grid gap-3 md:grid-cols-2">
          {SEIS_M.map((m) => (
            <div key={m.chave}>
              <label className="block text-xs font-bold" htmlFor={`m-${m.chave}`}>
                {m.rotulo}
              </label>
              <span className="mb-1 block text-[11px]" style={{ color: "var(--text-muted)" }}>
                {m.dica}
              </span>
              <AreaTexto
                id={`m-${m.chave}`}
                valor={doc.seisM[m.chave]}
                onChange={(v) => alterar("seisM", { ...doc.seisM, [m.chave]: v })}
                linhas={3}
              />
            </div>
          ))}
        </div>
      </Secao>

      {/* ---------------- 4. 5 porquês ---------------- */}
      <Secao titulo="5 Porquês — caminho até a causa raiz" numero="4">
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
        <div className="mt-3 space-y-2">
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
              />
            </div>
          ))}
        </div>
      </Secao>

      {/* ---------------- 5. causa raiz ---------------- */}
      <Secao titulo="Causa raiz e governabilidade" numero="5">
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

      {/* ---------------- 6. plano 5W2H ---------------- */}
      <Secao
        titulo="Plano de ação — 5W2H"
        numero="6"
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

      {/* ---------------- 7. pedido de suporte ---------------- */}
      <Secao titulo="Pedido de suporte — decisão necessária" numero="7">
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

      {/* ---------------- 8. fechamento ---------------- */}
      <Secao titulo="Fechamento — mensagem para a coordenação" numero="8">
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
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold">
          {numero && (
            <span className="mr-2 text-sm font-bold" style={{ color: "var(--accent)" }}>
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
