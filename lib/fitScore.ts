// Escala "Qualidade do Dado" (1 a 6) atribuída pelo fluxo Apollo no n8n e lida
// pela Meetime para calcular o Fit Score exibido na fila de ligações.
//
// A nota do Fit Score não é a soma dos pontos: a Meetime normaliza os pontos
// configurados em Prospecção > Ajustes > Fit Score entre o pior e o melhor
// perfil possível. Por isso os pontos (+25, +5, -5, -10, -20, -40) não são
// iguais às notas exibidas.

/** Quão confiável é a origem de um contato. */
export type NivelOrigem = "boa" | "media" | "ausente";

export type Contato = {
  /** De onde veio o dado, como o vendedor reconhece: "Apollo", "Google · Receita"... */
  origem: string;
  nivel: NivelOrigem;
};

export type FaixaQualidade = {
  /** Valor gravado no campo "Qualidade do Dado" da Meetime. */
  qualidade: number;
  /** Nota que a Meetime exibe no Fit Score com a configuração de pontos atual. */
  fitScore: number;
  fixo: Contato;
  movel: Contato;
  email: Contato;
  /** O que falta nesse lead em relação ao cenário perfeito. */
  falta: string;
};

export const FAIXAS: FaixaQualidade[] = [
  {
    qualidade: 6,
    fitScore: 10,
    fixo: { origem: "Válido", nivel: "boa" },
    movel: { origem: "Apollo", nivel: "boa" },
    email: { origem: "Do gestor", nivel: "boa" },
    falta: "Nada falta. Os três contatos existem e vieram da melhor fonte.",
  },
  {
    qualidade: 5,
    fitScore: 8,
    fixo: { origem: "Válido", nivel: "boa" },
    movel: { origem: "Apollo", nivel: "boa" },
    email: { origem: "Institucional", nivel: "media" },
    falta: "O e-mail é genérico — contato@, ouvidoria, contabilidade.",
  },
  {
    qualidade: 4,
    fitScore: 7,
    fixo: { origem: "Válido", nivel: "boa" },
    movel: { origem: "Não tem", nivel: "ausente" },
    email: { origem: "Do gestor", nivel: "boa" },
    falta: "Sem celular. Sobra a linha fixa, que costuma cair na recepção.",
  },
  {
    qualidade: 3,
    fitScore: 6,
    fixo: { origem: "Válido", nivel: "boa" },
    movel: { origem: "Não tem", nivel: "ausente" },
    email: { origem: "Institucional", nivel: "media" },
    falta: "Sem celular e com e-mail genérico. Contato só pela porta da frente.",
  },
  {
    qualidade: 2,
    fitScore: 5,
    fixo: { origem: "Não tem", nivel: "ausente" },
    movel: { origem: "Google · Receita", nivel: "media" },
    email: { origem: "Institucional", nivel: "media" },
    falta: "Nada veio do Apollo. O celular é da empresa, não necessariamente do gestor.",
  },
  {
    qualidade: 1,
    fitScore: 3,
    fixo: { origem: "Não tem", nivel: "ausente" },
    movel: { origem: "Google · Receita", nivel: "media" },
    email: { origem: "Do gestor", nivel: "boa" },
    falta: "Mesmo caso do 2, com o e-mail bom — a inversão está explicada abaixo.",
  },
];

export type Situacao = { titulo: string; explicacao: string };

/** As três situações de telefone que o fluxo consegue produzir. */
export const SITUACOES_TELEFONE: Situacao[] = [
  {
    titulo: "Celular do Apollo",
    explicacao: "O Apollo busca pelo nome da pessoa. O número é do gestor.",
  },
  {
    titulo: "Só fixo",
    explicacao: "Sem celular. O fixo costuma ser recepção ou contabilidade.",
  },
  {
    titulo: "Celular de outra fonte",
    explicacao: "Google ou Receita: o número é da empresa, sem garantia de quem atende.",
  },
];

/** As duas situações de e-mail. */
export const SITUACOES_EMAIL: Situacao[] = [
  {
    titulo: "Do gestor",
    explicacao: "Apollo ou Hunter procuraram pelo nome do decisor.",
  },
  {
    titulo: "Institucional",
    explicacao: "Site ou Receita. Cai em contato@, ouvidoria, RH.",
  },
];

export type Ressalva = { titulo: string; texto: string };

export const RESSALVAS: Ressalva[] = [
  {
    titulo: "Hoje o 6 não exige o telefone fixo",
    texto:
      "Quando o Apollo entrega o celular do gestor, o fluxo dá nota 6 mesmo sem linha fixa — a ideia foi que o celular validado vale mais que o fixo.",
  },
  {
    titulo: "As notas 1 e 2 estão invertidas",
    texto:
      "Em todas as outras faixas, e-mail do gestor vale mais que e-mail institucional. Nessas duas é o contrário: quem tem o e-mail melhor fica em 1, abaixo do 2. Veio assim da definição original e ficou mantido.",
  },
  {
    titulo: "O celular pode ser da empresa, não do gestor",
    texto:
      "O fluxo junta o telefone da pessoa com o telefone da organização vindos do Apollo. Se a empresa tiver um celular corporativo cadastrado lá, o lead pode pontuar 6 com um número que não é do decisor.",
  },
];
