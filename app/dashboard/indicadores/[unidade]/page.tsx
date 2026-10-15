import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PainelIndicadores } from "@/components/dashboard/indicadores/PainelIndicadores";
import { getUsuarioPainel } from "@/db/adminQueries";
import { getSiteSession } from "@/lib/getSiteSession";
import { unidadePorSlug } from "@/lib/indicadores";
import { painelLiberado, permissaoDe, podeAbrirUnidade } from "@/lib/permissaoIndicadores";

export const dynamic = "force-dynamic";

export default async function PainelIndicadoresUnidadePage({ params }: { params: { unidade: string } }) {
  const unidade = unidadePorSlug(params.unidade);
  if (!unidade) notFound();

  // O middleware já garantiu que existe sessão; aqui resolvemos O QUE a pessoa
  // vê. O vínculo vem do banco a cada abertura, não do cookie.
  const session = await getSiteSession();
  if (!session) redirect("/login");
  const usuario = await getUsuarioPainel(session.uid);

  if (!usuario || !painelLiberado(usuario)) {
    return (
      <div className="tema-claro">
        <Aviso titulo="Você ainda não tem acesso a este painel">
          O Painel de Indicadores mostra meta e desempenho individual, então o acesso é dado pessoa a
          pessoa. Peça a um administrador para vincular seu usuário a uma unidade e à sua linha do
          N5.
        </Aviso>
      </div>
    );
  }

  // Colaborador que tentou outra unidade vai para a dele, em vez de ver erro.
  if (!podeAbrirUnidade(usuario, unidade.slug)) {
    redirect(`/dashboard/indicadores/${usuario.unidade}`);
  }

  const permissao = permissaoDe(usuario);
  const pessoa = permissao.somentePessoa
    ? unidade.pessoas.find((p) => p.chave === permissao.somentePessoa)
    : null;

  return (
    <div className="tema-claro space-y-6">
      <div>
        {permissao.ehHead && (
          <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>
            ← Voltar ao dashboard
          </Link>
        )}
        <h1 className="mt-2 text-2xl font-semibold">Painel de Indicadores — {unidade.nome}</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          {permissao.ehHead
            ? "N3 Head · N4 Supervisão · N5 Operação · Meta proporcional por dia útil"
            : `N4 Supervisão · N5 de ${pessoa?.nome ?? "você"} · Meta proporcional por dia útil`}
        </p>
      </div>

      {!unidade.temDefinicao ? (
        <Aviso titulo="Indicadores ainda não definidos">
          O {unidade.nome} tem indicadores próprios, diferentes das unidades comerciais, e a lista
          ainda não foi fechada. Enquanto isso o painel fica vazio de propósito — mostrar meta de MRR
          e de reunião aqui seria número de outra operação.
        </Aviso>
      ) : permissao.somentePessoa && !pessoa ? (
        <Aviso titulo="Seu usuário aponta para uma pessoa que não está nesta unidade">
          O vínculo do seu usuário está desatualizado: a pessoa indicada não aparece no time de{" "}
          {unidade.nome}. Peça a um administrador para corrigir — enquanto isso, nada é mostrado,
          para não exibir o número de outra pessoa.
        </Aviso>
      ) : (
        <PainelIndicadores unidade={unidade} permissao={permissao} />
      )}
    </div>
  );
}

function Aviso({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
      <h2 className="text-lg font-semibold">{titulo}</h2>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
        {children}
      </p>
    </section>
  );
}
