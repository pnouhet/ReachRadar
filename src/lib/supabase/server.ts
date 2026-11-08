import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/db";
import { supabasePublishableKey, supabaseUrl } from "./env";

/** Supabase client bound to the current request's cookies (Server Components, Server Actions, Route Handlers). */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component: cookies are read-only there; proxy.ts refreshes the session.
        }
      },
    },
  });
}
