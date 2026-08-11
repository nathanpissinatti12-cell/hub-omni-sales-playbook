import fs from "node:fs";
import path from "node:path";
import { pool } from "./client";

async function main() {
  const dir = path.join(__dirname, "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    console.log(`Aplicando migration: ${file}`);
    await pool.query(sql);
  }

  console.log("Migrations aplicadas com sucesso.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
