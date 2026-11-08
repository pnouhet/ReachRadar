import { describe, expect, it } from "vitest";
import { getLegalDoc } from "@/content/legal";
import { LEGAL_DOCS } from "@/lib/site";

describe("legal content", () => {
  it.each(LEGAL_DOCS.map((d) => d.slug))("%s resolves", (slug) => {
    const doc = getLegalDoc(slug);
    expect(doc?.slug).toBe(slug);
    expect(doc?.title.length).toBeGreaterThan(0);
    expect(doc?.sections.length).toBeGreaterThan(0);
  });

  it.each(LEGAL_DOCS.map((d) => d.slug))(
    "%s has unique, URL-safe section ids",
    (slug) => {
      const ids = getLegalDoc(slug)!.sections.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
    },
  );

  it("cookies has exactly one preferences block, in the preferences section", () => {
    const doc = getLegalDoc("cookies")!;
    const withBlock = doc.sections.filter((s) =>
      s.blocks.some((b) => b.kind === "preferences"),
    );
    const count = doc.sections
      .flatMap((s) => s.blocks)
      .filter((b) => b.kind === "preferences").length;
    expect(count).toBe(1);
    expect(withBlock.map((s) => s.id)).toEqual(["preferences"]);
  });

  it("legal-notice has a contact section", () => {
    expect(
      getLegalDoc("legal-notice")!.sections.some((s) => s.id === "contact"),
    ).toBe(true);
  });

  it("an unknown slug is null", () => {
    expect(getLegalDoc("nope")).toBeNull();
  });
});
