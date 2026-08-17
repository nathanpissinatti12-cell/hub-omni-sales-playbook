import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { getCompanyLookup, getCompanyLookupByCnpj, saveCompanyLookup } from "@/db/adminQueries";
import { parseLookupInput, fetchSiteContent, fetchRegistryData, summarizeCompany } from "@/lib/companyLookup";

export const dynamic = "force-dynamic";

const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

function formatCnpj(cnpj: string): string {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

export async function POST(req: Request) {
  const session = await getSiteSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { domain?: string } | null;
  const query = parseLookupInput(body?.domain ?? "");
  if (!query) {
    return NextResponse.json({ error: "Informe um domínio (empresa.com.br) ou um CNPJ válido." }, { status: 400 });
  }

  if (query.type === "domain") {
    const cached = await getCompanyLookup(query.value);
    if (cached && Date.now() - new Date(cached.created_at).getTime() < CACHE_MAX_AGE_MS) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const site = await fetchSiteContent(query.value);
    const cnpj = site?.cnpj ?? null;
    const registryData = cnpj ? await fetchRegistryData(cnpj) : null;
    const summary = await summarizeCompany(`Domínio pesquisado: ${query.value}`, site?.text ?? null, registryData);

    const saved = await saveCompanyLookup({
      domain: query.value,
      cnpj,
      registryData,
      summary,
      siteFetchOk: !!site,
      lookedUpBy: session.uid,
    });
    return NextResponse.json({ ...saved, cached: false });
  }

  // Busca por CNPJ direto — sem domínio, então sem conteúdo de site.
  const cachedByCnpj = await getCompanyLookupByCnpj(query.value);
  if (cachedByCnpj && Date.now() - new Date(cachedByCnpj.created_at).getTime() < CACHE_MAX_AGE_MS) {
    return NextResponse.json({ ...cachedByCnpj, cached: true });
  }

  const registryData = await fetchRegistryData(query.value);
  if (!registryData) {
    return NextResponse.json({ error: "CNPJ não encontrado na Receita Federal." }, { status: 404 });
  }
  const summary = await summarizeCompany(`CNPJ pesquisado: ${formatCnpj(query.value)}`, null, registryData);

  const saved = await saveCompanyLookup({
    domain: null,
    cnpj: query.value,
    registryData,
    summary,
    siteFetchOk: false,
    lookedUpBy: session.uid,
  });
  return NextResponse.json({ ...saved, cached: false });
}
