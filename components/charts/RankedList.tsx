export function RankedList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <div className="border-b px-4 py-2 text-sm font-medium" style={{ borderColor: "var(--border)" }}>
        {title}
      </div>
      <ol className="divide-y" style={{ borderColor: "var(--border)" }}>
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-2 px-4 py-2 text-sm">
            {i === 0 && items.length > 1 ? (
              <span
                className="rounded px-1.5 py-0.5 text-xs font-medium text-white"
                style={{ background: "var(--accent)" }}
              >
                principal
              </span>
            ) : null}
            {item}
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-4 py-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Sem dados.
          </li>
        )}
      </ol>
    </div>
  );
}
