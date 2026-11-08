import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is missing — fill in .env.local to run integration/e2e tests`);
  return v;
}

export function adminClient(): SupabaseClient {
  return createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type TestUser = { id: string; email: string; password: string };

type CreateTestUserOptions = {
  role: string;
  displayName: string;
  confirmed?: boolean;
  curatorType?: string;
};

/** Creates a user through the admin API (no email sent). Profile + role come from the sign-up trigger. */
export async function createTestUser({
  role,
  displayName,
  confirmed = true,
  curatorType,
}: CreateTestUserOptions): Promise<TestUser> {
  const email = `rr-test+${randomUUID()}@example.com`;
  const password = `Test-${randomUUID()}-9`;
  const { data, error } = await adminClient().auth.admin.createUser({
    email,
    password,
    email_confirm: confirmed,
    user_metadata: { role, display_name: displayName, ...(curatorType ? { curator_type: curatorType } : {}) },
  });
  if (error || !data.user) throw error ?? new Error("createUser returned no user");
  return { id: data.user.id, email, password };
}

export async function deleteTestUser(id: string): Promise<void> {
  const admin = adminClient();
  for (const bucket of ["avatars", "banners", "covers", "tracks"]) {
    const { data } = await admin.storage.from(bucket).list(id);
    if (data?.length) await admin.storage.from(bucket).remove(data.map((f) => `${id}/${f.name}`));
  }
  await admin.auth.admin.deleteUser(id);
}

export async function signedInClient(email: string, password: string): Promise<SupabaseClient> {
  const client = createClient(env("NEXT_PUBLIC_SUPABASE_URL"), env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

/** A tiny valid PNG (1×1, transparent). */
export const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

/** Turns a confirmed test user into an admin through the privileged grant_admin RPC. */
export async function grantAdmin(email: string): Promise<void> {
  const { error } = await adminClient().rpc("grant_admin", { p_email: email });
  if (error) throw error;
}

/** Gives an admin back their previous role through the privileged revoke_admin RPC. */
export async function revokeAdmin(email: string): Promise<void> {
  const { error } = await adminClient().rpc("revoke_admin", { p_email: email });
  if (error) throw error;
}
