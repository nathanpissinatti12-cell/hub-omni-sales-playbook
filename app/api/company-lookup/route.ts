import { NextResponse } from "next/server";
import { getSiteSession } from "@/lib/getSiteSession";
import { getCompanyLookup, saveCompanyLookup } from "@/db/adminQueries";
import { normalizeDomain, fetchSiteContent, fetchRegistryData, summarizeCompany } from "@/lib/companyLookup";

export const dynamic = "force-dynamic";

const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

export async function POST(req: Request) {
  const session = await getSiteSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { domain?: string } | null;
  const domain = normalizeDomain(body?.domain ?? "");
  if (!domain) {
    return NextResponse.json({ error: "Domínio inválido." }, { status: 400 });
  }

  const cached = await getCompanyLookup(domain);
  if (cached && Date.now() - new Date(cached.created_at).getTime() < CACHE_MAX_AGE_MS) {
    return NextResponse.json({ ...cached, cached: true });
  }

  const site = await fetchSiteContent(domain);
  const cnpj = site?.cnpj ?? null;
  const registryData = cnpj ? await fetchRegistryData(cnpj) : null;
  const summary = await summarizeCompany(domain, site?.text ?? null, registryData);

  const saved = await saveCompanyLookup({
    domain,
    cnpj,
    registryData,
    summary,
    siteFetchOk: !!site,
    lookedUpBy: session.uid,
  });

  return NextResponse.json({ ...saved, cached: false });
}
