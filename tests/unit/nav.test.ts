import { describe, expect, it } from "vitest";
import { navFor } from "@/lib/nav";

const shared = ["/dashboard", "/catalogue", "/messages", "/profile", "/settings", "/help"];

describe("navFor", () => {
  it("gives artists the artist-only entries and no curator ones", () => {
    const hrefs = navFor("artist").map((i) => i.href);
    expect(hrefs).toEqual(expect.arrayContaining([...shared, "/pitch", "/rate", "/credits"]));
    for (const h of ["/inbox", "/playlists", "/earnings"]) expect(hrefs).not.toContain(h);
  });

  it("gives curators the curator-only entries and no artist ones", () => {
    const hrefs = navFor("curator").map((i) => i.href);
    expect(hrefs).toEqual(expect.arrayContaining([...shared, "/inbox", "/playlists", "/earnings"]));
    for (const h of ["/pitch", "/rate", "/credits"]) expect(hrefs).not.toContain(h);
  });
});
