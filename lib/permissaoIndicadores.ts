// Quem enxerga o quê no Painel de Indicadores.
//
// Regra, definida pelo dono do projeto em 15/10/2026:
//   root        → Head: vê N3, N4 e o N5 inteiro, de qualquer unidade, e lança
//                 tudo (realizado e meta).
//   colaborador → vê N4 e SÓ a própria linha do N5, apenas na unidade dele, e
//                 lança apenas o próprio realizado. Nunca vê N3, nunca vê nota
//                 ou meta de colega, nunca edita meta.
//
// Isto é só o cálculo da permissão. O bloqueio de verdade é feito em dois
// lugares: na página (o que renderiza) e, principalmente, na rota de API — a
// tela esconder não é proteção, porque qualquer um pode chamar a API direto.

import { unidadePorSlug, type Unidade } from "./indicadores";

export type UsuarioPainel = {
  accessLevel: string;
  unidade: string | null;
  pessoaChave: string | null;
};

export type Permissao = {
  ehHead: boolean;
  verN3: boolean;
  /** null = todas as pessoas do N5; string = só essa chave. */
  somentePessoa: string | null;
  podeEditarMeta: boolean;
  podeLimparMes: boolean;
  podeExportar: boolean;
  /** Unidades que o usuário pode abrir. */
  unidadesPermitidas: string[];
};

export function ehHead(usuario: UsuarioPainel): boolean {
  return usuario.accessLevel === "root";
}

export function permissaoDe(usuario: UsuarioPainel): Permissao {
  if (ehHead(usuario)) {
    return {
      ehHead: true,
      verN3: true,
      somentePessoa: null,
      podeEditarMeta: true,
      podeLimparMes: true,
      podeExportar: true,
      unidadesPermitidas: [],
    };
  }
  return {
    ehHead: false,
    verN3: false,
    somentePessoa: usuario.pessoaChave,
    podeEditarMeta: false,
    podeLimparMes: false,
    podeExportar: false,
    unidadesPermitidas: usuario.unidade ? [usuario.unidade] : [],
  };
}

/** Colaborador sem unidade ou sem pessoa vinculada não tem painel nenhum. */
export function painelLiberado(usuario: UsuarioPainel): boolean {
  if (ehHead(usuario)) return true;
  return Boolean(usuario.unidade && usuario.pessoaChave && unidadePorSlug(usuario.unidade));
}

export function podeAbrirUnidade(usuario: UsuarioPainel, slug: string): boolean {
  if (ehHead(usuario)) return true;
  return painelLiberado(usuario) && usuario.unidade === slug;
}

/**
 * Chaves de lançamento que o usuário pode LER naquela unidade. Head lê tudo
 * (devolve null). Colaborador lê o N4 e as próprias linhas do N5 — nada de N3,
 * nada de colega.
 */
export function chavesLegiveis(usuario: UsuarioPainel, unidade: Unidade): Set<string> | null {
  if (ehHead(usuario)) return null;

  const permitidas = new Set<string>();
  for (const linha of unidade.n4) {
    if ("id" in linha) permitidas.add(linha.id);
  }
  const pessoa = unidade.pessoas.find((p) => p.chave === usuario.pessoaChave);
  if (pessoa) {
    for (const kpi of pessoa.kpis) permitidas.add(`${pessoa.chave}_${kpi.id}`);
  }
  return permitidas;
}

/**
 * Pode gravar esse lançamento? Colaborador só grava realizado das próprias
 * linhas do N5 — nem meta, nem N3/N4, nem linha de colega.
 */
export function podeGravar(
  usuario: UsuarioPainel,
  args: { unidade: string; tipo: "real" | "meta"; chave: string }
): boolean {
  if (ehHead(usuario)) return true;
  if (!painelLiberado(usuario)) return false;
  if (usuario.unidade !== args.unidade) return false;
  if (args.tipo !== "real") return false;
  return args.chave.startsWith(`${usuario.pessoaChave}_`);
}
