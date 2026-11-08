import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/db";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

/** Browser Supabase client (singleton). Used for direct uploads to Storage. */
export function createBrowserSupabase() {
  client ??= createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
  return client;
}
