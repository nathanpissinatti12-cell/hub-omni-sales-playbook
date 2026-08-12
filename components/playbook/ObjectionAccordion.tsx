export function ObjectionAccordion({
  tag,
  question,
  answer,
}: {
  tag?: string;
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-lg border" style={{ borderColor: "var(--border)" }}>
      <summary
        className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2 [&::-webkit-details-marker]:hidden"
        style={{ background: "var(--border)" }}
      >
        <span className="flex min-w-0 items-center gap-2">
          {tag && (
            <span
              className="shrink-0 rounded px-2 py-0.5 text-xs font-semibold"
              style={{ background: "var(--accent)", color: "var(--on-accent)" }}
            >
              {tag}
            </span>
          )}
          <span className="text-sm font-medium">{question}</span>
        </span>
        <span
          aria-hidden
          className="shrink-0 text-lg leading-none transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <p className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>
        {answer}
      </p>
    </details>
  );
}
