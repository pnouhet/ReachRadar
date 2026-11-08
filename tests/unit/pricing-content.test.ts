import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRICING } from "@/content/pricing";

function imagePaths(value: unknown): string[] {
  if (typeof value === "string")
    return /^\/.+\.(png|jpe?g|svg|webp|avif)$/i.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(imagePaths);
  if (value && typeof value === "object")
    return Object.values(value).flatMap(imagePaths);
  return [];
}

describe("PRICING content", () => {
  it("computes each per-credit price from the pack price", () => {
    for (const pack of PRICING.packs) {
      expect(pack.perCredit).toBe(
        (Math.round((pack.price / pack.credits) * 100) / 100).toFixed(2),
      );
    }
    expect(PRICING.packs.map((p) => p.perCredit)).toEqual([
      "1.20",
      "1.07",
      "1.01",
      "0.96",
    ]);
  });

  it("has exactly one popular pack, the Artist pack", () => {
    const popular = PRICING.packs.filter((p) => p.popular);
    expect(popular.map((p) => p.name)).toEqual(["Artist"]);
  });

  it("lists the four packs in order with their prices", () => {
    expect(PRICING.packs.map((p) => [p.name, p.credits, p.price])).toEqual([
      ["Starter", 10, 12],
      ["Artist", 30, 32],
      ["Pro", 75, 76],
      ["Label", 200, 192],
    ]);
  });

  it("has the four credit costs and six FAQ entries", () => {
    expect(PRICING.costs.map((c) => c.credits)).toEqual([1, 2, 3, 0]);
    expect(PRICING.faq).toHaveLength(6);
    for (const item of PRICING.faq)
      expect(item.answer.length).toBeGreaterThan(20);
  });

  it("only points at files that exist in public/", () => {
    const paths = imagePaths(PRICING);
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) {
      expect(existsSync(join(process.cwd(), "public", p)), p).toBe(true);
    }
  });
});
