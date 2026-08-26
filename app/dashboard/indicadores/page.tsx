import Link from "next/link";
import { PainelIndicadores } from "@/components/dashboard/indicadores/PainelIndicadores";

export const dynamic = "force-dynamic";

export default function PainelIndicadoresPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm hover:underline" style={{ color: "var(--text-muted)" }}>
          ← Voltar ao dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Painel de Indicadores</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          N3 Head · N4 Supervisão · N5 Operação · Meta proporcional por dia útil
        </p>
      </div>

      <PainelIndicadores />
    </div>
  );
}
