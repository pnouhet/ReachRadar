import { describe, expect, it } from "vitest";
import { validateAudioFile } from "@/lib/audio/validate";

function fakeFile(name: string, type: string, sizeMb: number): File {
  const f = new File(["x"], name, { type });
  Object.defineProperty(f, "size", { value: Math.round(sizeMb * 1024 * 1024) });
  return f;
}

describe("validateAudioFile", () => {
  it("accepts an MP3", () => {
    expect(validateAudioFile(fakeFile("song.mp3", "audio/mpeg", 5))).toEqual({ ok: true, format: "mp3" });
  });

  it("accepts a FLAC with no MIME type (Windows often sends none)", () => {
    expect(validateAudioFile(fakeFile("song.flac", "", 30))).toEqual({ ok: true, format: "flac" });
  });

  it("accepts a WAV up to 50 MB", () => {
    expect(validateAudioFile(fakeFile("song.WAV", "audio/wav", 50))).toEqual({ ok: true, format: "wav" });
  });

  it("refuses files over 50 MB with the exact message", () => {
    expect(validateAudioFile(fakeFile("song.wav", "audio/wav", 51))).toEqual({
      ok: false,
      error: "File too large — max 50 MB. Export as MP3 or FLAC.",
    });
  });

  it("refuses other formats", () => {
    expect(validateAudioFile(fakeFile("song.ogg", "audio/ogg", 2))).toEqual({
      ok: false,
      error: "Use an MP3, FLAC or WAV file.",
    });
  });

  it("refuses an audio extension carrying a non-audio MIME type", () => {
    expect(validateAudioFile(fakeFile("song.mp3", "video/mp4", 2)).ok).toBe(false);
  });

  it("refuses empty files", () => {
    expect(validateAudioFile(fakeFile("song.mp3", "audio/mpeg", 0)).ok).toBe(false);
  });
});
