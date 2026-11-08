import { EXTRA_APP_ROUTES, NAV_ITEMS, matchesPath, type Role } from "@/lib/nav";

export type RouteAccess = { action: "allow" } | { action: "redirect"; to: string };

const AUTH_ONLY_FOR_GUESTS = ["/login", "/signup", "/forgot-password"];
const HOME = "/dashboard";

/** Most specific (longest) app route that matches the path, or null for public pages. */
function appRouteFor(pathname: string): { href: string; roles: Role[] } | null {
  const candidates = [...EXTRA_APP_ROUTES, ...NAV_ITEMS].filter((r) => matchesPath(pathname, r.href));
  if (candidates.length === 0) return null;
  return candidates.reduce((a, b) => (b.href.length > a.href.length ? b : a));
}

export function resolveRouteAccess(pathname: string, user: { role: Role } | null): RouteAccess {
  const appRoute = appRouteFor(pathname);

  if (!user) {
    if (appRoute) return { action: "redirect", to: `/login?next=${encodeURIComponent(pathname)}` };
    return { action: "allow" };
  }

  if (AUTH_ONLY_FOR_GUESTS.some((p) => matchesPath(pathname, p))) return { action: "redirect", to: HOME };
  if (appRoute && !appRoute.roles.includes(user.role)) return { action: "redirect", to: HOME };
  return { action: "allow" };
}
