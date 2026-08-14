const TONES = {
  blue: { bg: "rgba(255, 212, 0, 0.12)", border: "var(--accent)", icon: "💡" },
  green: { bg: "rgba(34, 197, 94, 0.10)", border: "#22c55e", icon: "✅" },
  gray: { bg: "var(--border)", border: "var(--text-muted)", icon: "📌" },
  tan: { bg: "rgba(217, 119, 6, 0.10)", border: "#d97706", icon: "⚠️" },
  pink: { bg: "rgba(225, 29, 72, 0.08)", border: "#e11d48", icon: "🚫" },
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
  const { bg, border, icon } = TONES[tone];
  return (
    <div
      className="flex gap-3 rounded-lg border-l-4 p-4 text-sm shadow-sm"
      style={{ background: bg, borderLeftColor: border }}
    >
      <span className="shrink-0 text-base leading-none" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        {title && <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>}
        <div className="whitespace-pre-line leading-relaxed" style={{ color: "var(--text)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
