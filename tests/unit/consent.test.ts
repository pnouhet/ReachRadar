import { describe, expect, it } from "vitest";
import { parseConsent, serializeConsent } from "@/lib/consent";

describe("consent cookie", () => {
  it("serializes as v1.<analytics>.<marketing>", () => {
    expect(serializeConsent({ analytics: true, marketing: false })).toBe(
      "v1.1.0",
    );
  });

  it("round-trips", () => {
    for (const analytics of [true, false]) {
      for (const marketing of [true, false]) {
        expect(
          parseConsent(serializeConsent({ analytics, marketing })),
        ).toEqual({ analytics, marketing });
      }
    }
  });

  it.each([undefined, "", "v1.2.0", "v0.1.1", "v1.1", "%%%"])(
    "treats %j as no choice",
    (value) => {
      expect(parseConsent(value)).toBeNull();
    },
  );
});
