import Link from "next/link";
import { redirect } from "next/navigation";
import { getSiteSession } from "@/lib/getSiteSession";
import { getUserById, getUserProgress, getSuggestionsByUser, getUserFavorites } from "@/db/adminQueries";
import { isModuleAllowed } from "@/lib/playbookAccess";
import { MODULE_SECTION_COUNTS } from "@/lib/moduleSectionCounts";
import { MODULES } from "@/lib/playbookModule1";
import { PlaybookSidebar } from "@/components/playbook/PlaybookSidebar";
import { latestUpdates } from "@/lib/contentUpdates";
import { sectionLabel } from "@/lib/moduleSections";
import { WelcomeBanner } from "@/components/playbook/WelcomeBanner";

const SUGGESTION_STATUS_LABEL: Record<string, string> = {
  nova: "Enviada — aguardando análise",
  lida: "Vista pelo admin",
  arquivada: "Arquivada",
};

export default async function PlaybookHubPage() {
  const session = await getSiteSession();
  if (!session) redirect("/login");

  const [user, progress, suggestions, favorites] = await Promise.all([
    getUserById(session.uid),
    getUserProgress(session.uid),
    getSuggestionsByUser(session.uid, 5),
    getUserFavorites(session.uid),
  ]);

  const accessLevel = session.accessLevel;
  const visibleModules = MODULES.filter((m) => m.available && isModuleAllowed(accessLevel, m.id));

  const seenByModule: Record<number, number> = {};
  const lastViewedByModule: Record<number, string> = {};
  for (const p of progress) {
    seenByModule[p.module_id] = (seenByModule[p.module_id] ?? 0) + 1;
    if (!lastViewedByModule[p.module_id] || p.viewed_at > lastViewedByModule[p.module_id]) {
      lastViewedByModule[p.module_id] = p.viewed_at;
    }
  }

  let totalSeen = 0;
  let totalSections = 0;
  for (const m of visibleModules) {
    totalSeen += Math.min(seenByModule[m.id] ?? 0, MODULE_SECTION_COUNTS[m.id] ?? 0);
    totalSections += MODULE_SECTION_COUNTS[m.id] ?? 0;
  }
  const overallPct = totalSections > 0 ? Math.round((totalSeen / totalSections) * 100) : 0;

  const lastViewedModules = visibleModules
    .filter((m) => lastViewedByModule[m.id])
    .sort((a, b) => (lastViewedByModule[b.id] > lastViewedByModule[a.id] ? 1 : -1))
    .slice(0, 3);

  const firstName = (user?.name || "").split(" ")[0] || "";

  const moduleById = new Map(MODULES.map((m) => [m.id, m]));
  const highlights = latestUpdates(5).filter((u) => visibleModules.some((m) => m.id === u.moduleId));

  return (
    <>
      <PlaybookSidebar activeModuleId={0} accessLevel={accessLevel} />

      <div className="min-w-0 flex-1 space-y-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--accent)" }}>
            Playbook de Vendas — Omni Assessoria
          </p>
          <h1 className="mt-1 text-2xl font-semibold">
            {firstName ? `Olá, ${firstName}` : "Bem-vindo"}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Continue de onde parou ou explore os módulos liberados para o seu nível de acesso.
          </p>
        </div>

        <WelcomeBanner />

        {/* Destaques — o que mudou */}
        {highlights.length > 0 && (
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <p className="text-sm font-semibold">✨ O que mudou recentemente</p>
            <ul className="mt-3 space-y-2">
              {highlights.map((u) => {
                const m = moduleById.get(u.moduleId);
                return (
                  <li key={`${u.moduleId}-${u.sectionId}`}>
                    <Link
                      href={`${m?.href ?? "/playbook"}#${u.sectionId}`}
                      className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:brightness-110"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span>
                        Módulo {u.moduleId} — {u.note}
                      </span>
                      <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(`${u.date}T00:00:00`).toLocaleDateString("pt-BR")}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Progresso geral */}
        <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">Seu progresso geral</p>
            <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
              {overallPct}%
            </p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${overallPct}%`, background: "var(--accent)" }}
            />
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            {totalSeen} de {totalSections} seções vistas nos módulos liberados para você.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Continuar de onde parou */}
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <p className="text-sm font-semibold">Continuar de onde parou</p>
            {lastViewedModules.length === 0 ? (
              <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
                Você ainda não começou nenhum módulo.{" "}
                {visibleModules[0] && (
                  <Link href={visibleModules[0].href!} className="underline" style={{ color: "var(--accent)" }}>
                    Começar pelo Módulo {visibleModules[0].id}
                  </Link>
                )}
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {lastViewedModules.map((m) => {
                  const seen = seenByModule[m.id] ?? 0;
                  const total = MODULE_SECTION_COUNTS[m.id] ?? 0;
                  return (
                    <li key={m.id}>
                      <Link
                        href={m.href!}
                        className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:brightness-110"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <span>
                          Módulo {m.id} — {m.title}
                        </span>
                        <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                          {new Date(lastViewedByModule[m.id]).toLocaleDateString("pt-BR")} · {seen}/{total}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Favoritos */}
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <p className="text-sm font-semibold">★ Meus favoritos</p>
            {favorites.filter((f) => visibleModules.some((m) => m.id === f.module_id)).length === 0 ? (
              <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
                Nenhum favorito ainda. Clique em &quot;☆ Favoritar&quot; dentro de uma seção para achá-la
                rápido aqui depois.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {favorites
                  .filter((f) => visibleModules.some((m) => m.id === f.module_id))
                  .slice(0, 6)
                  .map((f) => {
                    const m = moduleById.get(f.module_id);
                    return (
                      <li key={`${f.module_id}-${f.section_id}`}>
                        <Link
                          href={`${m?.href ?? "/playbook"}#${f.section_id}`}
                          className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:brightness-110"
                          style={{ borderColor: "var(--border)" }}
                        >
                          <span className="truncate">{sectionLabel(f.module_id, f.section_id)}</span>
                          <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                            Mód. {f.module_id}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            )}
          </div>

          {/* Minhas sugestões */}
          <div className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <p className="text-sm font-semibold">Minhas sugestões recentes</p>
            {suggestions.length === 0 ? (
              <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
                Você ainda não enviou sugestões. Use o botão 💡 no canto da tela para enviar uma.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {suggestions.map((s) => (
                  <li key={s.id} className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                    <p className="line-clamp-2" style={{ color: "var(--text)" }}>
                      {s.message}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                      <span>{new Date(s.created_at).toLocaleDateString("pt-BR")}</span>
                      <span>{SUGGESTION_STATUS_LABEL[s.status] ?? s.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Todos os módulos */}
        <div>
          <p className="mb-3 text-sm font-semibold">Todos os módulos</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {MODULES.map((m) => {
              const allowed = m.available && isModuleAllowed(accessLevel, m.id);
              const seen = seenByModule[m.id] ?? 0;
              const total = MODULE_SECTION_COUNTS[m.id] ?? 0;
              const pct = total > 0 ? Math.round((Math.min(seen, total) / total) * 100) : 0;

              const content = (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      Módulo {m.id} — {m.title}
                    </span>
                    {!m.available ? (
                      <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                        em breve
                      </span>
                    ) : !allowed ? (
                      <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                        bloqueado
                      </span>
                    ) : (
                      <span className="shrink-0 text-xs" style={{ color: "var(--text-muted)" }}>
                        {pct}%
                      </span>
                    )}
                  </div>
                  {m.available && allowed && (
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--accent)" }} />
                    </div>
                  )}
                </>
              );

              if (!m.available || !allowed || !m.href) {
                return (
                  <div key={m.id} className="rounded-lg border p-4 opacity-50" style={{ borderColor: "var(--border)" }}>
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  key={m.id}
                  href={m.href}
                  className="rounded-lg border p-4 transition-colors hover:brightness-110"
                  style={{ borderColor: "var(--border)", background: "var(--surface)" }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
