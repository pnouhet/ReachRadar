import { describe, expect, it } from "vitest";
import { newPasswordSchema, signInSchema, signUpSchema } from "@/lib/auth/schemas";

const validArtist = {
  role: "artist",
  displayName: "Ilan Mercier",
  email: "ilan@example.com",
  password: "midnight24",
  terms: "on",
};

describe("signUpSchema", () => {
  it("accepts a valid artist sign-up", () => {
    const r = signUpSchema.safeParse(validArtist);
    expect(r.success).toBe(true);
    expect(r.data?.displayName).toBe("Ilan Mercier");
  });

  it("rejects an unknown role", () => {
    expect(signUpSchema.safeParse({ ...validArtist, role: "admin" }).success).toBe(false);
  });

  it("rejects a one-letter name", () => {
    expect(signUpSchema.safeParse({ ...validArtist, displayName: " A " }).success).toBe(false);
  });

  it("rejects passwords under 8 characters", () => {
    expect(signUpSchema.safeParse({ ...validArtist, password: "abc1234" }).success).toBe(false);
  });

  it("requires a number in the password", () => {
    const r = signUpSchema.safeParse({ ...validArtist, password: "abcdefghij" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe("At least 8 characters with a number.");
  });

  it("requires the terms to be accepted", () => {
    expect(signUpSchema.safeParse({ ...validArtist, terms: undefined }).success).toBe(false);
  });

  it("accepts a curator with a type and a playlist link", () => {
    const r = signUpSchema.safeParse({
      ...validArtist,
      role: "curator",
      curatorType: "playlist",
      playlistLink: "https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd",
    });
    expect(r.success).toBe(true);
  });

  it("rejects a Spotify profile link where a playlist is expected", () => {
    const r = signUpSchema.safeParse({
      ...validArtist,
      role: "curator",
      curatorType: "playlist",
      playlistLink: "open.spotify.com/user/latenight",
    });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe("This is a profile link. Paste the link of one of your playlists.");
  });
});

describe("signInSchema", () => {
  it("needs an email and a password", () => {
    expect(signInSchema.safeParse({ email: "x@y.co", password: "" }).success).toBe(false);
    expect(signInSchema.safeParse({ email: "x@y.co", password: "a" }).success).toBe(true);
  });
});

describe("newPasswordSchema", () => {
  it("rejects a confirmation that does not match", () => {
    const r = newPasswordSchema.safeParse({ password: "midnight24", confirm: "midnight25" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0].message).toBe("Passwords don't match.");
  });
});
