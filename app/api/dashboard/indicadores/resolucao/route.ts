import { NextResponse } from "next/server";
import { getUsuarioPainel, pessoasVinculadas } from "@/db/adminQueries";
import { mesFechado, upsertResolucao } from "@/db/indicadoresQueries";
import { getSiteSession } from "@/lib/getSiteSession";
import { mesesValidos, unidadeComVinculos, unidadePorSlug } from "@/lib/indicadores";
import { painelLiberado, podeGravarResolucao, type UsuarioPainel } from "@/lib/permissaoIndicadores";

export const dynamic = "force-dynamic";

/**
 * Resolução da prioridade do mês. Rota própria, separada dos lançamentos: o
 * corpo é texto livre e a permissão é por PESSOA, não por chave de indicador.
 *
 * A leitura vem junto do GET de /api/dashboard/indicadores — é a mesma tela, e
 * uma chamada a menos na abertura.
 */
export async function POST(req: Request) {
  const session = await getSiteSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const usuario = await getUsuarioPainel(session.uid);
  if (!usuario || !painelLiberado(usuario)) {
    return NextResponse.json({ error: "Sem acesso ao painel." }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    unidade?: string;
    mes?: string;
    pessoa?: string;
    texto?: string;
  } | null;

  const bruta = unidadePorSlug(body?.unidade?.trim());
  if (!bruta) return NextResponse.json({ error: "Unidade desconhecida." }, { status: 400 });
  // Mesmo N5 da tela: quem não está vinculado não existe para esta rota.
  const unidade = unidadeComVinculos(bruta, await pessoasVinculadas(bruta.slug));

  const mes = body?.mes?.trim();
  if (!mes || !mesesValidos().includes(mes)) {
    return NextResponse.json({ error: "Mês fora dos ciclos do painel." }, { status: 400 });
  }

  const pessoa = body?.pessoa?.trim() ?? "";
  if (!podeGravarResolucao(usuario as UsuarioPainel, unidade, pessoa)) {
    return NextResponse.json(
      { error: "Você só pode escrever a resolução da sua linha." },
      { status: 403 }
    );
  }

  // Mês fechado trava aqui também: depois do fechamento, o que vale é o RMR
  // daquele mês — a anotação corrente deixou de ser corrente.
  if (await mesFechado(unidade.slug, mes)) {
    return NextResponse.json(
      { error: "Mês fechado. Reabra o mês antes de escrever.", mesFechado: true },
      { status: 409 }
    );
  }

  // Limite generoso, mas limite: é um campo de texto aberto exposto numa API.
  const texto = (body?.texto ?? "").slice(0, 4000);

  await upsertResolucao({
    unidade: unidade.slug,
    mes,
    pessoa,
    texto,
    por: session.uid,
  });

  return NextResponse.json({ ok: true });
}
