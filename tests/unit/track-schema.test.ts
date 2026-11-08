import { describe, expect, it } from "vitest";
import { trackFieldsSchema } from "@/lib/tracks/schemas";

const base = {
  title: "Afterlight",
  featuring: "",
  releaseStatus: "upcoming",
  releaseDate: "2026-11-21",
  privateLink: "",
  explicit: false,
  genrePrimary: "Melodic techno",
  genreSecondary: "",
  moods: ["Hypnotic", "Late night"],
  bpm: "123",
  musicalKey: "A minor",
  vocals: "Instrumental",
  isrc: "",
  rightsConfirmed: true,
  coverPath: "",
};

describe("trackFieldsSchema", () => {
  it("accepts the Figma example and coerces BPM", () => {
    const r = trackFieldsSchema.parse(base);
    expect(r.bpm).toBe(123);
    expect(r.featuring).toBeNull();
    expect(r.isrc).toBeNull();
  });

  it("rejects 4 moods", () => {
    expect(trackFieldsSchema.safeParse({ ...base, moods: ["Hypnotic", "Dark", "Dreamy", "Euphoric"] }).success).toBe(false);
  });

  it("rejects a BPM of 300", () => {
    expect(trackFieldsSchema.safeParse({ ...base, bpm: "300" }).success).toBe(false);
  });

  it("accepts a valid ISRC with dashes and normalises it", () => {
    expect(trackFieldsSchema.parse({ ...base, isrc: "fr-z03-24-00001" }).isrc).toBe("FRZ032400001");
  });

  it("rejects a malformed ISRC", () => {
    expect(trackFieldsSchema.safeParse({ ...base, isrc: "123" }).success).toBe(false);
  });

  it("rejects a 120-character title", () => {
    expect(trackFieldsSchema.safeParse({ ...base, title: "x".repeat(120) }).success).toBe(false);
  });

  it("lets a draft have no title or genre", () => {
    const r = trackFieldsSchema.parse({ ...base, title: "", genrePrimary: "", bpm: "", releaseStatus: "" });
    expect(r.title).toBeNull();
    expect(r.bpm).toBeNull();
    expect(r.releaseStatus).toBeNull();
  });
});
