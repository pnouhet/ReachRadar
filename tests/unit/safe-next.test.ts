import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/auth/safe-next";

describe("safeNext", () => {
  it.each([
    ["/settings/profile", "/settings/profile"],
    ["/profile/upload?track=abc#top", "/profile/upload?track=abc#top"],
    ["/dashboard", "/dashboard"],
  ])("keeps the same-site path %s", (input, expected) => {
    expect(safeNext(input)).toBe(expected);
  });

  it.each([
    undefined,
    null,
    "",
    "dashboard",
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "/\t/evil.com",
    "/\n/evil.com",
    "/\r/evil.com",
    "/%09/evil.com/..",
    "\\/evil.com",
    "/ /evil.com",
  ])("falls back to /dashboard for %j", (input) => {
    const out = safeNext(input);
    expect(new URL(out, "https://reachradar.test").origin).toBe("https://reachradar.test");
    if (input === undefined || input === null || input === "" || !input.startsWith("/") || /[\x00-\x20\\]/.test(input)) {
      expect(out).toBe("/dashboard");
    }
  });
});
