import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { resolveRouteAccess } from "@/lib/auth/guard";
import { VIEW_COOKIE, VIEW_COOKIE_OPTIONS, isPrefetchRequest, viewRoleFor } from "@/lib/auth/view";
import type { AccountRole } from "@/lib/nav";

const ACCOUNT_ROLES: AccountRole[] = ["artist", "curator", "admin"];

/** Refreshes the Supabase session cookie and applies role-based route access. */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        for (const { name, value } of toSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const role = data?.claims?.app_metadata?.role as AccountRole | undefined;
  const user =
    data?.claims && role && ACCOUNT_ROLES.includes(role)
      ? { role, view: viewRoleFor(role, request.cookies.get(VIEW_COOKIE)?.value) }
      : null;

  const access = resolveRouteAccess(request.nextUrl.pathname, user);
  if (access.action === "redirect") {
    const redirect = NextResponse.redirect(new URL(access.to, request.url));
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  if (access.setView && !isPrefetchRequest(request.headers)) {
    // Let this very render see the new view, keep the Supabase cookies already set, and remember the view.
    request.cookies.set(VIEW_COOKIE, access.setView);
    const switched = NextResponse.next({ request });
    for (const cookie of response.cookies.getAll()) switched.cookies.set(cookie);
    switched.cookies.set(VIEW_COOKIE, access.setView, VIEW_COOKIE_OPTIONS);
    return switched;
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
