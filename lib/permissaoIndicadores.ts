// Quem enxerga o quê no Painel de Indicadores.
//
// São DOIS eixos, de propósito — antes `access_level` fazia os dois papéis e não
// havia como representar supervisão:
//
//   access_level (sistema)  owner / root / closer / bdr
//     → o que a pessoa vê no resto do Hub (dashboard, equipamentos, admin) e se
//       pode abrir o painel de OUTRAS unidades. Root e owner atravessam
//       unidade; owner, além disso, não passa por este eixo nenhum — ver
//       lib/acessoSistema.ts.
//
//   nivel_painel (dentro do painel)  n3 / n4 / n5
//     Cada nível vê o seu e os de baixo:
//     → n3  o painel inteiro — o próprio N3, o N4 e todas as pessoas. Único
//           que edita meta.
//     → n4  o N4 e todas as pessoas, SEM o N3. Lança pelo time.
//     → n5  só a própria linha. Nem o N4 agregado: abaixo do N5 não há nada.
//     → null sem acesso nenhum ao painel.
//
// Regras definidas pelo dono do projeto: a separação dos eixos e o que cada
// nível pode, em 21/10/2026; a visão do colaborador, em 15/10/2026.
//
// O N5 enxergava os agregados do N4 até 21/10/2026, como contexto do número
// individual. Saiu quando a regra foi fechada em "cada nível vê do seu para
// baixo": o agregado do N4 soma o resultado dos colegas, e quem vê o agregado
// e a própria linha deduz o resto do time.
//
// Isto é só o cálculo. O bloqueio de verdade acontece em dois lugares: na página
// (o que renderiza) e, principalmente, na rota de API — esconder na tela não é
// proteção, porque qualquer pessoa logada chama a API direto.

import { ehAdministrador, ehOwner } from "./acessoSistema";
import { unidadePorSlug, type Unidade } from "./indicadores";

export type NivelPainel = "n3" | "n4" | "n5";

export const NIVEIS_PAINEL: { valor: NivelPainel; rotulo: string; descricao: string }[] = [
  { valor: "n3", rotulo: "N3", descricao: "Painel inteiro: N3, N4, N5 e edição de meta" },
  { valor: "n4", rotulo: "N4", descricao: "N4 e N5 do time todo, sem os números do N3" },
  { valor: "n5", rotulo: "N5", descricao: "Só a própria linha do N5" },
];

export type UsuarioPainel = {
  accessLevel: string;
  unidade: string | null;
  pessoaChave: string | null;
  nivelPainel: NivelPainel | null;
};

export type Permissao = {
  /** n3: vê o painel inteiro da unidade. O nome ficou por compatibilidade. */
  ehHead: boolean;
  verN3: boolean;
  /** Vê o N4 agregado: n3 e n4. O n5 não. */
  verN4: boolean;
  /** null = todas as pessoas do N5; string = só essa chave. */
  somentePessoa: string | null;
  podeEditarMeta: boolean;
  podeLimparMes: boolean;
  podeExportar: boolean;
  /** Unidades que o usuário pode abrir. Vazio = todas (root). */
  unidadesPermitidas: string[];
};

/**
 * Vê o painel inteiro da unidade — N3 incluído.
 *
 * O owner entra sem nível marcado: ele é o dono do sistema, e exigir que
 * alguém o cadastre como n3 em cada unidade seria configuração sem função.
 */
export function ehHead(usuario: UsuarioPainel): boolean {
  return ehOwner(usuario.accessLevel) || usuario.nivelPainel === "n3";
}

/** Vê o time inteiro: n4 por definição, e n3 porque enxerga mais que o n4. */
export function veTimeTodo(usuario: UsuarioPainel): boolean {
  return ehHead(usuario) || usuario.nivelPainel === "n4";
}

/**
 * Pode atravessar unidade. É o eixo do SISTEMA, não o do painel: o nível diz o
 * que a pessoa vê dentro da unidade dela, e ser root é o que dá o direito de
 * abrir as outras quatro.
 */
export function podeTodasUnidades(usuario: UsuarioPainel): boolean {
  return ehAdministrador(usuario.accessLevel);
}

export function permissaoDe(usuario: UsuarioPainel): Permissao {
  const n3 = ehHead(usuario);
  return {
    ehHead: n3,
    verN3: n3,
    verN4: veTimeTodo(usuario),
    // Só o n5 fica preso à própria linha; n3 e n4 veem o time.
    somentePessoa: veTimeTodo(usuario) ? null : usuario.pessoaChave,
    podeEditarMeta: n3,
    podeLimparMes: n3,
    podeExportar: n3,
    unidadesPermitidas: podeTodasUnidades(usuario) ? [] : usuario.unidade ? [usuario.unidade] : [],
  };
}

