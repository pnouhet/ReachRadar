"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Role } from "@/lib/nav";
import { pageAllowedFor } from "./guard";
import { VIEW_COOKIE, VIEW_COOKIE_OPTIONS } from "./view";

/** Admin strip: show the app as `view`, staying on `pathname` when that page exists for it. */
export async function switchView(view: Role, pathname: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims?.app_metadata?.role !== "admin") return;
  if (view !== "artist" && view !== "curator") return;

  (await cookies()).set(VIEW_COOKIE, view, VIEW_COOKIE_OPTIONS);
  const stay = pathname.startsWith("/") && !pathname.startsWith("//") && pageAllowedFor(pathname, view);
  redirect(stay ? pathname : "/dashboard");
}
