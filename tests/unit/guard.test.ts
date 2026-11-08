import { describe, expect, it } from "vitest";
import { pageAllowedFor, resolveRouteAccess } from "@/lib/auth/guard";

const artist = { role: "artist" as const, view: "artist" as const };
const curator = { role: "curator" as const, view: "curator" as const };
const adminAsArtist = { role: "admin" as const, view: "artist" as const };
const adminAsCurator = { role: "admin" as const, view: "curator" as const };

describe("resolveRouteAccess", () => {
  it("sends anonymous visitors of app pages to login with a return path", () => {
    expect(resolveRouteAccess("/dashboard", null)).toEqual({ action: "redirect", to: "/login?next=%2Fdashboard" });
    expect(resolveRouteAccess("/settings/profile", null)).toEqual({
      action: "redirect",
      to: "/login?next=%2Fsettings%2Fprofile",
    });
  });

  it.each(["/", "/login", "/signup", "/signup/artist", "/auth/confirm", "/design-system", "/forgot-password", "/pricing"])(
    "lets anonymous visitors open public page %s",
    (path) => {
      expect(resolveRouteAccess(path, null)).toEqual({ action: "allow" });
    },
  );

  it("sends signed-in users away from login and signup", () => {
    expect(resolveRouteAccess("/login", artist)).toEqual({ action: "redirect", to: "/dashboard" });
    expect(resolveRouteAccess("/signup", curator)).toEqual({ action: "redirect", to: "/dashboard" });
    expect(resolveRouteAccess("/signup/artist", artist)).toEqual({ action: "redirect", to: "/dashboard" });
  });

  it("lets signed-in users reset their password", () => {
    expect(resolveRouteAccess("/reset-password", artist)).toEqual({ action: "allow" });
  });

  it.each(["/inbox", "/playlists", "/earnings"])("keeps artists out of curator page %s", (path) => {
    expect(resolveRouteAccess(path, artist)).toEqual({ action: "redirect", to: "/dashboard" });
  });

  it.each(["/pitch", "/rate", "/credits", "/profile/upload"])("keeps curators out of artist page %s", (path) => {
    expect(resolveRouteAccess(path, curator)).toEqual({ action: "redirect", to: "/dashboard" });
  });

  it("matches nested paths by prefix", () => {
    expect(resolveRouteAccess("/pitch/anything", artist)).toEqual({ action: "allow" });
    expect(resolveRouteAccess("/pitch/anything", curator)).toEqual({ action: "redirect", to: "/dashboard" });
  });

  it("does not confuse /profile with /profile/upload for curators", () => {
    expect(resolveRouteAccess("/profile", curator)).toEqual({ action: "allow" });
  });

  it("does not treat /pitches-like prefixes as /pitch", () => {
    expect(resolveRouteAccess("/pitchfork", artist)).toEqual({ action: "allow" });
  });

  it("admins open artist and curator pages, switching the view when the page belongs to the other side", () => {
    expect(resolveRouteAccess("/pitch", adminAsArtist)).toEqual({ action: "allow" });
    expect(resolveRouteAccess("/inbox", adminAsArtist)).toEqual({ action: "allow", setView: "curator" });
    expect(resolveRouteAccess("/profile/upload", adminAsCurator)).toEqual({ action: "allow", setView: "artist" });
    expect(resolveRouteAccess("/messages", adminAsCurator)).toEqual({ action: "allow" });
    expect(resolveRouteAccess("/profile", adminAsCurator)).toEqual({ action: "allow" });
  });

  it("a forged view cookie does not widen a regular user's access", () => {
    expect(resolveRouteAccess("/inbox", { role: "artist", view: "curator" })).toEqual({ action: "redirect", to: "/dashboard" });
  });

  it("admins are kept away from login like everyone else", () => {
    expect(resolveRouteAccess("/login", adminAsArtist)).toEqual({ action: "redirect", to: "/dashboard" });
  });
});

describe("pageAllowedFor", () => {
  it("is false only for app pages of the other side", () => {
    expect(pageAllowedFor("/inbox", "artist")).toBe(false);
    expect(pageAllowedFor("/profile/upload", "curator")).toBe(false);
    expect(pageAllowedFor("/messages", "artist")).toBe(true);
    expect(pageAllowedFor("/profile", "curator")).toBe(true);
    expect(pageAllowedFor("/", "curator")).toBe(true);
  });
});
