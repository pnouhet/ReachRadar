import { afterAll, describe, expect, it } from "vitest";
import { createTestUser, deleteTestUser, signedInClient, type TestUser } from "../helpers/users";
import { makeWav } from "../helpers/wav";

const created: TestUser[] = [];
async function make(role: string, name: string) {
  const u = await createTestUser({ role, displayName: name });
  created.push(u);
  return u;
}
afterAll(async () => {
  for (const u of created) await deleteTestUser(u.id);
});

describe("tracks table", () => {
  it("does not let a curator create a track", async () => {
    const c = await make("curator", "Track Curator");
    const client = await signedInClient(c.email, c.password);
    const { error } = await client.from("tracks").insert({ owner_id: c.id });
    expect(error).not.toBeNull();
  });

  it("lets an artist create an empty draft but not publish it without audio", async () => {
    const a = await make("artist", "Track Artist");
    const client = await signedInClient(a.email, a.password);
    const draft = await client.from("tracks").insert({ owner_id: a.id }).select().single();
    expect(draft.error).toBeNull();
    expect(draft.data?.status).toBe("draft");

    const publish = await client.from("tracks").update({ status: "published" }).eq("id", draft.data!.id);
    expect(publish.error).not.toBeNull();
  });

  it("does not let an artist create a track for someone else", async () => {
    const a = await make("artist", "Track Owner A");
    const b = await make("artist", "Track Owner B");
    const client = await signedInClient(a.email, a.password);
    const { error } = await client.from("tracks").insert({ owner_id: b.id });
    expect(error).not.toBeNull();
  });

  it("hides drafts from other users but shows published tracks", async () => {
    const owner = await make("artist", "Track Visible Owner");
    const other = await make("artist", "Track Visible Other");
    const ownerClient = await signedInClient(owner.email, owner.password);
    const otherClient = await signedInClient(other.email, other.password);

    const draft = await ownerClient.from("tracks").insert({ owner_id: owner.id, title: "Secret draft" }).select().single();
    const seenDraft = await otherClient.from("tracks").select("id").eq("id", draft.data!.id);
    expect(seenDraft.data ?? []).toHaveLength(0);

    const published = await ownerClient
      .from("tracks")
      .insert({
        owner_id: owner.id,
        status: "published",
        title: "Neon Rain",
        release_status: "released",
        genre_primary: "Melodic techno",
        bpm: 124,
        rights_confirmed: true,
        audio_path: `${owner.id}/track-1.wav`,
        cover_path: `${owner.id}/cover-1.png`,
      })
      .select()
      .single();
    expect(published.error).toBeNull();
    const seenPublished = await otherClient.from("tracks").select("id").eq("id", published.data!.id);
    expect(seenPublished.data).toHaveLength(1);
  });

  it("rejects an invalid ISRC and more than 3 moods", async () => {
    const a = await make("artist", "Track Checks");
    const client = await signedInClient(a.email, a.password);
    expect((await client.from("tracks").insert({ owner_id: a.id, isrc: "123" })).error).not.toBeNull();
    expect((await client.from("tracks").insert({ owner_id: a.id, moods: ["a", "b", "c", "d"] })).error).not.toBeNull();
  });
});

describe("tracks bucket", () => {
  it("only accepts audio in the owner's private folder", async () => {
    const a = await make("artist", "Bucket Owner");
    const b = await make("artist", "Bucket Other");
    const client = await signedInClient(a.email, a.password);
    const wav = makeWav(0.2);

    const foreign = await client.storage.from("tracks").upload(`${b.id}/x.wav`, wav, { contentType: "audio/wav" });
    expect(foreign.error).not.toBeNull();

    const pdf = await client.storage.from("tracks").upload(`${a.id}/x.wav`, new Uint8Array([37, 80, 68, 70]), {
      contentType: "application/pdf",
    });
    expect(pdf.error).not.toBeNull();

    const own = await client.storage.from("tracks").upload(`${a.id}/ok.wav`, wav, { contentType: "audio/wav" });
    expect(own.error).toBeNull();

    const otherClient = await signedInClient(b.email, b.password);
    const peek = await otherClient.storage.from("tracks").createSignedUrl(`${a.id}/ok.wav`, 60);
    expect(peek.error).not.toBeNull();
  });
});
