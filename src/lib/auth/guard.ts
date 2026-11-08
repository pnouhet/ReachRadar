import { EXTRA_APP_ROUTES, NAV_ITEMS, matchesPath, type AccountRole, type Role } from "@/lib/nav";

export type RouteAccess = { action: "allow"; setView?: Role } | { action: "redirect"; to: string };

const AUTH_ONLY_FOR_GUESTS = ["/login", "/signup", "/forgot-password"];
const HOME = "/dashboard";

/** Most specific (longest) app route that matches the path, or null for public pages. */
function appRouteFor(pathname: string): { href: string; roles: Role[] } | null {
  const candidates = [...EXTRA_APP_ROUTES, ...NAV_ITEMS].filter((r) => matchesPath(pathname, r.href));
  if (candidates.length === 0) return null;
  return candidates.reduce((a, b) => (b.href.length > a.href.length ? b : a));
}

/** False only for an app page that belongs to the other role. */
export function pageAllowedFor(pathname: string, view: Role): boolean {
  const appRoute = appRouteFor(pathname);
  return !appRoute || appRoute.roles.includes(view);
}

export function resolveRouteAccess(pathname: string, user: { role: AccountRole; view: Role } | null): RouteAccess {
  const appRoute = appRouteFor(pathname);

  if (!user) {
    if (appRoute) return { action: "redirect", to: `/login?next=${encodeURIComponent(pathname)}` };
    return { action: "allow" };
  }

  if (AUTH_ONLY_FOR_GUESTS.some((p) => matchesPath(pathname, p))) return { action: "redirect", to: HOME };

  if (user.role === "admin") {
    // Admins open every app page; a page of the other side flips their view so the sidebar matches it.
    if (appRoute && !appRoute.roles.includes(user.view)) return { action: "allow", setView: appRoute.roles[0] };
    return { action: "allow" };
  }

  if (appRoute && !appRoute.roles.includes(user.role)) return { action: "redirect", to: HOME };
  return { action: "allow" };
}
