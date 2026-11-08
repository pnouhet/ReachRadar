import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { HOME } from "@/content/home";

/** Every string in HOME that looks like a public image path. */
function imagePaths(value: unknown): string[] {
  if (typeof value === "string")
    return /^\/.+\.(png|jpe?g|svg|webp|avif)$/i.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(imagePaths);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(imagePaths);
  return [];
}

describe("HOME content", () => {
  it("has the 68-bar waveform from the Figma mock, 27 of them played", () => {
    expect(HOME.rateEarn.waveform).toHaveLength(68);
    expect(HOME.rateEarn.played).toBe(27);
  });

  it("lists 4 categories, 3 promises and 3 testimonials", () => {
    expect(HOME.categories).toHaveLength(4);
    expect(HOME.promises).toHaveLength(3);
    expect(HOME.testimonials).toHaveLength(3);
  });

  it("only references images that exist under public/", () => {
    const paths = imagePaths(HOME);
    expect(paths.length).toBeGreaterThan(10);
    for (const p of paths)
      expect(existsSync(join(process.cwd(), "public", p)), p).toBe(true);
  });

  it("only links to internal paths", () => {
    const hrefs = JSON.stringify(HOME).match(/"href":"[^"]*"/g) ?? [];
    expect(hrefs.length).toBeGreaterThan(5);
    for (const h of hrefs) expect(h).toMatch(/^"href":"\/[^/]/);
  });

  it("exposes the section anchors", () => {
    expect(HOME.intro.id).toBe("get-heard");
    expect(HOME.testimonialsHead.id).toBe("stories");
  });
});
