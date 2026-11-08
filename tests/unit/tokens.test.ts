import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");

describe("design tokens (Figma RR Color variables)", () => {
  it.each([
    ["--color-midnight", "#0d1b2a"],
    ["--color-surface-1", "#122338"],
    ["--color-surface-2", "#182d45"],
    ["--color-surface-3", "#1f3854"],
    ["--color-rose", "#e54166"],
    ["--color-cyan", "#059bc0"],
    ["--color-slate", "#778da9"],
    ["--color-success", "#aceb98"],
    ["--color-warning", "#ffc145"],
  ])("defines %s as %s", (name, value) => {
    expect(css).toContain(`${name}: ${value};`);
  });

  it("uses the -12deg signature skew for slanted shapes", () => {
    expect(css).toMatch(/\.slant::before[\s\S]*skewX\(-12deg\)/);
  });

  it("defines the page title text style (Syne 800 40/44)", () => {
    expect(css).toMatch(/@utility text-page-title[\s\S]*?font-size: 40px;[\s\S]*?line-height: 44px;/);
  });
});
