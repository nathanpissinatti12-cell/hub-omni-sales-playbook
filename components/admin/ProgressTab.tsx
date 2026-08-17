import { allowedModules } from "@/lib/playbookAccess";
import { MODULE_SECTION_COUNTS } from "@/lib/moduleSectionCounts";
import type { AdminUser, ProgressEntry } from "./adminTypes";

const MODULE_IDS = [1, 2, 3, 4, 5, 6];

export function ProgressTab({
  users,
  progress,
  loading,
}: {
  users: AdminUser[];
  progress: ProgressEntry[];
  loading: boolean;
}) {
  if (loading) {
    return <p className="text-sm" style={{ color: "var(--text-muted)" }}>Carregando progresso...</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Nenhum usuário criado ainda.
      </p>
    );
  }

  const bySeenCount = new Map<string, number>(); // `${userId}:${moduleId}` -> quantidade de seções vistas

  for (const p of progress) {
    const key = `${p.user_id}:${p.module_id}`;
    bySeenCount.set(key, (bySeenCount.get(key) ?? 0) + 1);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Quantidade de seções já visualizadas por cada usuário, por módulo. Módulos fora do nível de
        acesso da pessoa aparecem em branco.
      </p>
      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--accent)" }}>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--on-accent)" }}>
                Usuário
              </th>
              {MODULE_IDS.map((m) => (
                <th key={m} className="px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--on-accent)" }}>
                  Mód. {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const allowed = allowedModules(user.access_level);
              return (
                <tr key={user.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                  <td className="px-3 py-2 align-top">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                  </td>
                  {MODULE_IDS.map((moduleId) => {
                    const canSee = allowed === "all" || allowed.includes(moduleId);
                    if (!canSee) {
                      return <td key={moduleId} className="px-3 py-2 text-center text-xs" style={{ color: "var(--border)" }}>—</td>;
                    }
                    const seen = bySeenCount.get(`${user.id}:${moduleId}`) ?? 0;
                    const total = MODULE_SECTION_COUNTS[moduleId] ?? 0;
                    const pct = total > 0 ? Math.round((seen / total) * 100) : 0;
                    const complete = total > 0 && seen >= total;
                    return (
                      <td key={moduleId} className="px-3 py-2 text-center">
                        <div className="mx-auto flex max-w-[90px] flex-col items-center gap-1">
                          <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${pct}%`, background: complete ? "#22c55e" : "var(--accent)" }}
                            />
                          </div>
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {seen}/{total}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
