// Grants or revokes the admin role on the Supabase project in .env.local.
// Usage: npm run admin:grant -- <email>   |   npm run admin:revoke -- <email>
// Uses the secret key, so it only ever runs on a trusted machine — never in the browser.
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const [action, email] = process.argv.slice(2);
if (!["grant", "revoke"].includes(action) || !email) {
  console.error("usage: node scripts/admin.mjs grant|revoke <email>");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local");
  process.exit(1);
}

const supabase = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const { error } = await supabase.rpc(action === "grant" ? "grant_admin" : "revoke_admin", { p_email: email });
if (error) {
  // exitCode, not exit(): exiting while fetch sockets are open crashes Node on Windows.
  console.error(error.message);
  process.exitCode = 1;
} else if (action === "grant") {
  console.log(`${email} is now an admin — log out and back in to see the admin strip.`);
} else {
  const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const user = data?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  const role = user?.app_metadata?.role ?? "their previous role";
  console.log(`${email} is back to ${role}.`);
}
