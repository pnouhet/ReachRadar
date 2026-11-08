import { describe, expect, it } from "vitest";
import { formatBytes, formatDuration, releaseTag, trackMeta } from "@/lib/format";

describe("format helpers", () => {
  it("formats durations as m:ss", () => {
    expect(formatDuration(402)).toBe("6:42");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(null)).toBe("");
  });

  it("formats sizes in MB with one decimal", () => {
    expect(formatBytes(48.2 * 1024 * 1024)).toBe("48.2 MB");
    expect(formatBytes(512 * 1024)).toBe("0.5 MB");
  });

  it("builds the cover status tag", () => {
    expect(releaseTag("upcoming", "2026-11-21")).toBe("Upcoming · Nov 21");
    expect(releaseTag("released", null)).toBe("Released");
    expect(releaseTag("demo", null)).toBe("Demo");
    expect(releaseTag(null, null)).toBeNull();
  });

  it("joins genre, BPM and length, skipping blanks", () => {
    expect(trackMeta({ genrePrimary: "Melodic techno", bpm: 123, durationSeconds: 402 })).toBe("Melodic techno · 123 BPM · 6:42");
    expect(trackMeta({ genrePrimary: null, bpm: null, durationSeconds: 65 })).toBe("1:05");
  });
});
