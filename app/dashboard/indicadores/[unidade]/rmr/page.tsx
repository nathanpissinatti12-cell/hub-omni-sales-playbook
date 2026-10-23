import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FormularioRmr } from "@/components/dashboard/indicadores/FormularioRmr";
import { getUsuarioPainel, pessoasVinculadas } from "@/db/adminQueries";
import { listValores } from "@/db/indicadoresQueries";
import { listRmr } from "@/db/rmrQueries";
import { getSiteSession } from "@/lib/getSiteSession";
import { mesesValidos, unidadeComVinculos, unidadePorSlug } from "@/lib/indicadores";
import {
  painelLiberado,
  permissaoDe,
  pessoasLegiveis,
  podeAbrirUnidade,
  unidadeNoEscopo,
} from "@/lib/permissaoIndicadores";
import { normalizarRmr } from "@/lib/rmr";

export const dynamic = "force-dynamic";

/**
 * RMR — o diagnóstico mensal por pessoa. Fica em rota própria, não em painel
 * lateral: são oito seções e uma tabela de doze colunas, que espremidas ao lado
 * do painel não se preenchem.
 *
 * Os lançamentos vêm daqui, do servidor, e não de um fetch do formulário: as
 * seções 1 e 2 precisam estar preenchidas já na primeira pintura, senão a pessoa
 * vê um relatório vazio e começa a digitar número que o painel já sabe.
 */
export default async function RmrPage({ params }: { params: { unidade: string } }) {
  const cadastrada = unidadePorSlug(params.unidade);
  if (!cadastrada) notFound();

  // Mesma lista do painel: o RMR é por pessoa, e pessoa aqui é quem está
  // vinculada a um usuário desta unidade.
  const vinculada = unidadeComVinculos(cadastrada, await pessoasVinculadas(cadastrada.slug));

  const session = await getSiteSession();
  if (!session) redirect("/login");
  const usuario = await getUsuarioPainel(session.uid);

  if (!usuario || !painelLiberado(usuario)) {
    redirect(`/dashboard/indicadores/${vinculada.slug}`);
  }
  if (!podeAbrirUnidade(usuario, vinculada.slug)) {
    redirect(`/dashboard/indicadores/${usuario.unidade}`);
  }

  // Mesmo corte por função do painel: o RMR é o diagnóstico da linha individual,
  // então quem não vê a linha não vê o relatório dela.
  const unidade = unidadeNoEscopo(usuario, vinculada);

  const permissao = permissaoDe(usuario);
  const pessoas = permissao.somentePessoa
    ? unidade.pessoas.filter((p) => p.chave === permissao.somentePessoa)
    : unidade.pessoas;

  if (pessoas.length === 0) {
    return (
      <div className="tema-claro space-y-4">
        <Voltar unidade={unidade.slug} />
        <h1 className="text-2xl font-semibold">RMR — {unidade.nome}</h1>
        <p className="rounded-lg border p-4 text-sm" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
          O RMR é por pessoa, e ninguém desta unidade está vinculado a uma linha do N5 — então não
          há relatório a preencher. O vínculo é feito em /admin → Permissões, escolhendo a unidade,
          o nível e a pessoa; assim que existir, cada um terá o seu relatório aqui.
        </p>
      </div>
    );
  }

  const [valores, relatorios] = await Promise.all([
    listValores(unidade.slug),
    // Mesma função da API, para a página não ter a sua própria versão da regra.
    listRmr(unidade.slug, pessoasLegiveis(usuario, unidade)),
  ]);

  // Os lançamentos chegam como lista; o formulário precisa deles por mês, no
  // mesmo formato que o painel usa (chave -> texto digitado).
  const reaisPorMes: Record<string, Record<string, string>> = {};
  const metasPorMes: Record<string, Record<string, number | null>> = {};
  for (const v of valores) {
    if (v.tipo === "real") {
      reaisPorMes[v.mes] = reaisPorMes[v.mes] || {};
      reaisPorMes[v.mes][v.chave] = v.valor ?? "";
    } else {
      metasPorMes[v.mes] = metasPorMes[v.mes] || {};
      metasPorMes[v.mes][v.chave] = v.valor === null ? null : Number(v.valor);
    }
  }

  return (
    <div className="tema-claro space-y-6">
      <div>
        <Voltar unidade={unidade.slug} />
        <h1 className="mt-2 text-2xl font-semibold">RMR — {unidade.nome}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Diagnóstico e plano de ação do mês · resultado → 5 porquês → causa raiz → 5W2H
        </p>
      </div>

      <FormularioRmr
        unidadeSlug={unidade.slug}
        unidadeNome={unidade.nome}
        pessoas={pessoas}
        meses={mesesValidos()}
        reaisPorMes={reaisPorMes}
        metasPorMes={metasPorMes}
        salvos={relatorios.map((r) => ({
          mes: r.mes,
          pessoa: r.pessoa,
          conteudo: normalizarRmr(r.conteudo),
          atualizadoEm: r.atualizadoEm,
          atualizadoPor: r.atualizadoPor,
        }))}
      />
    </div>
  );
}

function Voltar({ unidade }: { unidade: string }) {
  return (
    <Link
      href={`/dashboard/indicadores/${unidade}`}
      className="text-sm hover:underline"
      style={{ color: "var(--text-muted)" }}
    >
      ← Voltar ao painel
    </Link>
  );
}
