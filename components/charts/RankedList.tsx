export function RankedList({
  title,
  items,
}: {
  title: string;
  items: { label: string; percentage: number }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <div
        className="border-b px-4 py-2.5 text-sm font-medium"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        {title}
      </div>
      <ol className="divide-y" style={{ borderColor: "var(--border)" }}>
        {items.map((item, i) => (
          <li
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-[var(--border)]/40"
          >
            {i === 0 && items.length > 1 ? (
              <span
                className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ background: "var(--accent)", color: "var(--on-accent)" }}
              >
                principal
              </span>
            ) : (
              <span className="w-[38px] shrink-0" />
            )}
            <span className="flex-1">{item.label}</span>
            <div
              className="h-2 w-24 shrink-0 overflow-hidden rounded-full"
              style={{ background: "var(--border)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%`, background: "var(--accent)" }}
              />
            </div>
            <span className="w-10 shrink-0 text-right font-semibold" style={{ color: "var(--text-muted)" }}>
              {item.percentage}%
            </span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-4 py-3 text-sm" style={{ color: "var(--text-muted)" }}>
            Sem dados.
          </li>
        )}
      </ol>
    </div>
  );
}
