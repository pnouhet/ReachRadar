import {
  CircleHelp,
  Coins,
  Headphones,
  Inbox,
  LayoutDashboard,
  ListMusic,
  MessageCircle,
  Search,
  Send,
  Settings,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type Role = "artist" | "curator";

export type NavItem = { href: string; label: string; icon: LucideIcon; roles: Role[] };

const BOTH: Role[] = ["artist", "curator"];

/** Sidebar entries, in display order. Single source of truth for role access to app pages. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: BOTH },
  { href: "/pitch", label: "Pitch to curators", icon: Send, roles: ["artist"] },
  { href: "/rate", label: "Rate & earn", icon: Headphones, roles: ["artist"] },
  { href: "/inbox", label: "Inbox", icon: Inbox, roles: ["curator"] },
  { href: "/playlists", label: "My Playlists", icon: ListMusic, roles: ["curator"] },
  { href: "/catalogue", label: "Catalogue", icon: Search, roles: BOTH },
  { href: "/messages", label: "Messages", icon: MessageCircle, roles: BOTH },
  { href: "/profile", label: "My profile", icon: User, roles: BOTH },
  { href: "/credits", label: "Credits & pricing", icon: Coins, roles: ["artist"] },
  { href: "/earnings", label: "Earnings", icon: Wallet, roles: ["curator"] },
  { href: "/settings", label: "Settings", icon: Settings, roles: BOTH },
  { href: "/help", label: "Help & FAQ", icon: CircleHelp, roles: BOTH },
];

/** App routes not shown in the sidebar but restricted to a role. */
export const EXTRA_APP_ROUTES: { href: string; roles: Role[] }[] = [{ href: "/profile/upload", roles: ["artist"] }];

export function navFor(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

/** True when `pathname` is `href` or a sub-path of it. */
export function matchesPath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
