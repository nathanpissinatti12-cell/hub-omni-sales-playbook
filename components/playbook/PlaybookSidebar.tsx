import Link from "next/link";
import { ICPS, MODULES, MODULE_1_SECTIONS } from "@/lib/playbookModule1";
import { MODULE_2_SECTIONS } from "@/lib/playbookModule2";
import { MODULE_3_SECTIONS } from "@/lib/playbookModule3";
import { MODULE_4_SECTIONS } from "@/lib/playbookModule4";
import { MODULE_5_SECTIONS } from "@/lib/playbookModule5";
import { MODULE_6_SECTIONS } from "@/lib/playbookModule6";

export function PlaybookSidebar({ activeModuleId }: { activeModuleId: number }) {
  return (
    <aside className="w-full shrink-0 space-y-6 text-sm lg:w-64">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          Módulos
        </p>
        <ul className="space-y-1">
          {MODULES.map((m) => {
            const isActive = m.id === activeModuleId;
            return (
              <li key={m.id}>
                {m.available && m.href ? (
                  <Link
                    href={m.href}
                    className="block rounded-md px-2 py-1.5"
                    style={
                      isActive
                        ? { background: "var(--accent)", color: "white", fontWeight: 500 }
                        : { color: "var(--text)" }
                    }
                  >
                    Módulo {m.id} — {m.title}
                  </Link>
                ) : (
                  <span
                    className="flex items-center justify-between rounded-md px-2 py-1.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Módulo {m.id} — {m.title}</span>
                    <span className="text-xs">em breve</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {activeModuleId === 6 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 6
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_6_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2 py-1 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeModuleId === 5 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 5
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_5_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2 py-1 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeModuleId === 4 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 4
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_4_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2 py-1 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeModuleId === 3 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 3
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_3_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2 py-1 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeModuleId === 2 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 2
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_2_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2 py-1 hover:underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeModuleId === 1 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Navegação — Módulo 1
          </p>
          <ul className="space-y-1" style={{ color: "var(--text-muted)" }}>
            {MODULE_1_SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block rounded-md px-2 py-1 hover:underline">
                  {s.label}
                </a>
                {s.id === "sec-2" && (
                  <ul className="ml-3 space-y-1 border-l pl-2" style={{ borderColor: "var(--border)" }}>
                    {ICPS.map((icp) => (
                      <li key={icp.id}>
                        <a href={`#${icp.id}`} className="block rounded-md px-2 py-1 text-xs hover:underline">
                          {icp.name.split("—")[0].trim()}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a href="#sec-2-1" className="block rounded-md px-2 py-1 text-xs hover:underline">
                        2.1 Mapa de Decisores
                      </a>
                    </li>
                  </ul>
                )}
                {s.id === "sec-4" && (
                  <ul className="ml-3 space-y-1 border-l pl-2" style={{ borderColor: "var(--border)" }}>
                    <li>
                      <a href="#sec-4-1" className="block rounded-md px-2 py-1 text-xs hover:underline">
                        4.1 Narrativa em 5 passos
                      </a>
                    </li>
                    <li>
                      <a href="#sec-4-2" className="block rounded-md px-2 py-1 text-xs hover:underline">
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
