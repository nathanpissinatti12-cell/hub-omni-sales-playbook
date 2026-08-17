import { getSiteSession } from "@/lib/getSiteSession";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { CompanyLookupForm } from "@/components/playbook/CompanyLookupForm";

export default async function PesquisaEmpresaPage() {
  const session = await getSiteSession();
  return (
    <>
      <PlaybookSidebar activeModuleId={0} accessLevel={session?.accessLevel ?? ""} />

      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Pesquisar Empresa</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Digite o domínio ou o CNPJ de um prospect para ver dados oficiais (Receita Federal) e um resumo
            gerado por IA — útil antes de uma ligação.
          </p>
        </div>

        <CompanyLookupForm />
      </div>
    </>
  );
}
