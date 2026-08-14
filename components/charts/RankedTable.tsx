export function RankedTable({
  columns,
  rows,
  preserveOrder = false,
}: {
  columns: [string, string];
  rows: { label: string; total: number }[];
  preserveOrder?: boolean;
}) {
  const displayRows = preserveOrder ? rows : [...rows].sort((a, b) => b.total - a.total);
  const max = Math.max(1, ...displayRows.map((r) => r.total));
  const topValue = displayRows[0]?.total ?? 0;

  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
            <th className="px-4 py-2.5 font-medium" style={{ color: "var(--text-muted)" }}>
              {columns[0]}
            </th>
            <th className="px-4 py-2.5 font-medium" style={{ color: "var(--text-muted)" }}>
              {columns[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((r) => {
            const widthPct = Math.max(2, (r.total / max) * 100);
            const isTop = r.total === topValue && topValue > 0 && displayRows.length > 1;
            return (
              <tr
                key={r.label}
                className="border-b transition-colors last:border-0 hover:bg-[var(--border)]/40"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    {isTop ? (
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                        style={{ background: "var(--accent)", color: "var(--on-accent)" }}
                      >
                        maior
                      </span>
                    ) : null}
                    {r.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 text-right font-semibold">{r.total}</span>
                    <div
                      className="h-2 max-w-[220px] flex-1 overflow-hidden rounded-full"
                      style={{ background: "var(--border)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${widthPct}%`, background: "var(--accent)" }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
          {displayRows.length === 0 && (
            <tr>
              <td className="px-4 py-3" colSpan={2} style={{ color: "var(--text-muted)" }}>
                Sem dados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
