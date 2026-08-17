"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Target, Users, Handshake, Package, HeartHandshake, Trophy, Lock, Check, type LucideIcon } from "lucide-react";
import { isModuleAllowed } from "@/lib/playbookAccess";
import { MODULE_SECTION_COUNTS } from "@/lib/moduleSectionCounts";
import { PlaybookSearch } from "./PlaybookSearch";
import { ICPS, MODULES, MODULE_1_SECTIONS } from "@/lib/playbookModule1";
import { MODULE_2_SECTIONS } from "@/lib/playbookModule2";
import { MODULE_3_SECTIONS } from "@/lib/playbookModule3";
import { MODULE_4_SECTIONS } from "@/lib/playbookModule4";
import { MODULE_5_SECTIONS } from "@/lib/playbookModule5";
import { MODULE_6_SECTIONS } from "@/lib/playbookModule6";

const MODULE_ICONS: Record<number, LucideIcon> = {
  1: Target,
  2: Users,
  3: Handshake,
  4: Package,
  5: HeartHandshake,
  6: Trophy,
};

export function PlaybookSidebar({ activeModuleId, accessLevel }: { activeModuleId: number; accessLevel: string }) {
  // Sempre comeca recolhido, mesmo na pagina do proprio modulo ativo -
  // o usuario precisa clicar no nome do modulo pra abrir a lista de secoes.
  const [expanded, setExpanded] = useState(false);

  const [seenByModule, setSeenByModule] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { module_id: number }[]) => {
        const counts: Record<number, number> = {};
        for (const row of rows) counts[row.module_id] = (counts[row.module_id] ?? 0) + 1;
        setSeenByModule(counts);
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="w-full shrink-0 space-y-6 text-sm lg:w-64">
      <PlaybookSearch accessLevel={accessLevel} />

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Módulos
        </p>
        <ul className="space-y-1">
          {MODULES.map((m) => {
            const isActive = m.id === activeModuleId;
            const Icon = MODULE_ICONS[m.id];
            const activeStyle = isActive
              ? {
                  background: "rgba(255, 212, 0, 0.12)",
                  color: "var(--text)",
                  fontWeight: 600,
                  borderLeft: "3px solid var(--accent)",
                }
              : { color: "var(--text)", borderLeft: "3px solid transparent" };

            if (!m.available || !m.href) {
              return (
                <li key={m.id}>
                  <span
                    className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 opacity-60"
                    style={{ color: "var(--text-muted)", borderLeft: "3px solid transparent" }}
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon size={16} className="shrink-0" />}
                      <span>Módulo {m.id} — {m.title}</span>
                    </span>
                    <span className="shrink-0 text-xs">em breve</span>
                  </span>
                </li>
              );
            }

            if (!isModuleAllowed(accessLevel, m.id)) {
              return (
                <li key={m.id}>
                  <span
                    className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 opacity-50"
                    style={{ color: "var(--text-muted)", borderLeft: "3px solid transparent" }}
                    title="Módulo não liberado para o seu nível de acesso"
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon size={16} className="shrink-0" />}
                      <span>Módulo {m.id} — {m.title}</span>
                    </span>
                    <Lock size={13} className="shrink-0" aria-hidden />
                  </span>
                </li>
              );
            }

            const seen = seenByModule[m.id] ?? 0;
            const total = MODULE_SECTION_COUNTS[m.id] ?? 0;
            const complete = total > 0 && seen >= total;
            const progressBadge =
              total > 0 && seen > 0 ? (
                complete ? (
                  <Check size={13} className="shrink-0" style={{ color: "#22c55e" }} aria-hidden />
                ) : (
                  <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                    {seen}/{total}
                  </span>
                )
              ) : null;

            if (isActive) {
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left transition-colors"
                    style={activeStyle}
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon size={16} className="shrink-0" style={{ color: "var(--accent)" }} />}
                      <span>Módulo {m.id} — {m.title}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {progressBadge}
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {expanded ? "▲" : "▼"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            }

            return (
              <li key={m.id}>
                <Link
                  href={m.href}
                  className="flex items-center justify-between gap-2 rounded-md px-2.5 py-2 transition-colors hover:brightness-110"
                  style={activeStyle}
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon size={16} className="shrink-0" style={{ color: "var(--text-muted)" }} />}
                    <span>Módulo {m.id} — {m.title}</span>
                  </span>
                  {progressBadge}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {expanded && activeModuleId === 6 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 6
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_6_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expanded && activeModuleId === 5 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 5
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_5_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expanded && activeModuleId === 4 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 4
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_4_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expanded && activeModuleId === 3 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 3
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_3_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expanded && activeModuleId === 2 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 2
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_2_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expanded && activeModuleId === 1 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 1
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_1_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2.5 py-1.5 transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                  {s.label}
                </a>
                {s.id === "sec-2" && (
                  <ul className="ml-3 space-y-1 border-l pl-2" style={{ borderColor: "var(--border)" }}>
                    {ICPS.map((icp) => (
                      <li key={icp.id}>
                        <a href={`#${icp.id}`} className="block rounded-md px-2.5 py-1 text-xs transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                          {icp.name.split("—")[0].trim()}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a href="#sec-2-1" className="block rounded-md px-2.5 py-1 text-xs transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                        2.1 Mapa de Decisores
                      </a>
                    </li>
                  </ul>
                )}
                {s.id === "sec-4" && (
                  <ul className="ml-3 space-y-1 border-l pl-2" style={{ borderColor: "var(--border)" }}>
                    <li>
                      <a href="#sec-4-1" className="block rounded-md px-2.5 py-1 text-xs transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                        4.1 Narrativa em 5 passos
                      </a>
                    </li>
                    <li>
                      <a href="#sec-4-2" className="block rounded-md px-2.5 py-1 text-xs transition-colors hover:bg-[var(--border)] hover:text-[var(--text)]">
                        4.2 Raio-X Operacional
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
