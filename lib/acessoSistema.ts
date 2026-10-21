// Níveis de acesso ao SISTEMA — o eixo que diz o que a pessoa abre no Hub:
// dashboard, /admin, equipamentos e quais módulos do playbook. O que ela vê
// DENTRO do Painel de Indicadores é o outro eixo (`nivel_painel`), em
// lib/permissaoIndicadores.ts.
//
//   bdr / closer  operação: os módulos do playbook do cargo.
//   root          administrador: dashboard, /admin, equipamentos e o painel de
//                 qualquer unidade.
//   owner         acesso irrestrito: tudo que o root abre, e sem depender de
//                 configuração nenhuma.
//
// A diferença entre root e owner é o que acontece quando FALTA configuração.
// Root é um papel configurado: sem unidade e sem nível no painel, o root não
// abre o Painel de Indicadores — falha fechado, e isso é de propósito, para
// ninguém ver meta individual por acidente. O owner não passa por essa porta:
// ele é o dono do sistema e enxerga tudo mesmo sem vínculo, no nível mais alto
// de cada tela.
//
// Criado em 21/10/2026, a pedido do dono do projeto.

export const NIVEIS_SISTEMA = ["bdr", "closer", "root", "owner"] as const;

export type AccessLevel = (typeof NIVEIS_SISTEMA)[number];

/** Dono do sistema: ignora vínculo e nível, vê tudo. */
export function ehOwner(nivel: string | null | undefined): boolean {
  return nivel === "owner";
}

/**
 * Quem abre o que é restrito a administrador — exatamente o que antes se
 * checava como `accessLevel === "root"`. Owner entra aqui por definição: toda
 * porta que o root abre, ele abre também.
 */
export function ehAdministrador(nivel: string | null | undefined): boolean {
  return nivel === "root" || ehOwner(nivel);
}
