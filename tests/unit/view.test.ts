import { describe, expect, it } from "vitest";
import { viewRoleFor } from "@/lib/auth/view";

describe("viewRoleFor", () => {
  it("ignores the cookie for artists and curators", () => {
    expect(viewRoleFor("artist", "curator")).toBe("artist");
    expect(viewRoleFor("curator", "artist")).toBe("curator");
  });

  it("follows the cookie for admins", () => {
    expect(viewRoleFor("admin", "curator")).toBe("curator");
    expect(viewRoleFor("admin", "artist")).toBe("artist");
  });

  it.each([undefined, "", "admin", "<script>", "Curator"])("gives admins the artist view for cookie %j", (cookie) => {
    expect(viewRoleFor("admin", cookie)).toBe("artist");
  });
});

describe("isPrefetchRequest", () => {
  it("recognises Next.js router prefetches", async () => {
    const { isPrefetchRequest } = await import("@/lib/auth/view");
    expect(isPrefetchRequest(new Headers({ "next-router-prefetch": "1" }))).toBe(true);
    expect(isPrefetchRequest(new Headers({ rsc: "1" }))).toBe(false);
    expect(isPrefetchRequest(new Headers())).toBe(false);
  });
});
