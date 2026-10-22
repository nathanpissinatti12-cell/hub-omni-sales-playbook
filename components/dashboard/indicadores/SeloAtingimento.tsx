// O selo de atingimento — bolinha colorida + porcentagem.
//
// Existe para o painel e o RMR mostrarem a MESMA coisa do mesmo jeito. Antes
// cada tela tinha a sua: o painel, bolinha e número numa linha; o RMR, o número
// com "realizada / não realizada" embaixo. Dois desenhos para a mesma pergunta
// ("bateu a meta?") fazem a pessoa reaprender a ler a cada tela.
import { CORES, CORES_AREA, corAreaDe, corDe } from "@/lib/indicadoresCalc";

export function SeloAtingimento({
  pct,
  texto,
  atingida,
  vazio = "—",
}: {
  /** Atingimento calculado. null = sem meta ou sem lançamento. */
  pct?: number | null;
  /** Rótulo pronto, quando quem chama já formatou (o RMR guarda "87,4%"). */
  texto?: string;
  /**
   * Presente = leitura BINÁRIA, verde ou vermelho, sem o âmbar do meio.
   *
   * É o modo do RMR, e a diferença não é estética: o painel mede ritmo no meio
   * do mês, onde 92% ainda é recuperável e merece âmbar; o RMR é fechamento, e
   * ali 92% é meta não batida — foi a regra definida pelo dono do projeto em
   * 20/10/2026 ("87% em vermelho, não realizada / 110% em verde, realizada").
   */
  atingida?: boolean | null;
  vazio?: string;
}) {
  const binario = atingida !== undefined;
  const semDado = binario ? atingida === null : pct === null || pct === undefined;

  if (semDado) {
    return (
      <span className="whitespace-nowrap">
        <span
          className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
          style={{ background: CORES_AREA.na }}
        />
        <span style={{ color: CORES.na }}>{vazio}</span>
      </span>
    );
  }

  const cor = binario ? (atingida ? CORES.ok : CORES.bad) : corDe(pct ?? null);
  const corPonto = binario ? (atingida ? CORES_AREA.ok : CORES_AREA.bad) : corAreaDe(pct ?? null);

  return (
    <span className="whitespace-nowrap">
      <span
        className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle"
        style={{ background: corPonto }}
      />
      <span className="tabular-nums" style={{ color: cor }}>
        {texto ?? `${(pct ?? 0).toFixed(0)}%`}
      </span>
    </span>
  );
}
