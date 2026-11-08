import { afterAll, describe, expect, it } from "vitest";
import { TINY_PNG, adminClient, createTestUser, deleteTestUser, signedInClient, type TestUser } from "../helpers/users";

const created: TestUser[] = [];
async function make(role: string, displayName: string, extra: { curatorType?: string } = {}) {
  const u = await createTestUser({ role, displayName, ...extra });
  created.push(u);
  return u;
}

afterAll(async () => {
  for (const u of created) await deleteTestUser(u.id);
});

async function profileOf(id: string) {
  const { data, error } = await adminClient().from("profiles").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

describe("sign-up trigger", () => {
  it("creates an artist profile with a slug and mirrors the role into app_metadata", async () => {
    const u = await make("artist", "Ilan Mercier");
    const p = await profileOf(u.id);
    expect(p.role).toBe("artist");
    expect(p.slug).toMatch(/^ilan-mercier(-\d+)?$/);
    const { data } = await adminClient().auth.admin.getUserById(u.id);
    expect(data.user?.app_metadata.role).toBe("artist");
  });

  it("gives two people with the same name distinct slugs", async () => {
    const a = await make("artist", "Zed Twin Slug");
    const b = await make("artist", "Zed Twin Slug");
    expect((await profileOf(a.id)).slug).toBe("zed-twin-slug");
    expect((await profileOf(b.id)).slug).toBe("zed-twin-slug-2");
  });

  it("strips accents and emoji from slugs", async () => {
    const u = await make("artist", "Éloïse ✨ Dupontè");
    expect((await profileOf(u.id)).slug).toMatch(/^eloise-duponte(-\d+)?$/);
  });

  it("stores the curator type for professionals", async () => {
    const u = await make("curator", "Late Night Indie", { curatorType: "label" });
    const p = await profileOf(u.id);
    expect(p.role).toBe("curator");
    expect(p.curator_type).toBe("label");
  });

  it("refuses a sign-up without a valid role", async () => {
    await expect(createTestUser({ role: "admin", displayName: "Nope" })).rejects.toBeTruthy();
  });
});

describe("profiles RLS", () => {
  it("lets a user edit their own bio but not their role", async () => {
    const u = await make("artist", "Rls Owner");
    const client = await signedInClient(u.email, u.password);

    const ok = await client.from("profiles").update({ bio: "hello" }).eq("id", u.id).select().single();
    expect(ok.error).toBeNull();
    expect(ok.data?.bio).toBe("hello");

    const roleChange = await client.from("profiles").update({ role: "curator" }).eq("id", u.id);
    expect(roleChange.error).not.toBeNull();
    expect((await profileOf(u.id)).role).toBe("artist");
  });

  it("does not let a user edit someone else's profile", async () => {
    const owner = await make("artist", "Rls Victim");
    const other = await make("artist", "Rls Attacker");
    const client = await signedInClient(other.email, other.password);
    const res = await client.from("profiles").update({ bio: "hacked" }).eq("id", owner.id).select();
    expect(res.data ?? []).toHaveLength(0);
    expect((await profileOf(owner.id)).bio).toBeNull();
  });
});

describe("image storage RLS", () => {
  it("only allows uploads into the user's own folder", async () => {
    const owner = await make("artist", "Storage Owner");
    const other = await make("artist", "Storage Other");
    const client = await signedInClient(owner.email, owner.password);

    const foreign = await client.storage.from("avatars").upload(`${other.id}/a.png`, TINY_PNG, { contentType: "image/png" });
    expect(foreign.error).not.toBeNull();

    const own = await client.storage.from("avatars").upload(`${owner.id}/a.png`, TINY_PNG, { contentType: "image/png" });
    expect(own.error).toBeNull();
  });
});
