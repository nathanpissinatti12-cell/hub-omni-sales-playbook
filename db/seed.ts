import { pool } from "./client";

const STAGES = [
  "Lead",
  "Qualificação",
  "Reunião",
  "Proposta",
  "Negociação",
  "Fechamento",
];

const REPS = [
  { name: "Ana Souza", email: "ana.souza@omniassessoria.com.br" },
  { name: "Bruno Lima", email: "bruno.lima@omniassessoria.com.br" },
  { name: "Carla Dias", email: "carla.dias@omniassessoria.com.br" },
  { name: "Diego Alves", email: "diego.alves@omniassessoria.com.br" },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  await pool.query(
    "TRUNCATE deal_stage_history, deals, goals, reps, pipeline_stages RESTART IDENTITY CASCADE"
  );

  const stageIds: number[] = [];
  for (let i = 0; i < STAGES.length; i++) {
    const { rows } = await pool.query(
      "INSERT INTO pipeline_stages (name, position) VALUES ($1, $2) RETURNING id",
      [STAGES[i], i + 1]
    );
    stageIds.push(rows[0].id);
  }

  const repIds: number[] = [];
  for (const rep of REPS) {
    const { rows } = await pool.query(
      "INSERT INTO reps (name, email) VALUES ($1, $2) RETURNING id",
      [rep.name, rep.email]
    );
    repIds.push(rows[0].id);
  }

  // Funil: cada etapa seguinte tem menos deals (taxa de conversão decrescente)
  const dealsPerStage = [60, 42, 30, 20, 13, 9];

  for (let s = 0; s < stageIds.length; s++) {
    const isLastStage = s === stageIds.length - 1;
    for (let i = 0; i < dealsPerStage[s]; i++) {
      const repId = repIds[randomInt(0, repIds.length - 1)];
      const valueCents = randomInt(3000, 45000) * 100;
      const createdAt = daysAgo(randomInt(1, 120));

      let status: "open" | "won" | "lost" = "open";
      let closedAt: Date | null = null;
      if (isLastStage) {
        // Nas etapas finais, parte dos deals já foi ganha ou perdida
        const roll = Math.random();
        if (roll < 0.55) {
          status = "won";
          closedAt = daysAgo(randomInt(0, 60));
        } else if (roll < 0.7) {
          status = "lost";
          closedAt = daysAgo(randomInt(0, 60));
        }
      }

      const { rows } = await pool.query(
        `INSERT INTO deals (title, value_cents, rep_id, stage_id, status, created_at, closed_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          `Oportunidade #${s + 1}-${i + 1}`,
          valueCents,
          repId,
          stageIds[s],
          status,
          createdAt,
          closedAt,
        ]
      );
      const dealId = rows[0].id;

      // Histórico simplificado: passou pelas etapas anteriores até a atual
      for (let h = 0; h <= s; h++) {
        const entered = daysAgo(randomInt(0, 120) + (s - h) * 3);
        const exited = h < s ? daysAgo(randomInt(0, 100) + (s - h - 1) * 3) : closedAt;
        await pool.query(
          `INSERT INTO deal_stage_history (deal_id, stage_id, entered_at, exited_at)
           VALUES ($1, $2, $3, $4)`,
          [dealId, stageIds[h], entered, exited]
        );
      }
    }
  }

  // Metas dos últimos 3 meses por vendedor
  const now = new Date();
  for (const repId of repIds) {
    for (let m = 0; m < 3; m++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      await pool.query(
        `INSERT INTO goals (rep_id, month, revenue_target_cents, deals_target)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (rep_id, month) DO NOTHING`,
        [repId, monthDate, randomInt(80000, 150000) * 100, randomInt(6, 12)]
      );
    }
  }

  console.log("Seed concluído.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
