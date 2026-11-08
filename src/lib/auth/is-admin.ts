import "server-only";
import { createServerSupabase } from "@/lib/supabase/server";

/** True when the signed-in user's validated claims say admin. */
export async function isAdminRequest(): Promise<boolean> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.app_metadata?.role === "admin";
}
