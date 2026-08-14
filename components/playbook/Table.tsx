export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div
      className="overflow-x-auto rounded-lg border shadow-sm"
      style={{ borderColor: "var(--border)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--accent)" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--on-accent)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b transition-colors last:border-0 hover:brightness-[1.05]"
              style={{
                borderColor: "var(--border)",
                background: i % 2 === 1 ? "var(--bg)" : "transparent",
              }}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 align-top leading-relaxed"
                  style={j === 0 ? { fontWeight: 600 } : { color: "var(--text-muted)" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
