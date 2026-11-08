// Runs Supabase CLI commands against the cloud project using SUPABASE_DB_URL from .env.local.
// Usage: node scripts/db.mjs push | types
import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { config } from "dotenv";

config({ path: ".env.local" });
const dbUrl = process.env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error("SUPABASE_DB_URL is missing in .env.local");
  process.exit(1);
}

const cmd = process.argv[2];
const run = (args, opts = {}) =>
  spawnSync("npx", ["supabase", ...args], { shell: process.platform === "win32", encoding: "utf8", ...opts });

if (cmd === "push") {
  const r = run(["db", "push", "--db-url", dbUrl, "--include-all", "--yes"], { stdio: "inherit" });
  process.exit(r.status ?? 1);
} else if (cmd === "types") {
  const r = run(["gen", "types", "typescript", "--db-url", dbUrl, "--schema", "public"]);
  if (r.status !== 0) {
    console.error(r.stderr);
    process.exit(r.status ?? 1);
  }
  writeFileSync("src/types/db.ts", r.stdout);
  console.log("src/types/db.ts updated");
} else {
  console.error("usage: node scripts/db.mjs push | types");
  process.exit(1);
}
