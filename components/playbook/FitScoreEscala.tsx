import {
  FAIXAS,
  RESSALVAS,
  SITUACOES_EMAIL,
  SITUACOES_TELEFONE,
  type Contato,
  type NivelOrigem,
} from "@/lib/fitScore";

/**
 * Estilo de cada "pill" de contato. O nível codifica a confiança na origem:
 * boa = veio do Apollo/Hunter, media = veio de fonte pública, ausente = não existe.
 */
const PILL: Record<NivelOrigem, React.CSSProperties> = {
  boa: { borderColor: "var(--accent)", color: "var(--accent)" },
  media: { borderColor: "var(--border)", color: "var(--text-muted)" },
  ausente: { borderColor: "var(--border)", color: "var(--text-muted)", borderStyle: "dashed" },
};

function Pill({ rotulo, contato }: { rotulo: string; contato: Contato }) {
  return (
    <span
      className="inline-flex items-baseline gap-1.5 rounded-full border px-2.5 py-1 text-xs"
      style={PILL[contato.nivel]}
    >
      <span className="text-[0.62rem] font-semibold uppercase tracking-wide opacity-70">{rotulo}</span>
      <span className="font-medium">{contato.origem}</span>
    </span>
  );
}

function Situacoes({ titulo, itens }: { titulo: string; itens: { titulo: string; explicacao: string }[] }) {
  return (
    <div>
      <p
        className="mb-3 border-b pb-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: "var(--accent)", borderColor: "var(--border)" }}
      >
        {titulo}
      </p>
      <ol className="space-y-3">
        {itens.map((s, i) => (
          <li key={s.titulo} className="flex gap-3">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-[0.65rem] font-semibold"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              {String.fromCharCode(65 + i)}
            </span>
            <span>
              <span className="block text-sm font-medium">{s.titulo}</span>
              <span className="block text-xs" style={{ color: "var(--text-muted)" }}>
                {s.explicacao}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function FitScoreEscala() {
  return (
    <div className="space-y-10">
      {/* Chave de leitura */}
      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <span className="flex items-baseline gap-2">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Fit Score
          </span>
          <span className="text-xl font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
            10
          </span>
        </span>
        <span style={{ color: "var(--text-muted)" }}>=</span>
        <span className="flex items-baseline gap-2">
          <span className="text-[0.65rem] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Qualidade do Dado
          </span>
          <span className="text-xl font-semibold tabular-nums" style={{ color: "var(--accent)" }}>
            6
          </span>
        </span>
        <span style={{ color: "var(--text-muted)" }}>=</span>
        <span className="text-sm font-medium">Fixo + celular do Apollo + e-mail do gestor</span>
      </div>

      {/* A escala */}
      <section>
        <h2 className="text-base font-semibold">A escala</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Cada degrau tira uma coisa do lead perfeito: a nota, o que o lead tem, e o que ficou faltando.
        </p>

        <ul className="mt-4 space-y-2">
          {FAIXAS.map((f) => {
            const melhor = f.qualidade === 6;
            return (
              <li
                key={f.qualidade}
                className="grid gap-x-5 gap-y-3 rounded-lg border p-4 lg:grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,15rem)] lg:items-center"
                style={{
                  borderColor: melhor ? "var(--accent)" : "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div className="flex items-baseline gap-3 lg:block">
                  <p className="text-2xl font-semibold leading-none tabular-nums">
                    {f.fitScore}
                    <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                      /10
                    </span>
                  </p>
                  <p
                    className="text-[0.65rem] font-semibold uppercase tracking-wide lg:mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Qualidade <span className="text-sm">{f.qualidade}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Pill rotulo="Fixo" contato={f.fixo} />
                  <Pill rotulo="Celular" contato={f.movel} />
                  <Pill rotulo="E-mail" contato={f.email} />
                </div>

                <p
                  className="border-t pt-3 text-xs lg:border-t-0 lg:pt-0"
                  style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
                >
                  {f.falta}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Por que 6 é o teto */}
      <section className="rounded-lg border p-5" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <h2 className="text-base font-semibold">Por que 6 é o teto</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Não é um limite escolhido à toa. São quantas situações distintas o fluxo consegue produzir — só
          duas coisas determinam a qualidade do contato.
        </p>

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <Situacoes titulo="Telefone — 3 situações" itens={SITUACOES_TELEFONE} />
          <Situacoes titulo="E-mail — 2 situações" itens={SITUACOES_EMAIL} />
        </div>

        <p
          className="mt-5 flex flex-wrap items-baseline gap-2 border-t pt-4 text-sm"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <span>3 telefones × 2 e-mails =</span>
          <span className="text-lg font-semibold" style={{ color: "var(--accent)" }}>
            6
          </span>
          <span className="text-xs">
            Notas de 7 a 10 exigiriam uma informação que o fluxo ainda não coleta.
          </span>
        </p>
      </section>

      {/* Ressalvas */}
      <section>
        <h2 className="text-base font-semibold">Pontos de atenção</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Coisas que fogem do padrão da tabela e valem saber antes de usar a nota.
        </p>

        <ul className="mt-4 space-y-3">
          {RESSALVAS.map((r) => (
            <li
              key={r.titulo}
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--border)", background: "var(--surface)" }}
            >
              <p className="text-sm font-medium">{r.titulo}</p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                {r.texto}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        A nota sai do fluxo Apollo no n8n e chega no campo personalizado <strong>Qualidade do Dado</strong>.
        A conversão para Fit Score vem das regras em <strong>Prospecção › Ajustes › Fit Score</strong> — a
        Meetime normaliza os pontos entre o pior e o melhor perfil possível, por isso os pontos configurados
        (+25, +5, −5, −10, −20, −40) não são iguais às notas exibidas.
      </p>
    </div>
  );
}
