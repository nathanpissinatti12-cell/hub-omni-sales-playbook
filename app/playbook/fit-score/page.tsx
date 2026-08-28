import { getSiteSession } from "@/lib/getSiteSession";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { FitScoreEscala } from "@/components/playbook/FitScoreEscala";

export default async function FitScoreMeetimePage() {
  const session = await getSiteSession();
  return (
    <>
      <PlaybookSidebar activeModuleId={0} accessLevel={session?.accessLevel ?? ""} />

      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">Fit Score Meetime</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Toda empresa que o fluxo processa recebe uma nota de 1 a 6 conforme a qualidade dos contatos
            encontrados. A Meetime lê essa nota e a converte no Fit Score, que ordena a fila de ligações —
            o melhor lead fica no topo.
          </p>
        </div>

        <FitScoreEscala />
      </div>
    </>
  );
}
