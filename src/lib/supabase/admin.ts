import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/db";
import { supabaseUrl } from "./env";

/** Service-role client. Server only — bypasses RLS. */
export function createAdminSupabase() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY is missing — fill in .env.local");
  return createClient<Database>(supabaseUrl(), key, { auth: { persistSession: false, autoRefreshToken: false } });
}
