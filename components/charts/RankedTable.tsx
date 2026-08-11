export function RankedTable({
  columns,
  rows,
}: {
  columns: [string, string];
  rows: { label: string; total: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.total));

  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left" style={{ borderColor: "var(--border)" }}>
            <th className="px-4 py-2 font-medium">{columns[0]}</th>
            <th className="px-4 py-2 font-medium">{columns[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.label} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              <td className="px-4 py-2">
                {i === 0 && rows.length > 1 ? (
                  <span
                    className="mr-2 rounded px-1.5 py-0.5 text-xs font-medium text-white"
                    style={{ background: "var(--accent)" }}
                  >
                    maior
                  </span>
                ) : null}
                {r.label}
              </td>
              <td className="px-4 py-2">
                <div className="flex items-center gap-2">
                  <span>{r.total}</span>
                  <span
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${Math.max(4, (r.total / max) * 80)}px`,
                      background: "var(--accent)",
                      opacity: 0.5,
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-4 py-2" colSpan={2} style={{ color: "var(--text-muted)" }}>
                Sem dados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
