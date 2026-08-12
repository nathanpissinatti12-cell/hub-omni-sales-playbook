const TONES = {
  blue: { bg: "rgba(47, 111, 237, 0.10)", border: "var(--accent)" },
  green: { bg: "rgba(34, 197, 94, 0.10)", border: "#22c55e" },
  gray: { bg: "var(--border)", border: "var(--text-muted)" },
  tan: { bg: "rgba(217, 119, 6, 0.10)", border: "#d97706" },
  pink: { bg: "rgba(225, 29, 72, 0.08)", border: "#e11d48" },
} as const;

export function Callout({
  tone,
  title,
  children,
}: {
  tone: keyof typeof TONES;
  title?: string;
  children: React.ReactNode;
}) {
  const { bg, border } = TONES[tone];
  return (
    <div
      className="space-y-1 rounded-md border-l-4 p-4 text-sm"
      style={{ background: bg, borderLeftColor: border }}
    >
      {title && <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>}
      <div className="whitespace-pre-line" style={{ color: "var(--text)" }}>
        {children}
      </div>
    </div>
  );
}
