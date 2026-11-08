import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { VIEW_COOKIE, viewRoleFor } from "@/lib/auth/view";
import type { AccountRole, Role } from "@/lib/nav";
import { createServerSupabase } from "@/lib/supabase/server";

const ACCOUNT_ROLES: AccountRole[] = ["artist", "curator", "admin"];

/** The signed-in viewer's view role (from validated claims + the view cookie), or null for guests. No database query. */
export const getViewer = cache(async (): Promise<{ role: Role } | null> => {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getClaims();
  const role = data?.claims?.app_metadata?.role as AccountRole | undefined;
  if (!data?.claims || !role || !ACCOUNT_ROLES.includes(role)) return null;
  return { role: viewRoleFor(role, (await cookies()).get(VIEW_COOKIE)?.value) };
});
