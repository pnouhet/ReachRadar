import { describe, expect, it } from "vitest";
import { publishChecklist } from "@/lib/tracks/checklist";

const complete = {
  audioPath: "u/track-1.wav",
  coverPath: "u/cover-1.png",
  title: "Afterlight",
  releaseStatus: "upcoming" as const,
  genrePrimary: "Melodic techno",
  bpm: 123,
  isrc: "",
  rightsConfirmed: true,
};

describe("publishChecklist", () => {
  it("starts empty for a blank draft", () => {
    const c = publishChecklist({});
    expect(c.doneCount).toBe(0);
    expect(c.canPublish).toBe(false);
    expect(c.items.map((i) => i.label)).toEqual([
      "Mastered audio",
      "Artwork 1000 × 1000+",
      "Title and release status",
      "Genre and BPM",
      "ISRC code",
      "Rights confirmed",
    ]);
  });

  it("can publish with everything but the optional ISRC (5 / 6)", () => {
    const c = publishChecklist(complete);
    expect(c.doneCount).toBe(5);
    expect(c.canPublish).toBe(true);
    expect(c.items.find((i) => i.key === "isrc")?.optional).toBe(true);
  });

  it("cannot publish without the rights confirmation", () => {
    expect(publishChecklist({ ...complete, rightsConfirmed: false }).canPublish).toBe(false);
  });

  it("needs both genre and BPM", () => {
    expect(publishChecklist({ ...complete, bpm: null }).canPublish).toBe(false);
  });

  it("counts a valid ISRC (6 / 6)", () => {
    expect(publishChecklist({ ...complete, isrc: "FRZ032400001" }).doneCount).toBe(6);
  });
});
