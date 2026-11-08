import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { adminClient, createTestUser, deleteTestUser, grantAdmin, revokeAdmin, signedInClient, type TestUser } from "../helpers/users";

const created: TestUser[] = [];
async function make(role: string, name: string, confirmed = true) {
  const u = await createTestUser({ role, displayName: name, confirmed });
  created.push(u);
  return u;
}
afterAll(async () => {
  for (const u of created) await deleteTestUser(u.id);
});

async function profileOf(id: string) {
  const { data } = await adminClient().from("profiles").select("role, previous_role").eq("id", id).single();
  return data as { role: string; previous_role: string | null };
}

async function appRoleOf(id: string) {
  const { data } = await adminClient().auth.admin.getUserById(id);
  return data.user?.app_metadata?.role;
}

function publishedTrack(ownerId: string) {
  return {
    owner_id: ownerId,
    status: "published" as const,
    title: "Admin test track",
    release_status: "released" as const,
    genre_primary: "Melodic techno",
    bpm: 124,
    rights_confirmed: true,
    audio_path: `${ownerId}/track-1.wav`,
    cover_path: `${ownerId}/cover-1.png`,
  };
}

describe("granting and revoking admin", () => {
  it("grant_admin turns an artist into an admin and remembers the previous role", async () => {
    const u = await make("artist", "Admin Grant");
    await grantAdmin(u.email);
    expect(await profileOf(u.id)).toEqual({ role: "admin", previous_role: "artist" });
    expect(await appRoleOf(u.id)).toBe("admin");
  });

  it("granting twice keeps the original previous role", async () => {
    const u = await make("curator", "Admin Twice");
    await grantAdmin(u.email);
    await grantAdmin(u.email);
    expect(await profileOf(u.id)).toEqual({ role: "admin", previous_role: "curator" });
  });

  it("grant_admin refuses an unknown email and an unconfirmed account", async () => {
    const unknown = await adminClient().rpc("grant_admin", { p_email: `nobody+${randomUUID()}@example.com` });
    expect(unknown.error?.message).toMatch(/no confirmed account/);

    const u = await make("artist", "Admin Unconfirmed", false);
    const unconfirmed = await adminClient().rpc("grant_admin", { p_email: u.email });
    expect(unconfirmed.error?.message).toMatch(/no confirmed account/);
    expect((await profileOf(u.id)).role).toBe("artist");
  });

  it("signed-in users cannot call grant_admin or revoke_admin", async () => {
    const u = await make("artist", "Admin Self Grant");
    const client = await signedInClient(u.email, u.password);
    expect((await client.rpc("grant_admin", { p_email: u.email })).error).not.toBeNull();
    expect((await client.rpc("revoke_admin", { p_email: u.email })).error).not.toBeNull();
    expect((await profileOf(u.id)).role).toBe("artist");
  });

  it("a user cannot change their own role or previous_role", async () => {
    const u = await make("artist", "Admin Self Update");
    const client = await signedInClient(u.email, u.password);
    expect((await client.from("profiles").update({ role: "admin" }).eq("id", u.id)).error).not.toBeNull();
    expect((await client.from("profiles").update({ previous_role: "curator" }).eq("id", u.id)).error).not.toBeNull();
    expect(await profileOf(u.id)).toEqual({ role: "artist", previous_role: null });
  });

  it("sign-up cannot create an admin", async () => {
    const { data, error } = await adminClient().auth.admin.createUser({
      email: `rr-test+${randomUUID()}@example.com`,
      password: `Test-${randomUUID()}-9`,
      email_confirm: true,
      user_metadata: { role: "admin", display_name: "Sneaky Admin" },
    });
    if (data.user) await deleteTestUser(data.user.id);
    expect(error).not.toBeNull();
  });

  it("revoke_admin restores the previous role", async () => {
    const u = await make("artist", "Admin Revoke");
    await grantAdmin(u.email);
    await revokeAdmin(u.email);
    expect(await profileOf(u.id)).toEqual({ role: "artist", previous_role: null });
    expect(await appRoleOf(u.id)).toBe("artist");
    expect((await adminClient().rpc("revoke_admin", { p_email: u.email })).error?.message).toMatch(/is not an admin/);
  });
});

describe("what admins see and what they can do", () => {
  it("regular users cannot see an admin's profile or published track", async () => {
    const admin = await make("artist", "Hidden Admin");
    const regular = await make("artist", "Regular Viewer");
    await grantAdmin(admin.email);
    const adminDb = await signedInClient(admin.email, admin.password);
    const track = await adminDb.from("tracks").insert(publishedTrack(admin.id)).select("id").single();
    expect(track.error).toBeNull();

    const regularDb = await signedInClient(regular.email, regular.password);
    expect((await regularDb.from("profiles").select("id").eq("id", admin.id)).data).toHaveLength(0);
    expect((await regularDb.from("tracks").select("id").eq("id", track.data!.id)).data).toHaveLength(0);
    // The admin still sees their own rows.
    expect((await adminDb.from("profiles").select("id").eq("id", admin.id)).data).toHaveLength(1);
  });

  it("admins see each other but not other artists' drafts, and cannot edit other profiles", async () => {
    const a = await make("artist", "Admin A");
    const b = await make("curator", "Admin B");
    const artist = await make("artist", "Draft Owner");
    await grantAdmin(a.email);
    await grantAdmin(b.email);
    const aDb = await signedInClient(a.email, a.password);
    expect((await aDb.from("profiles").select("id").eq("id", b.id)).data).toHaveLength(1);

    const artistDb = await signedInClient(artist.email, artist.password);
    const draft = await artistDb.from("tracks").insert({ owner_id: artist.id, title: "Private" }).select("id").single();
    expect((await aDb.from("tracks").select("id").eq("id", draft.data!.id)).data).toHaveLength(0);

    const edit = await aDb.from("profiles").update({ bio: "hacked" }).eq("id", artist.id).select("id");
    expect(edit.data ?? []).toHaveLength(0);
  });

  it("an admin can create tracks", async () => {
    const u = await make("curator", "Admin Uploader");
    await grantAdmin(u.email);
    const db = await signedInClient(u.email, u.password);
    expect((await db.from("tracks").insert({ owner_id: u.id }).select("id").single()).error).toBeNull();
  });
});
