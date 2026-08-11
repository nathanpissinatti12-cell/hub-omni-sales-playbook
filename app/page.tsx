import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Playbook de Vendas</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Central do processo comercial: consulte o playbook do funil ou acompanhe os
        números em tempo real no dashboard.
      </p>
      <div className="flex gap-4 pt-2">
        <Link
          href="/playbook"
          className="rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          Ver Playbook
        </Link>
        <Link
          href="/dashboard"
          className="rounded-md border px-4 py-2 text-sm font-medium"
          style={{ borderColor: "var(--border)" }}
        >
          Ver Dashboard
        </Link>
      </div>
    </div>
  );
}
