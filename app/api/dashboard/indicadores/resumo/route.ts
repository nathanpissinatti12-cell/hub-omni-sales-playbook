import { NextResponse } from "next/server";
import { listFechamentos, listValores } from "@/db/indicadoresQueries";
import { UNIDADES, anoPainelPadrao, mesesValidos, unidadePorSlug } from "@/lib/indicadores";
import { iso, limitesMes } from "@/lib/indicadoresCalc";
import { montarResumo, type ResumoUnidade } from "@/lib/resumoIndicadores";

export const dynamic = "force-dynamic";

/**
 * Resumo do mês para automação (mensagem semanal no n8n/Take): o que está fora
 * do ritmo e quem ainda não lançou, por unidade.
 *
 * Autenticação por token no cabeçalho, não por sessão: quem chama é um robô,
 * que não tem cookie de login. O token vive em INDICADORES_RESUMO_TOKEN e NÃO
 * tem valor padrão — sem a variável definida a rota responde 503 e não devolve
 * nada, porque aqui sai desempenho individual de todas as unidades e uma rota
 * aberta vazaria isso para qualquer um com a URL.
 */
function autorizado(req: Request): boolean {
  const esperado = process.env.INDICADORES_RESUMO_TOKEN;
  if (!esperado) return false;
  const cabecalho = req.headers.get("authorization") ?? "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : cabecalho;
  // Comparação de tamanho fixo não importa aqui (o token não é derivado de
  // segredo do usuário), mas exigir o prefixo evita aceitar cabeçalho vazio.
  return token.length > 0 && token === esperado;
}

export async function GET(req: Request) {
  if (!process.env.INDICADORES_RESUMO_TOKEN) {
    return NextResponse.json(
      { error: "Resumo não configurado: defina INDICADORES_RESUMO_TOKEN." },
      { status: 503 }
    );
  }
  if (!autorizado(req)) {
    return NextResponse.json({ error: "Token inválido." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const hoje = new Date();
  const mesCorrente = `${anoPainelPadrao(hoje)}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  const mes = searchParams.get("mes")?.trim() || mesCorrente;
  if (!mesesValidos().includes(mes)) {
    return NextResponse.json({ error: "Mês fora dos ciclos do painel." }, { status: 400 });
  }

  // Corte: hoje quando o mês é o corrente, senão o último dia do mês — um
  // resumo de mês passado precisa comparar com o mês inteiro, não com "hoje".
  const limites = limitesMes(`${mes}-15`);
  const hojeIso = iso(hoje);
  const ate = hojeIso > limites.fim ? limites.fim : hojeIso < limites.ini ? limites.ini : hojeIso;

  const filtro = searchParams.get("unidade")?.trim();
  const alvo = filtro ? [unidadePorSlug(filtro)].filter((u) => u !== null) : UNIDADES;
  if (filtro && alvo.length === 0) {
    return NextResponse.json({ error: "Unidade desconhecida." }, { status: 400 });
  }

  const unidades: ResumoUnidade[] = [];
  for (const unidade of alvo) {
    // Unidade sem indicadores definidos (hoje o Mkt) não entra: não há o que
    // cobrar de quem ainda não tem meta.
    if (!unidade.temDefinicao) continue;
    const [valores, fechamentos] = await Promise.all([
      listValores(unidade.slug),
      listFechamentos(unidade.slug),
    ]);
    unidades.push(
      montarResumo({
        unidade,
        mes,
        valores,
        fechado: fechamentos.some((f) => f.mes === mes),
        ini: limites.ini,
        ate,
      })
    );
  }

  return NextResponse.json({ mes, ate, geradoEm: new Date().toISOString(), unidades });
}
