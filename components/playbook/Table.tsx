export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--accent)" }}>
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-2 text-left font-medium"
                style={{ color: "var(--on-accent)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-2 align-top"
                  style={j === 0 ? { fontWeight: 500 } : { color: "var(--text-muted)" }}
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
