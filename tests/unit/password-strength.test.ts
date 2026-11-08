import { describe, expect, it } from "vitest";
import { passwordStrength } from "@/lib/password-strength";

describe("passwordStrength", () => {
  it.each([
    ["", 0],
    ["abcdefgh", 1],
    ["abcdefghijkl", 2],
    ["Abcdefghijkl", 3],
    ["Abcdefghijk1", 4],
  ] as const)("scores %j as %i", (pw, score) => {
    expect(passwordStrength(pw)).toBe(score);
  });
});
