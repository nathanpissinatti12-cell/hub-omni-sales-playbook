// Mesma lógica de validação/classificação de telefone do nó "Monta Payload
// Meetime" do fluxo Apollo no n8n — duplicada aqui de propósito porque o
// fluxo roda fora deste repo. Se um dia mudar lá, tem que mudar aqui também.

function digitsOnly(v: string | null | undefined): string {
  return String(v || "").replace(/\D/g, "");
}

/** Devolve o número nacional (DDD + assinante) só se for discável no Brasil, senão null. */
export function numeroNacional(bruto: string | null | undefined): string | null {
  let d = digitsOnly(bruto);
  if (!d) return null;
  if (/^0+$/.test(d)) return null;
  if ((d.length === 12 || d.length === 13) && d.slice(0, 2) === "55") d = d.slice(2);
  const ddd = Number(d.slice(0, 2));
  if (!(ddd >= 11 && ddd <= 99)) return null;
  const assinante = d.slice(2);
  if (d.length === 11 && /^9/.test(assinante)) return d;
  if (d.length === 10 && /^[2-5]/.test(assinante)) return d;
  return null;
}

export function classificaTelefone(bruto: string | null | undefined): "celular" | "fixo" | null {
  const d = numeroNacional(bruto);
  if (!d) return null;
  return d.length === 11 ? "celular" : "fixo";
}

function temTipo(lista: string[], tipo: "celular" | "fixo"): boolean {
  return lista.some((t) => classificaTelefone(t) === tipo);
}

export type TierTelefone = "apollo_celular" | "so_fixo" | "outra_fonte_celular" | "sem_dado";

/**
 * Classifica o par (telefone_decisor, todos_telefones) na mesma prioridade do
 * fluxo: celular do Apollo > fixo sem celular real > celular de outra fonte.
 * Não dá pra saber a nota exata (6 vs 5, 4 vs 3) porque isso depende da origem
 * do e-mail, que o fluxo não grava em `empresas`.
 */
export function tierTelefone(telefoneDecisor: string | null, todosTelefones: string | null): TierTelefone {
  const telsApollo = String(telefoneDecisor || "").split(" / ").filter(Boolean);
  const telsTodos = String(todosTelefones || "").split(" / ").filter(Boolean);
  const telsOutraFonte = telsTodos.filter((t) => !telsApollo.includes(t));

  const celularApollo = temTipo(telsApollo, "celular");
  const temFixo = temTipo(telsTodos, "fixo");
  const celularOutraFonte = !celularApollo && temTipo(telsOutraFonte, "celular");

  if (celularApollo) return "apollo_celular";
  if (temFixo) return "so_fixo";
  if (celularOutraFonte) return "outra_fonte_celular";
  return "sem_dado";
}
