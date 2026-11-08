import { describe, expect, it } from "vitest";
import { storagePath } from "@/lib/storage/paths";
import { validateImage } from "@/lib/storage/images";

function fakeFile(name: string, type: string, sizeMb: number): File {
  const f = new File(["x"], name, { type });
  Object.defineProperty(f, "size", { value: Math.round(sizeMb * 1024 * 1024) });
  return f;
}

describe("validateImage", () => {
  it("rejects GIFs", () => {
    expect(validateImage(fakeFile("a.gif", "image/gif", 1), "avatar")).toEqual({
      ok: false,
      error: "Use a JPG, PNG or WebP image.",
    });
  });

  it("caps avatars at 5 MB", () => {
    expect(validateImage(fakeFile("a.png", "image/png", 6), "avatar")).toEqual({
      ok: false,
      error: "Image too large — max 5 MB.",
    });
  });

  it("allows banners up to 10 MB", () => {
    expect(validateImage(fakeFile("b.png", "image/png", 9), "banner")).toEqual({ ok: true });
    expect(validateImage(fakeFile("b.png", "image/png", 11), "banner")).toEqual({
      ok: false,
      error: "Image too large — max 10 MB.",
    });
  });
});

describe("storagePath", () => {
  it("prefixes the user folder and timestamps the file", () => {
    expect(storagePath("u1", "avatar", "png")).toMatch(/^u1\/avatar-\d+\.png$/);
  });
});
