import { describe, expect, it } from "vitest";
import { profileSchema } from "@/lib/profile/schemas";

const base = { displayName: "Ilan Mercier", bio: "", location: "", genres: [], links: {} };

describe("profileSchema", () => {
  it("accepts a minimal profile and turns empty strings into null", () => {
    const r = profileSchema.parse(base);
    expect(r.bio).toBeNull();
    expect(r.location).toBeNull();
  });

  it("rejects a bio over 300 characters", () => {
    expect(profileSchema.safeParse({ ...base, bio: "x".repeat(301) }).success).toBe(false);
  });

  it("accepts up to 5 genres and rejects a sixth", () => {
    const five = ["House", "Deep house", "Techno", "Melodic techno", "Afro house"];
    expect(profileSchema.safeParse({ ...base, genres: five }).success).toBe(true);
    expect(profileSchema.safeParse({ ...base, genres: [...five, "Drum & bass"] }).success).toBe(false);
  });

  it("rejects genres outside the list", () => {
    expect(profileSchema.safeParse({ ...base, genres: ["<script>"] }).success).toBe(false);
  });

  it("rejects javascript: links", () => {
    expect(profileSchema.safeParse({ ...base, links: { spotify: "javascript:alert(1)" } }).success).toBe(false);
  });

  it("adds https:// to bare links", () => {
    const r = profileSchema.parse({ ...base, links: { soundcloud: "soundcloud.com/ilanmercier" } });
    expect(r.links.soundcloud).toBe("https://soundcloud.com/ilanmercier");
  });

  it("keeps a full Spotify artist link", () => {
    const r = profileSchema.parse({ ...base, links: { spotify: "https://open.spotify.com/artist/x" } });
    expect(r.links.spotify).toBe("https://open.spotify.com/artist/x");
  });

  it("accepts an @handle for Instagram and TikTok", () => {
    const r = profileSchema.parse({ ...base, links: { instagram: "@ilan.mercier", tiktok: "@ilan" } });
    expect(r.links.instagram).toBe("@ilan.mercier");
  });

  it("drops empty links", () => {
    expect(profileSchema.parse({ ...base, links: { youtube: "  " } }).links).toEqual({});
  });

  it("accepts emoji in the name", () => {
    expect(profileSchema.safeParse({ ...base, displayName: "🎧 Ilan" }).success).toBe(true);
  });
});