/**
 * Sem nível no painel não há painel nenhum — falha fechado, mesmo para quem é
 * root no sistema. Quem é n5 ainda precisa da pessoa vinculada, senão não há
 * linha para mostrar; n3 e n4 precisam só da unidade, porque olham o time.
 */
export function painelLiberado(usuario: UsuarioPainel): boolean {
  // Owner não passa pela porta: é o único nível que vê o painel sem vínculo.
  if (ehOwner(usuario.accessLevel)) return true;
  if (usuario.nivelPainel === null) return false;
  if (!usuario.unidade || !unidadePorSlug(usuario.unidade)) return false;
  if (usuario.nivelPainel === "n5") return Boolean(usuario.pessoaChave);
  return true;
}

export function podeAbrirUnidade(usuario: UsuarioPainel, slug: string): boolean {
  if (ehOwner(usuario.accessLevel)) return Boolean(unidadePorSlug(slug));
  if (usuario.nivelPainel === null) return false;
  if (podeTodasUnidades(usuario)) return Boolean(unidadePorSlug(slug));
  return painelLiberado(usuario) && usuario.unidade === slug;
}

/**
 * Chaves de lançamento que o usuário pode LER naquela unidade. null = todas.
 *
 * n4 recebe o time inteiro e o N4 agregado, mas não o N3: é a diferença que faz
 * o papel existir. n5 recebe só as próprias linhas.
 */
export function chavesLegiveis(usuario: UsuarioPainel, unidade: Unidade): Set<string> | null {
  if (ehHead(usuario)) return null;
  // Sem acesso ao painel, conjunto vazio — não as chaves do N4. A API já recusa
  // antes de chegar aqui, mas uma função de permissão não deve devolver nada
  // legível para quem não tem permissão nenhuma: no dia em que alguém chamar
  // isto de outro lugar, o vazamento seria silencioso.
  if (!painelLiberado(usuario)) return new Set<string>();

  const permitidas = new Set<string>();
  // O N4 agregado é leitura de supervisão — entra para o n4 e fica fora do n5.
  if (veTimeTodo(usuario)) {
    for (const linha of unidade.n4) {
      if ("id" in linha) permitidas.add(linha.id);
    }
  }

  const pessoas = veTimeTodo(usuario)
    ? unidade.pessoas
    : unidade.pessoas.filter((p) => p.chave === usuario.pessoaChave);
  for (const pessoa of pessoas) {
    for (const kpi of pessoa.kpis) permitidas.add(`${pessoa.chave}_${kpi.id}`);
  }
  return permitidas;
}

/**
 * Pessoas cujo RMR o usuário pode ler e escrever. null = todas.
 *
 * Mesma fonte que o painel usa, em vez da regra repetida dentro da rota: se
 * amanhã surgir outro nível, muda num lugar só.
 */
export function pessoasLegiveis(usuario: UsuarioPainel): string[] | null {
  // Mesma defesa de `chavesLegiveis`: sem acesso ao painel, lista vazia. Com
  // vínculo quebrado — n5 apontando para unidade que não existe — isto devolvia
  // a chave da pessoa mesmo assim.
  if (!painelLiberado(usuario)) return [];
  if (veTimeTodo(usuario)) return null;
  return usuario.pessoaChave ? [usuario.pessoaChave] : [];
}

/**
 * Pode gravar esse lançamento?
 *
 * Meta é só do n3: meta é compromisso combinado, e quem a edita precisa ver a
 * operação inteira. n4 lança realizado de qualquer pessoa do time — com uma
 * consequência que vale saber: o histórico registra o supervisor, não a pessoa.
 * n5 lança só as próprias linhas.
 */
export function podeGravar(
  usuario: UsuarioPainel,
  args: { unidade: string; tipo: "real" | "meta"; chave: string }
): boolean {
  if (!podeAbrirUnidade(usuario, args.unidade)) return false;
  if (ehHead(usuario)) return true;
  if (args.tipo !== "real") return false;

  const unidade = unidadePorSlug(args.unidade);
  if (!unidade) return false;

  if (veTimeTodo(usuario)) {
    // O N4 agregado e qualquer pessoa daquele time.
    if (unidade.n4.some((l) => "id" in l && l.id === args.chave)) return true;
    return unidade.pessoas.some((p) => args.chave.startsWith(`${p.chave}_`));
  }
  return args.chave.startsWith(`${usuario.pessoaChave}_`);
}
