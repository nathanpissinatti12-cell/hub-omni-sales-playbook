// Playbook de Vendas oculto da interface desde 21/10/2026, a pedido do dono do
// projeto: "não apague, deixe oculto por enquanto — quando for necessário
// novamente, retomamos dessa mesma forma que já tem".
//
// Nada foi apagado. As rotas (/playbook e os seis módulos), o conteúdo em
// lib/playbookModule*.ts, a busca, o chat, a trilha de progresso e a aba
// Progresso do /admin continuam inteiros e funcionando. O que esta chave
// controla é só o que APARECE: o link do topo, os botões da página inicial e
// para onde vão os redirecionamentos que antes mandavam todo mundo ao playbook.
//
// Para retomar: troque para `true`. Não há mais nada a fazer — nenhum arquivo
// para restaurar, nenhum dado para reimportar.
//
// Enquanto está oculto, as URLs continuam respondendo para quem as digitar ou
// tiver um favorito: ocultar não é bloquear. Se um dia a ideia for fechar o
// acesso de verdade, o lugar é o middleware, redirecionando /playbook para
// DESTINO_SEM_PLAYBOOK — e vale saber que isso deixaria sem nenhuma tela quem
// só tem o playbook (hoje, um BDR sem acesso ao painel).
export const PLAYBOOK_VISIVEL = false;

/**
 * Para onde mandar quem seria mandado ao playbook enquanto ele está oculto.
 * O painel de indicadores serve a todo usuário logado: quem não tem acesso vê
 * ali a explicação do que falta, em vez de cair num lugar que não existe.
 */
export const DESTINO_SEM_PLAYBOOK = "/dashboard/indicadores";

/** Primeira tela depois do login. */
export function rotaInicial(): string {
  return PLAYBOOK_VISIVEL ? "/playbook" : DESTINO_SEM_PLAYBOOK;
}
