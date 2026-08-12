// Aplica as migrations do Painel Administrativo no banco apontado por
// ADMIN_DATABASE_URL. Uso: npm run db:admin:migrate
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function loadDotEnv() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!match) continue;
    const key = match[1];
    let value = (match[2] ?? "").trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadDotEnv();
  const connectionString = process.env.ADMIN_DATABASE_URL;
  if (!connectionString) {
    console.error("ADMIN_DATABASE_URL não está definida (veja .env.example).");
    process.exit(1);
  }

  const dir = path.join(__dirname, "adminMigrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  const client = new Client({ connectionString });
  await client.connect();
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(dir, file), "utf8");
      console.log(`Aplicando ${file}...`);
      await client.query(sql);
    }
    console.log("Migrations aplicadas com sucesso.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
