import type { AccountRole, Role } from "@/lib/nav";

/** Which side of the app an admin is looking at. Ignored for artists and curators. */
export const VIEW_COOKIE = "rr-view";

export const VIEW_COOKIE_OPTIONS = { httpOnly: true, sameSite: "lax", path: "/", maxAge: 31_536_000 } as const;

/** The role pages render for: the account's own role, or for admins the remembered view (artist by default). */
export function viewRoleFor(account: AccountRole, cookie: string | undefined): Role {
  if (account !== "admin") return account;
  return cookie === "curator" ? "curator" : "artist";
}
