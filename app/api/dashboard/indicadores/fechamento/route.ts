import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { getUsuarioPainel } from "@/db/adminQueries";
import { fecharMes, listFechamentos, reabrirMes } from "@/db/indicadoresQueries";
import { mesesValidos, unidadePorSlug } from "@/lib/indicadores";
import { ehHead, painelLiberado, type UsuarioPainel } from "@/lib/permissaoIndicadores";

export const dynamic = "force-dynamic";

/**
 * Fechar e reabrir mês. Só o Head: fechar é declarar que aquele mês virou
 * número oficial, e reabrir é desfazer essa declaração — nenhuma das duas é
 * decisão de quem lança o próprio realizado.
 *
 * A trava em si não mora aqui; mora na rota de lançamento, que consulta
 * indicadores_fechamento a cada gravação.
 */
export async function POST(req: Request) {
  const session = await getSiteSession();
  if (!session) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const usuario = await getUsuarioPainel(session.uid);
  if (!usuario || !painelLiberado(usuario)) {
    return NextResponse.json({ error: "Sem acesso ao painel." }, { status: 403 });
  }
  if (!ehHead(usuario as UsuarioPainel)) {
    return NextResponse.json({ error: "Acesso restrito ao Head." }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    unidade?: string;
    mes?: string;
    fechado?: boolean;
  } | null;

  const unidade = unidadePorSlug(body?.unidade?.trim());
  if (!unidade) {
    return NextResponse.json({ error: "Unidade desconhecida." }, { status: 400 });
  }

  const mes = body?.mes?.trim();
  if (!mes || !mesesValidos().includes(mes)) {
    return NextResponse.json({ error: "Mês fora dos ciclos do painel." }, { status: 400 });
  }

  if (body?.fechado) {
    await fecharMes(unidade.slug, mes, session.uid);
  } else {
    await reabrirMes(unidade.slug, mes);
  }

  // Devolve a lista inteira para a tela não precisar adivinhar o estado novo.
  return NextResponse.json({ fechamentos: await listFechamentos(unidade.slug) });
}
