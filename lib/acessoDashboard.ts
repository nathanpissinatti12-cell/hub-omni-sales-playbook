// Porta do Dashboard de Prospecção, usada pelas páginas e pelas rotas de API
// dele. Uma função só para os quatro lugares não terem cada um a sua versão da
// regra — foi assim que o menu passou meses mostrando link para tela que a
// pessoa não conseguia abrir.
import { getUsuarioPainel } from "@/db/adminQueries";
import { getSiteSession } from "@/lib/getSiteSession";
import { podeVerDashboard, type UsuarioPainel } from "@/lib/permissaoIndicadores";

/**
 * O usuário, se ele pode ver o dashboard; null se não pode (ou não está
 * logado). O nível vem do banco a cada chamada, não do cookie.
 */
export async function quemVeDashboard(): Promise<UsuarioPainel | null> {
  const session = await getSiteSession();
  if (!session) return null;
  const usuario = await getUsuarioPainel(session.uid);
  if (!usuario || !podeVerDashboard(usuario)) return null;
  return usuario;
}
