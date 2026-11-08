import { describe, expect, it } from "vitest";
import { LEGAL_DOCS, SITE_LINKS, buyCreditsHref } from "@/lib/site";

describe("buyCreditsHref", () => {
  it("sends guests to sign up, artists to credits and curators to the dashboard", () => {
    expect(buyCreditsHref(null)).toBe("/signup");
    expect(buyCreditsHref({ role: "artist" })).toBe("/credits");
    expect(buyCreditsHref({ role: "curator" })).toBe("/dashboard");
  });
});

describe("SITE_LINKS", () => {
  const flat = SITE_LINKS.flatMap((c) => c.links);

  it("only links to internal paths", () => {
    for (const l of flat) if (l.href !== null) expect(l.href.startsWith("/")).toBe(true);
  });

  it("lists the legal documents in the Legal column", () => {
    const legal = SITE_LINKS.find((c) => c.title === "Legal")!;
    expect(legal.links.map((l) => l.href)).toEqual(LEGAL_DOCS.map((d) => "/legal/" + d.slug));
    expect(LEGAL_DOCS.map((d) => d.label)).toEqual(["Privacy policy", "GDPR", "Cookies", "Terms of use", "Legal notice"]);
  });

  it("maps every footer link", () => {
    const map = Object.fromEntries(flat.map((l) => [l.label, l.href]));
    expect(map).toMatchObject({
      "Pitch to curators": "/pitch",
      "Rate & earn": "/rate",
      "Credit packs": "/pricing",
      Catalogue: "/catalogue",
      "Artist chat": "/messages",
      "Find collabs": "/messages",
      "Success stories": "/#stories",
      Blog: null,
      About: null,
      "For curators": "/signup",
      Careers: null,
      Contact: "/legal/legal-notice#contact",
    });
  });
});
