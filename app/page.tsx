import Link from "next/link";
import { PLAYBOOK_VISIVEL } from "@/lib/playbookVisivel";

// O playbook está oculto (lib/playbookVisivel.ts), então esta tela não se
// apresenta mais como "Playbook de Vendas" nem oferece o botão que levaria a
// uma área escondida. O bloco dele continua aqui, atrás da chave: voltar a
// mostrar é trocar o `false` por `true`, e nada nesta página muda de lugar.
export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">
        {PLAYBOOK_VISIVEL ? "Playbook de Vendas" : "Hub Onvox"}
      </h1>
      <p style={{ color: "var(--text-muted)" }}>
        {PLAYBOOK_VISIVEL
          ? "Central do processo comercial: consulte o playbook do funil ou acompanhe os números em tempo real no dashboard."
          : "Central do processo comercial: acompanhe os indicadores e os números do funil."}
      </p>
      <div className="flex gap-4 pt-2">
        {PLAYBOOK_VISIVEL && (
          <Link
            href="/playbook"
            className="rounded-md px-4 py-2 text-sm font-medium"
            style={{ background: "var(--accent)", color: "var(--on-accent)" }}
          >
            Ver Playbook
          </Link>
        )}
        {/* Com o playbook oculto, este deixa de ser o botão secundário. */}
        <Link
          href="/dashboard"
          className="rounded-md px-4 py-2 text-sm font-medium"
          style={
            PLAYBOOK_VISIVEL
              ? { border: "1px solid var(--border)" }
              : { background: "var(--accent)", color: "var(--on-accent)" }
          }
        >
          Ver Dashboard
        </Link>
      </div>
    </div>
  );
}
