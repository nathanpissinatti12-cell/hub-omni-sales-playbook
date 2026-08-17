// Pesquisa de empresa gratuita: tenta achar o CNPJ no próprio site da
// empresa, consulta o registro oficial na Receita Federal (BrasilAPI, sem
// custo) e usa a IA já configurada (DeepSeek) pra resumir tudo pro vendedor.
// Sem Apollo, sem crédito pago — trade-off: não traz faturamento real,
// funcionários ou contatos de decisores, só dado público + o que a empresa
// publica sobre si mesma.

const FETCH_TIMEOUT_MS = 8000;
// Pontuação obrigatória (formato real de CNPJ exibido em site) — sem isso,
// qualquer sequência de 14 dígitos na página (ID de analytics, telefone
// concatenado etc.) seria confundida com um CNPJ.
const CNPJ_REGEX = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/;

export function normalizeDomain(input: string): string | null {
  let value = input.trim().toLowerCase();
  value = value.replace(/^https?:\/\//, "").replace(/^www\./, "");
  value = value.split("/")[0].split("?")[0];
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(value)) return null;
  if (value === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(value)) return null;
  return value;
}

export type LookupQuery = { type: "domain"; value: string } | { type: "cnpj"; value: string };

// Aceita tanto domínio (ex. empresa.com.br) quanto CNPJ (com ou sem
// pontuação) no mesmo campo — decide qual é qual pela quantidade de dígitos.
export function parseLookupInput(input: string): LookupQuery | null {
  const trimmed = input.trim();
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.length === 14 && /^[\d.\/-]+$/.test(trimmed)) {
    return { type: "cnpj", value: digitsOnly };
  }
  const domain = normalizeDomain(trimmed);
  if (domain) return { type: "domain", value: domain };
  return null;
}

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OmniPlaybookBot/1.0)" },
    });
    return res.ok ? res : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchSiteContent(domain: string): Promise<{ text: string; cnpj: string | null } | null> {
  const paths = ["/", "/contato", "/sobre", "/quem-somos", "/about"];
  let combinedText = "";
  let cnpj: string | null = null;

  for (const path of paths) {
    const res = await fetchWithTimeout(`https://${domain}${path}`);
    if (!res) continue;
    const html = await res.text().catch(() => "");
    const text = stripHtml(html);
    combinedText += ` ${text}`;

    if (!cnpj) {
      const match = html.match(CNPJ_REGEX) || text.match(CNPJ_REGEX);
      if (match) cnpj = match[0].replace(/\D/g, "");
    }

    if (combinedText.length > 6000) break;
  }

  if (!combinedText.trim()) return null;
  return { text: combinedText.trim().slice(0, 6000), cnpj };
}

export async function fetchRegistryData(cnpj: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OmniPlaybookBot/1.0)" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function summarizeCompany(
  label: string,
  siteText: string | null,
  registryData: Record<string, unknown> | null
): Promise<string | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  const parts: string[] = [label];
  if (registryData) parts.push(`Dados oficiais da Receita Federal (JSON): ${JSON.stringify(registryData)}`);
  if (siteText) parts.push(`Texto extraído do site da empresa: ${siteText}`);
  if (!registryData && !siteText) return null;

  try {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "Você resume dados de empresas para um vendedor B2B brasileiro que vai ligar para esse prospect. " +
              "Use só as informações fornecidas, não invente nada (faturamento, número de funcionários ou contatos " +
              "não fornecidos devem ser omitidos, não estimados). Responda em português, formato: 1) o que a empresa " +
              "faz, 2) dados oficiais relevantes (setor/CNAE, porte, situação, localização), 3) um gancho de abertura " +
              "possível pra uma ligação, baseado só no que foi fornecido. Seja direto, no máximo 6 linhas.",
          },
          { role: "user", content: parts.join("\n\n") },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}
