// Classifica a descrição livre de cnae_principal em um grupo amplo de setor.
// Não temos o código CNAE, só o texto — então usamos o padrão de prefixo/palavra-chave
// que a nomenclatura oficial do CNAE segue (quase sempre começa com o tipo de atividade).
const RULES: { test: RegExp; group: string }[] = [
  { test: /^(comércio|lojas de departamentos)/i, group: "Comércio" },
  { test: /^(fabricação|confecção|preparação|frigorífico|moagem|beneficiamento|abate)/i, group: "Indústria / Fabricação" },
  { test: /(^construção|\bobras\b|instalação e manutenção)/i, group: "Construção" },
  { test: /(transporte|armazéns|armazenagem|logística|agenciamento de cargas|carga e descarga|operador portuário|rodovias, pontes|comissaria de despachos|marítim|despachante)/i, group: "Transporte e Logística" },
  { test: /(saúde|hospital|médic|clínic|\buti\b|quimioterapia|hemoterapia|diagnóstic|odont|farmac|plano de saúde|assistência a paciente|fisioterapia|diálise|assistência a deficientes|longa permanência|convalescentes|tomografia|ressonância|enfermagem)/i, group: "Saúde" },
  { test: /(programas de computador|tecnologia da informação|provedores de conteúdo|tratamento de dados|comunicação multimídia|provedores de acesso|consultoria em tecnologia|hospedagem na internet)/i, group: "Tecnologia / TI" },
  { test: /(banco|segur|corretor|corretora|títulos e valores|cartões de crédito|previdência|securitização|investimentos|instituições financeiras|serviços financeiros|cooperativa.*crédito|cobrança e informações cadastrais|\bfundos\b)/i, group: "Financeiro e Seguros" },
  { test: /(imobiliári|imóve|incorporação de empreendimentos)/i, group: "Imobiliário" },
  { test: /(advocatíc|contabilidade|auditoria|engenharia|consultoria em gestão|fiscalização profissional|cartório)/i, group: "Serviços Profissionais" },
  { test: /(educaç|\bensino\b|treinamento em desenvolvimento profissional)/i, group: "Educação" },
  { test: /(extração de|indústrias extrativas)/i, group: "Indústria / Fabricação" },
  { test: /(restaurantes|lanchonetes|alimentos preparados)/i, group: "Alimentação" },
  { test: /(holding|sociedades de participação|gestão de ativos intangíveis)/i, group: "Holdings e Participações" },
  { test: /administração pública/i, group: "Administração Pública" },
  { test: /(publicidade|marketing direto)/i, group: "Publicidade e Marketing" },
  { test: /(cultivo|pecuária|agricultura|agropecuári)/i, group: "Agropecuária" },
  { test: /(agências de viagens|turismo)/i, group: "Turismo" },
  { test: /(apoio administrativo|associ|teleatendimento|locação|aluguel|recursos humanos)/i, group: "Serviços Administrativos" },
];

export function classifyCnae(description: string | null): string {
  if (!description || description.trim() === "") return "Não informado";
  for (const rule of RULES) {
    if (rule.test.test(description)) return rule.group;
  }
  return "Outros";
}
